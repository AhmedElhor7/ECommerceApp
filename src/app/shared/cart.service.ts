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

  addToCart(productId: string) {
    const user = JSON.parse(localStorage.getItem('userData') || 'null');
    const token = user?._token;
    if (!token) {
      console.error('No token—user not logged in');
      return;
    }

    const headers = new HttpHeaders({ token });
    const body = { productId };

    this.http
      .post(`${this.baseUrl}/cart`, body, { headers })
      .pipe(
        catchError((err) => {
          console.error('API error', err);
          return throwError(() => err);
        })
      )
      .subscribe((res: any) => {
        this.cart.push(...res.data.products);
        console.log('API result:', this.cart);
      });
  }


  getCart(token: string) {
    const headers = new HttpHeaders({ token });
    return this.http.get(`${this.baseUrl}/cart`, { headers });
  } 
}
