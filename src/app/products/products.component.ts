import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  HttpClientModule,
  HttpHeaders,
} from '@angular/common/http';
import { LoadingSppinerComponent } from '../shared/loading-sppiner/loading-sppiner.component';
import { AlertComponent } from '../shared/alert/alert.component';
import {
  Product,
} from '../interface/product.interface';
import { CartProductAuthService } from '../shared/cart-product.service';
import { ProductsService } from './products.service';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    LoadingSppinerComponent,
    AlertComponent,
  ],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];

  isLoading = false;
  alertMessage = '';
  alertType: string = '';
  activeProductId = '';

  constructor(
    private cartproductAuthService: CartProductAuthService,
    private productsService: ProductsService
  ) {}

  ngOnInit() {
    this.loadProducts();
  }

  /**
@description: Fetch products from the server and populate the products array.
@returns: void
*/
  private loadProducts(): void {
    this.isLoading = true;

    this.productsService.fetchProducts().subscribe({
      next: (data: Product[]) => {
        this.products = data;
      },
      error: (err) => {
        this.alertMessage = 'Could not load products at this time.';
        this.alertType = 'danger';
        this.cartproductAuthService.showAlert(
          'Could not load products at this time.',
          'danger'
        );
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }

  /**
   * @description Add a product to the cart
   *  - retrieves auth headers
   *  - shows login alert if missing
   *  - otherwise calls service to add and updates `cart`
   * @param: productId - string
   * @returns: void
   */
  onAddToCart(productId: string): void {
    this.activeProductId = productId;
    this.alertMessage = '';

    // get auth headers
    const headers: HttpHeaders | null =
      this.cartproductAuthService.getAuthHeaders();

    // if the user is not logged in, show the alert and stop the loading indicator
    if (!headers) {
      this.alertMessage = 'Please login to add product to cart';
      this.alertType = 'danger';
      this.cartproductAuthService.showAlert(this.alertMessage, 'danger');
      this.isLoading = false;
      return;
    }

    // call addToCart
    this.productsService.addToCart(productId, headers).subscribe({
      next: (updatedCart) => {
        this.alertMessage = 'Product added to cart successfully';
        this.alertType = 'success';
        this.cartproductAuthService.showAlert(this.alertMessage, 'success');
      },
      error: (err) => {
        const msg = err.message || 'Failed to add product to cart';
        this.alertMessage = msg;
        this.alertType = 'danger';
        this.cartproductAuthService.showAlert(this.alertMessage, 'danger');
      },
      complete: () => {
        this.isLoading = false;
        setTimeout(() => (this.alertMessage = ''), 3000);
      },
    });
  }

}
