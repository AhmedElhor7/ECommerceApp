import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Product, ProductCart, ProductResponse } from "../interface/product.interface";
import { map , Observable } from "rxjs";
import { AuthService } from "../auth/auth.service";

@Injectable({ providedIn: 'root' })
export class ProductsService {
  constructor(
    private http: HttpClient,
    private authService: AuthService  ) {}

  /*
   * @description Fetch products from the server
   * @returns Observable<Product[]>
   */
  fetchProducts(): Observable<Product[]> {
    return this.http
      .get<{ data: Product[] }>(`${this.authService.baseUrl}/products`)
      .pipe(map((res) => res.data));
  }

  /**
   * @description Add a product to the cart
   * @param productId - ID of the product to add
   * @param headers - HttpHeaders containing the auth token
   * @returns Observable<ProductCart[]>  the updated cart array
   */
  addToCart(
    productId: string,
    headers: HttpHeaders
  ): Observable<ProductCart[]> {
    return this.http
      .post<ProductResponse>(
        `${this.authService.baseUrl}/cart`,
        { productId },
        { headers }
      )
      .pipe(
        map((res) =>
          res.data.products.map((prod) => ({
            _id: prod._id,
            price: prod.price,
            product: prod,
            count: 1,
          }))
        )
      );
  }
}

