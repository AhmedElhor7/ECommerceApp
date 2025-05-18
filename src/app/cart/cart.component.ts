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
   * @description: Displays an alert message with the given type using the cartproductAuthService.
   * Also sets local alertMessage and alertType properties.
   * @param message - The message to be displayed in the alert.
   * @param type - The type of the alert ('success' | 'danger').
   * @returns: void
   */
  private handleAlert(message: string, type: 'success' | 'danger'): void {
    this.alertMessage = message;
    this.alertType = type;
    this.cartproductAuthService.showAlert(message, type);
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
      this.handleAlert('Please login to view your cart', 'danger');
      this.isLoading = false;
      return;
    }

    // 3. Load cart items
    this.cartService.fetchCart(headers).subscribe({
      next: (items: CartProduct[]) => {
        this.cart = items;
      },
      error: () => {
        this.handleAlert('Could not load cart at this time.', 'danger');
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
    this.handleAlert('Deleting all cart...', 'danger');

    // 2. Retrieve auth headers
    const headers: HttpHeaders | null =
      this.cartproductAuthService.getAuthHeaders();
    if (!headers) {
      this.handleAlert('Please login to delete all cart', 'danger');
      this.isLoading = false;
      return;
    }

    // 3. Delegate to service
    this.cartService.deleteAllCart(headers).subscribe({
      next: (updatedCart) => {
        // 4a. Success: clear cart and notify
        this.cart = updatedCart;
        this.handleAlert('All cart deleted successfully', 'success');
        this.isLoading = false;
      },
      error: (err) => {
        // 4b. Error: display message
        this.handleAlert('Failed to delete all cart', 'danger');
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
