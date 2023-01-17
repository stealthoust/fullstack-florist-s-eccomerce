import { Injectable } from '@angular/core';
import {CartItem} from "../../common/cart-item/cart-item";
import {BehaviorSubject, Subject} from "rxjs";
import {ToastrService} from "ngx-toastr";

@Injectable({
  providedIn: 'root'
})
export class CartService {

  cartItems:CartItem[]=[];

  totalPrice:Subject<number>=new BehaviorSubject<number>(0);
  totalQuantity:Subject<number>=new BehaviorSubject<number>(0);

  storage:Storage=localStorage;
  constructor(private toastr:ToastrService) {

    let data=JSON.parse(this.storage.getItem('cartItems')!);
    if(data!=null){
      this.cartItems=data;
      this.computeCartTotals();
    }
  }



  addToCart(theCartItem:CartItem){
    let itemExistsInCart:boolean=false;
    let existingCartItem:CartItem=new CartItem();

    if(this.cartItems.length>0){
      existingCartItem=this.cartItems.find(tempCartItem=>tempCartItem.id===theCartItem.id)!;
      itemExistsInCart=(existingCartItem!=undefined);
    }

    if(itemExistsInCart){
      existingCartItem.quantity++;
    }
    else{
      this.cartItems.push(theCartItem);
    }
  this.toastr.success("Product successfully added to cart!");
    this.computeCartTotals();
  }
//compute current quantity and value of shopping cart
   computeCartTotals() {
    let totalPriceValue:number=0;
    let totalQuantityValue:number=0;

    for(let currentCartItem of this.cartItems){
      totalPriceValue+=currentCartItem.quantity*currentCartItem.unitPrice!;
      totalQuantityValue+=currentCartItem.quantity;
    }

    this.totalPrice.next(totalPriceValue);
    this.totalQuantity.next(totalQuantityValue);

    this.logCartData(totalPriceValue,totalQuantityValue);

    this.persistsCartItems();
  }

  private logCartData(totalPriceValue: number, totalQuantityValue: number) {

    for(let tempCartItem of this.cartItems){
      const subTotalPrice=tempCartItem.quantity+tempCartItem.unitPrice!;
    }

  }

  private persistsCartItems() {
    this.storage.setItem('cartItems',JSON.stringify(this.cartItems));
  }

  decreamentQuantity(cartItem: CartItem) {
    cartItem.quantity--;
    if(cartItem.quantity===0) this.removeItem(cartItem);
    else
    {
      this.toastr.info("Quantity of product succesfully decreased");
      this.computeCartTotals();
    }
  }

   removeItem(cartItem: CartItem) {
    const itemIndex=this.cartItems.findIndex(tempItem=>tempItem.id===cartItem.id);
    if(itemIndex>-1){
      this.cartItems.splice(itemIndex,1);
      this.toastr.info("Product succesfully removed");
      this.computeCartTotals();
    }
  }
}
