import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  HttpClientModule,
  HttpHeaders,
} from '@angular/common/http';
import { LoadingSppinerComponent } from '../shared/loading-sppiner/loading-sppiner.component';
import { AlertComponent } from '../shared/alert/alert.component';
import { CartProduct } from '../interface/cart.interface';
import { CartProductAuthService } from '../shared/cart-product.service';
import { CartService } from './cart.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    LoadingSppinerComponent,
    AlertComponent,
  ],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
})
export class CartComponent implements OnInit {
  cart: CartProduct[] = [];
  alertMessage = '';
  alertType: string = '';
  isLoading = false;

  constructor(
    private cartproductAuthService: CartProductAuthService,
    private cartService: CartService
  ) {}

  ngOnInit() {
    this.loadCart();
  }

  /**
   * @description: Fetches the cart or shows login alert if not authenticated
   * @returns void
   */
  private loadCart(): void {
    this.isLoading = true;
    this.alertMessage = '';

    // 1. Retrieve auth headers
    const headers: HttpHeaders | null =
      this.cartproductAuthService.getAuthHeaders();

    // 2. If missing token, prompt login and stop
    if (!headers) {
      this.alertMessage = 'Please login to view your cart';
      this.alertType = 'danger';
      this.cartproductAuthService.showAlert(this.alertMessage, 'danger');
      this.isLoading = false;
      return;
    }

    // 3. Load cart items
    this.cartService.fetchCart(headers).subscribe({
      next: (items: CartProduct[]) => {
        this.cart = items;
      },
      error: () => {
        this.alertMessage = 'Could not load cart at this time.';
        this.alertType = 'danger';
        this.cartproductAuthService.showAlert(this.alertMessage, 'danger');
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }

  /**
   * @description: Deletes all items in the cart
   * 1. Shows a “deleting” alert
   * 2. Checks auth headers and prompts login if missing
   * 3. Calls service to delete all
   * 4. Updates `cart` and shows success or error alert
   * @returns void
   */
  onDeleteAllCart(): void {
    this.isLoading = true;
    // 1. Inform user deletion is in progress
    this.alertMessage = 'Deleting all cart...';
    this.alertType = 'danger';
    this.cartproductAuthService.showAlert(this.alertMessage, 'danger');

    // 2. Retrieve auth headers
    const headers: HttpHeaders | null =
      this.cartproductAuthService.getAuthHeaders();
    if (!headers) {
      this.alertMessage = 'Please login to delete all cart';
      this.alertType = 'danger';
      this.cartproductAuthService.showAlert(this.alertMessage, 'danger');
      this.isLoading = false;
      return;
    }

    // 3. Delegate to service
    this.cartService.deleteAllCart(headers).subscribe({
      next: (updatedCart) => {
        // 4a. Success: clear cart and notify
        this.cart = updatedCart;
        this.alertMessage = 'All cart deleted successfully';
        this.alertType = 'success';
        this.cartproductAuthService.showAlert(this.alertMessage, 'success');
        this.isLoading = false;
      },
      error: (err) => {
        // 4b. Error: display message
        const msg = err.message || 'Failed to delete all cart';
        this.alertMessage = msg;
        this.alertType = 'danger';
        this.cartproductAuthService.showAlert(this.alertMessage, 'danger');
        this.isLoading = false;
      },
      complete: () => {
        // 5. Teardown: stop spinner and auto-clear alert
        this.isLoading = false;
        setTimeout(() => (this.alertMessage = ''), 3000);
      },
    });
  }

}
