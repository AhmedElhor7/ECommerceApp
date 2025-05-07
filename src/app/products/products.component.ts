import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CartService } from '../shared/cart.service';
  import { Product } from '../interface/product.interface';



@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent implements OnInit {

  readonly baseUrl: string = 'https://ecommerce.routemisr.com/api/v1';
  products: Product[] = [];
  constructor(
    private http: HttpClient,
    private cartService: CartService
  ) {}

  // get the products from the api
  ngOnInit() {
    this.http.get<{data: Product[]}>(`${this.baseUrl}/products`).subscribe((response) => {
      this.products = response.data;
      console.log(this.products);
    });
  }
  // add product to cart
  onAddToCart(productId:string) {
    this.cartService.addToCart(productId);
    console.log(productId);

  }
}
