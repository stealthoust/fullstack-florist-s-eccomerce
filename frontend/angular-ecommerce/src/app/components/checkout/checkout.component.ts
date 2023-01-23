import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, ValidationErrors, Validators} from "@angular/forms";
import {CartService} from "../../services/cart/cart.service";
import {MyShopService} from "../../services/myShop/my-shop.service";
import {Country} from "../../common/country/country";
import {State} from "../../common/state/state";
import {ShopValidator} from "../../validators/shop-validator";
import {environment} from "../../../environments/environment";
import {PaymentInfo} from "../../common/PaymentInfo/payment-info";
import {CheckoutService} from "../../services/checkout/checkout.service";
import {Router} from "@angular/router";
import {Order} from "../../common/order/order";
import {OrderItem} from "../../common/order-item/order-item";
import {Purchase} from "../../common/purchase/purchase";


@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  checkoutFormGroup!: FormGroup;
  totalQuantity: number = 0;
  totalPrice: number = 0;

  isAvailable:boolean=false;

  countries: Country[] = [];
  states: State[] = [];

  stripe = Stripe(environment.stripePublishableKey);

  paymentInfo: PaymentInfo = new PaymentInfo();
  cardElement: any;
  displayError: any = "";

  constructor(private formBuilder: FormBuilder,
              private cartService: CartService,
              private myShopService: MyShopService,
              private checkoutService: CheckoutService,
              private router: Router) {

  }

  ngOnInit(): void {
    this.setupStripePaymentForm();
    this.getCountries();
    this.getCartDetails();
    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: new FormControl('', [Validators.required, Validators.minLength(2), ShopValidator.notOnlyWhitespace]),
        lastName: new FormControl('', [Validators.required, Validators.minLength(2), ShopValidator.notOnlyWhitespace]),
        email: new FormControl('', [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')])
      }),
      shippingAddress: this.formBuilder.group({
        country: new FormControl('', [Validators.required]),
        state: new FormControl('', [Validators.required]),
        city: new FormControl('', [Validators.required, Validators.minLength(2), ShopValidator.notOnlyWhitespace]),
        zipCode: new FormControl('', [Validators.required, Validators.minLength(2), ShopValidator.notOnlyWhitespace]),
        street: new FormControl('', [Validators.required, Validators.minLength(2), ShopValidator.notOnlyWhitespace])
      }),
      creditCard: this.formBuilder.group(
        new FormControl('', [Validators.required])
      )

    });

  }


  getCartDetails() {
    this.cartService.totalQuantity.subscribe(data => {
      this.totalQuantity = data;
    })
    this.cartService.totalPrice.subscribe(data => {
      this.totalPrice = data;

    })
  }
  get firstName() {
    return this.checkoutFormGroup.get('customer.firstName');
  }

  get lastName() {
    return this.checkoutFormGroup.get('customer.lastName');
  }

  get email() {
    return this.checkoutFormGroup.get('customer.email');
  }

  get country() {
    return this.checkoutFormGroup.get('shippingAddress.country');
  }

  get state() {
    return this.checkoutFormGroup.get('shippingAddress.state');
  }

  get city() {
    return this.checkoutFormGroup.get('shippingAddress.city');
  }

  get zipCode() {
    return this.checkoutFormGroup.get('shippingAddress.zipCode');
  }

  get street() {
    return this.checkoutFormGroup.get('shippingAddress.street');
  }
  onSubmit() {
    if (this.checkoutFormGroup.invalid) {
      this.checkoutFormGroup.markAllAsTouched();
      console.log(this.cardElement.cardholder);

      return;
    }

    let order = new Order();

    order.totalPrice = this.totalPrice;
    order.totalQuantity = this.totalQuantity;

    const cartItems = this.cartService.cartItems;
    let orderItems: OrderItem[] = cartItems.map(tempCartItem => new OrderItem(tempCartItem));

    let purchase: Purchase = new Purchase();

    purchase.customer = this.checkoutFormGroup.controls['customer'].value;
    purchase.shippingAddress = this.checkoutFormGroup.controls['shippingAddress'].value;

    const shippingState: State = JSON.parse(JSON.stringify(purchase.shippingAddress.state));
    const shippingCountry: Country = JSON.parse(JSON.stringify(purchase.shippingAddress.country));

    purchase.shippingAddress!.state = shippingState.name;
    purchase.shippingAddress!.country = shippingCountry.name;

    purchase.order = order;
    purchase.orderItems = orderItems;

    this.paymentInfo.amount = Math.round(this.totalPrice * 100);
    this.paymentInfo.currency = "EUR";

    if (!this.checkoutFormGroup.invalid && this.displayError.textContent === "") {

      this.isAvailable=true;

      this.checkoutService.createPaymentIntent(this.paymentInfo).subscribe(
        (paymentIntentResponse) => {
          this.stripe.confirmCardPayment(paymentIntentResponse.client_secret,
            {
              payment_method: {
                card: this.cardElement,
                billing_details: {
                  email: purchase.customer.email,
                  name: `${purchase.customer.firstName} ${purchase.customer.lastName}`,
                  address: {
                    line1: purchase.shippingAddress.city,
                    city: purchase.shippingAddress.city,
                    state: purchase.shippingAddress.state,
                    postal_code: purchase.shippingAddress.zipCode,
                    country: this.country!.value.code
                  }
                }
              }
            }, {handleActions: false})
            .then((result: any) => {
              if (result.error) {
                alert(`There was an error: ${result.error.message}`);
                this.isAvailable=false;

              } else {
                this.checkoutService.placeOrder(purchase).subscribe({
                  next: (response: any) => {
                    alert(`Your order has been received.\nOrder tracking number: ${response.orderTrackingNumber}`);
                    this.resetCart();
                    this.isAvailable=false;

                  },
                  error: (err: any) => {
                    alert(`There was an error: ${err.message}`);
                    this.isAvailable=false;
                  }
                })
              }
            })
        }
      );

    }
  }


  getCountries() {
    this.myShopService.getCountries().subscribe(data => {
      this.countries = data;
    });
  }

  getStates() {
    const shippingCardFormGroup = this.checkoutFormGroup.get('shippingAddress');
    const selectedCountryCode = shippingCardFormGroup?.value.country.code;
    console.log("selectedCountryCode: " + selectedCountryCode);
    this.myShopService.getStates(selectedCountryCode).subscribe(data => {
      this.states = data;
    });
  }




  private setupStripePaymentForm() {
    var elements = this.stripe.elements({locale: 'en'});
    this.cardElement = elements.create('card', {hidePostalCode: true});
    this.cardElement.mount('#card-element');
    this.cardElement.on('change' , (event: any) => {
      this.displayError = document.getElementById('card-errors');
      if (event.complete) {
        this.displayError.textContent = "";

      } else if (event.error) {
        console.log(event.error);
        this.displayError.textContent = event.error.message;
      }
    })
  }

  private resetCart() {
    this.cartService.cartItems = [];
    this.cartService.totalPrice.next(0);
    this.cartService.totalQuantity.next(0);

    this.checkoutFormGroup.reset();
    this.router.navigateByUrl("/products");
  }
}
