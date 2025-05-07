import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../shared/cart.service';
@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
  providers:[CartService]
})
export class CartComponent implements OnInit {
  cart: any[] = [];
  constructor(private cartService: CartService) {}
  ngOnInit() {
    const user = JSON.parse(localStorage.getItem('userData') || 'null');
    const token = user?._token;
    if (!token) {
      console.error('No token—user not logged in');
      return;
    }
    this.cartService.getCart(token).subscribe((res: any) => {
      this.cart = res.data.products;
      console.log(this.cart);
    });
  }


}
