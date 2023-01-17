import {Component, OnInit} from '@angular/core';
import {CartService} from "../../services/cart/cart.service";
import {CartItem} from "../../common/cart-item/cart-item";

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css']
})
export class ShoppingListComponent implements OnInit {

  cartItems: CartItem[] = [];
  totalPrice: number = 0;
  totalQuantity: number = 0;

  constructor(private cartService: CartService) {
  }

  ngOnInit(): void {
    this.listCartDetails();
  }

  listCartDetails() {
    this.cartItems = this.cartService.cartItems;

    this.cartService.totalPrice.subscribe(data =>
      this.totalPrice = data)

    this.cartService.totalQuantity.subscribe(data =>
      this.totalQuantity = data)

    this.cartService.computeCartTotals();
  }
  increamentQuantity(cartItem:CartItem){
    this.cartService.addToCart(cartItem);

  }
  decreamentQuantity(cartItem:CartItem){
this.cartService.decreamentQuantity(cartItem);
  }
  removeItem(cartItem:CartItem){
this.cartService.removeItem(cartItem);
  }
}
