import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {CartService} from "../../services/cart/cart.service";
import {MyShopService} from "../../services/myShop/my-shop.service";
import {Country} from "../../common/country/country";
import {State} from "../../common/state/state";


@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  checkoutFormGroup!: FormGroup;
  totalQuantity: number = 0;
  totalPrice: number = 0;

  creditCardMonths: number[] = [];
  creditCardYears: number[] = [];

  countries: Country[] = [];
  states: State[] = [];


  constructor(private formBuilder: FormBuilder,
              private cartService: CartService,
              private myShopService: MyShopService) {
  }

  ngOnInit(): void {
    this.getDates();
    this.getCountries();
    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: new FormControl('',[Validators.required,Validators.minLength(2)]),
        lastName: new FormControl('',[Validators.required,Validators.minLength(2)]),
        email: new FormControl('',[Validators.required,Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')])
      }),
      shippingAddress: this.formBuilder.group({
        country: [''],
        state: [''],
        city: [''],
        zipCode: [''],
        street: ['']
      }),
      creditCard: this.formBuilder.group({
        cardType: [''],
        nameOnCard: [''],
        cardNumber: [''],
        securityCode: [''],
        expMonth: [''],
        expYear: ['']
      })

    });
    this.getCartDetails();
  }


  getCartDetails() {
    this.cartService.totalQuantity.subscribe(data => {
      this.totalQuantity = data;
    })
    this.cartService.totalPrice.subscribe(data => {
      this.totalPrice = data;

    })
  }

  onSubmit() {
   if(this.checkoutFormGroup.invalid){
     this.checkoutFormGroup.markAllAsTouched();
   }
  }

  getDates() {
    const startMonth: number = new Date().getMonth() + 1;
    this.myShopService.getCreditCardMonths(startMonth).subscribe(data => {
      console.log("Retrieved credit card months: " + JSON.stringify(data));
      this.creditCardMonths = data;
    });
    this.myShopService.getCreditCardYears().subscribe(data => {
      console.log("Retrieved credit card years: " + JSON.stringify(data));
      this.creditCardYears = data;
    });
  }

  handleMonthsAndYears() {
    const creditCardFormGroup = this.checkoutFormGroup.get('creditCard');
    const currentYear: number = new Date().getFullYear();
    const selectedYear: number = Number(creditCardFormGroup?.value.expYear);
    let startMonth: number;
    if (currentYear === selectedYear) {
      startMonth = new Date().getMonth() + 1;
    } else {
      startMonth = 1;
    }
    this.myShopService.getCreditCardMonths(startMonth).subscribe(data => {
      this.creditCardMonths = data;
    });
  }

  getCountries(){
    this.myShopService.getCountries().subscribe(data=>{
      this.countries=data;
    });
  }

  getStates() {
    const shippingCardFormGroup=this.checkoutFormGroup.get('shippingAddress');
    const selectedCountryCode=shippingCardFormGroup?.value.country.code;
    console.log("selectedCountryCode: "+selectedCountryCode);
    this.myShopService.getStates(selectedCountryCode).subscribe(data=>{
      this.states=data;
    });
  }

  get firstName(){return this.checkoutFormGroup.get('customer.firstName');}
  get lastName(){return this.checkoutFormGroup.get('customer.lastName');}
  get email(){return this.checkoutFormGroup.get('customer.email');}
}
