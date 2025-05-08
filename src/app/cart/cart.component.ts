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
import { CartProduct, CartResponse } from '../interface/cart.interface';
import { AuthService } from '../auth/auth.service';
import { CartProductAuthService } from '../shared/cart-product.service';

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
    private http: HttpClient,
    private authService: AuthService,
    private cartproductAuthService: CartProductAuthService
  ) {}

  ngOnInit() {
    this.loadCart();
  }

  /*
  @description: Load the cart from the server
  @returns: void
  */
  private loadCart(): void {
    this.isLoading = true;
    const headers = this.cartproductAuthService.getAuthHeaders();
    // if the user is not logged in, show the alert and stop the loading indicator
    if (!headers) {
      this.cartproductAuthService.showAlert(
        'Please login to view cart',
        'danger'
      );
      this.alertMessage = this.cartproductAuthService.alertMessage;
      this.alertType = this.cartproductAuthService.alertType;
      this.isLoading = false;
      return;
    }

    // get the cart from the server
    this.http
      .get<CartResponse>(`${this.authService.baseUrl}/cart`, { headers })
      .pipe(
        tap((fullRes) => {
          this.cart = fullRes.data.products;
        }),
        // if the server returns an error, show the alert and stop the loading indicator
        catchError((err) => this.cartproductAuthService.handleError(err, 'Failed to load cart')),
        // stop the loading indicator
        finalize(() => {
          this.isLoading = false;
          this.cartproductAuthService.showAlert(
            'Cart loaded successfully',
            'success'
          );
          this.alertMessage = this.cartproductAuthService.alertMessage;
          this.alertType = this.cartproductAuthService.alertType;
        })
      )
      .subscribe();
  }

  /*
  @description: Delete all cart
  @returns: void
  */
  deleteAllCart(): void {
    this.isLoading = true;
    this.cartproductAuthService.showAlert('Deleting all cart...', 'danger');
    this.alertMessage = this.cartproductAuthService.alertMessage;
    this.alertType = this.cartproductAuthService.alertType;

    const headers = this.cartproductAuthService.getAuthHeaders();
    // if the user is not logged in, show the alert and stop the loading indicator
    if (!headers) {
      this.cartproductAuthService.showAlert(
        'Please login to delete all cart',
        'danger'
      );
      this.alertMessage = this.cartproductAuthService.alertMessage;
      this.alertType = this.cartproductAuthService.alertType;
      this.isLoading = false;
      return;
    }
    // delete all cart
    this.http
      .delete<CartResponse>(`${this.authService.baseUrl}/cart`, { headers })
      .pipe(
        tap((fullRes) => {
          this.cart = fullRes.data?.products ?? [];
          this.cartproductAuthService.showAlert(
            'All cart deleted successfully',
            'success'
          );
          this.alertMessage = this.cartproductAuthService.alertMessage;
          this.alertType = this.cartproductAuthService.alertType;
        }),
        // if the server returns an error, show the alert and stop the loading indicator
        catchError((err) =>
          this.cartproductAuthService.handleError(
            err,
            'Failed to delete all cart'
          )
        ),
        // stop the loading indicator
        finalize(() => (this.isLoading = false))
      )
      .subscribe();
  }
}
