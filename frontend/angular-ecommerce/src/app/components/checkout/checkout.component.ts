import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {CartService} from "../../services/cart/cart.service";

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  checkoutFormGroup!:FormGroup;
  totalQuantity:number=0;
  totalPrice:number=0;

  constructor(private formBuilder:FormBuilder,
              private cartService:CartService) { }

  ngOnInit(): void {
    this.checkoutFormGroup=this.formBuilder.group({
      customer:this.formBuilder.group({
        firstName:[''],
        lastName:[''],
        email:['']
      }),
      shippingAddress:this.formBuilder.group({
        country:[''],
        state:[''],
        city:[''],
        zipCode:[''],
        street:['']
      }),
      creditCard:this.formBuilder.group({
        cardType:[''],
        nameOnCard:[''],
        cardNumber:[''],
        securityCode:[''],
        expMonth:[''],
        expYear:['']
      })

      });

    this.getCartDetails();
    }

  getCartDetails(){
    this.cartService.totalQuantity.subscribe(data=>{
      this.totalQuantity=data;
    })
    this.cartService.totalPrice.subscribe(data=>{
      this.totalPrice=data;

    })
  }

  onSubmit(){
    console.log("Handling the submit button");
    console.log(this.checkoutFormGroup.get('customer')?.value);
    console.log(this.checkoutFormGroup.get('creditCard')?.get('cardType')?.value);
  }
}
