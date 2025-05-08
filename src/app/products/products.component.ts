import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  HttpClient,
  HttpClientModule,
  HttpHeaders,
} from '@angular/common/http';
import { catchError, finalize, Observable, tap, throwError } from 'rxjs';
import { LoadingSppinerComponent } from '../shared/loading-sppiner/loading-sppiner.component';
import { AlertComponent } from '../shared/alert/alert.component';
import {
  Product,
  ProductResponse,
  ProductCart,
} from '../interface/product.interface';
import { AuthService } from '../auth/auth.service';
import { CartProductAuthService } from '../shared/cart-product.service';

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
  cart: ProductCart[] = [];

  isLoading = false;
  alertMessage = '';
  alertType: string = '';
  activeProductId = '';

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private cartproductAuthService: CartProductAuthService
  ) {}

  ngOnInit() {
    this.fetchProducts();
  }
  /*
@description: Fetch products from the server
@returns: void
*/
  private fetchProducts(): void {
    this.isLoading = true;
    // fetch products from the server
    this.http
      .get<{ data: Product[] }>(`${this.authService.baseUrl}/products`)
      .pipe(
        tap((res) => (this.products = res.data)),
        finalize(() => (this.isLoading = false))
      )
      .subscribe();
  }

  /*
  @description: Add product to cart
  @param: productId - string
  @returns: void
  */
  addToCart(productId: string): void {
    this.activeProductId = productId;
    const headers = this.cartproductAuthService.getAuthHeaders();
    // if the user is not logged in, show the alert and stop the loading indicator
    if (!headers) {
      this.cartproductAuthService.showAlert(
        'Please login to add product to cart',
        'danger'
      );
      this.alertMessage = this.cartproductAuthService.alertMessage;
      this.alertType = this.cartproductAuthService.alertType;

      return;
    }
    this.isLoading = false;
    // add product to cart
    this.http
      .post<ProductResponse>(
        `${this.authService.baseUrl}/cart`,
        { productId },
        { headers }
      )
      .pipe(
        tap((res) => {
          // map the products to the cart
          this.cart = res.data.products.map((product) => ({
            _id: product._id,
            price: product.price,
            product,
            count: 1,
          }));
          // show the alert
          this.cartproductAuthService.showAlert(res.message, 'success');
          this.alertMessage = this.cartproductAuthService.alertMessage;
          this.alertType = this.cartproductAuthService.alertType;
        }),
        // if the server returns an error, show the alert and stop the loading indicator
        catchError((err) => this.cartproductAuthService.handleError(err, 'Failed to add to cart')),
        // stop the loading indicator
        finalize(() => (this.isLoading = false))
      )
      .subscribe();
  }
}
