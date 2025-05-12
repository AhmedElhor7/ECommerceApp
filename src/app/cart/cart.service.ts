import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AuthService } from "../auth/auth.service";
import { CartProduct, CartResponse } from "../interface/cart.interface";
import { map, Observable } from "rxjs";

@Injectable({ providedIn: 'root' })
export class CartService {
  constructor(private http: HttpClient, private authService: AuthService) {}

  /**
   * @description: Load the user’s cart from the server
   * @param headers - HttpHeaders containing the auth token
   * @returns Observable<CartProduct[]> - the mapped cart items
   */
  fetchCart(headers: HttpHeaders): Observable<CartProduct[]> {
    return this.http
      .get<CartResponse>(`${this.authService.baseUrl}/cart`, { headers })
      .pipe(
        map((res) =>
          res.data.products.map((item) => ({
            _id: item._id,
            price: item.price,
            product: item.product,
            count: item.count,
          }))
        )
      );
  }

  /**
   * @description: Remove all items from the user’s cart
   * @param headers - HttpHeaders containing the auth token
   * @returns Observable<CartProduct[]>  updated (empty) cart array
   */
  deleteAllCart(headers: HttpHeaders): Observable<CartProduct[]> {
    return this.http
      .delete<CartResponse>(`${this.authService.baseUrl}/cart`, { headers })
      .pipe(
        // Guard against missing data and map to CartProduct[]
        map((res) => {
          const items = res.data?.products ?? [];
          return items.map((item) => ({
            _id: item._id,
            price: item.price,
            product: item.product,
            count: item.count,
          }));
        })
      );
  }
}

