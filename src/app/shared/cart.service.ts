import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Cart } from '../interface/cart.interface';

@Injectable({ providedIn: 'root' })
export class CartService {
  public cart: Cart[] = [];
  private readonly baseUrl = 'https://ecommerce.routemisr.com/api/v1';

  constructor(private http: HttpClient) {}

  // add product to cart
  addToCart(productId: string) {
    // get the user data from the local storage
    const user = JSON.parse(localStorage.getItem('userData') || 'null');
    // get the token from the user data
    const token = user?._token;
    // check if the user is logged in
    if (!token) {
      console.error('No token—user not logged in');
      return;
    }
    // create the headers
    const headers = new HttpHeaders({ token });
    // create the body
    const body = { productId };
    // add the product to the cart
    this.http
      .post(`${this.baseUrl}/cart`, body, { headers })
      .pipe(
        catchError((err) => {
          console.error('API error', err);
          return throwError(() => err);
        })
      )
      // subscribe to the response
      .subscribe((res: any) => {
        this.cart.push(...res.data.products);
        console.log('API result:', this.cart);
      });
  }
  // get the cart
  getCart(token: string) {
    const headers = new HttpHeaders({ token });
    return this.http.get(`${this.baseUrl}/cart`, { headers });
  } 
}
