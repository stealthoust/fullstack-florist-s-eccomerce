import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {PaymentInfo} from "../../common/PaymentInfo/payment-info";
import {Observable} from "rxjs";
import {Purchase} from "../../common/purchase/purchase";

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {

  private purchaseUrl='http://localhost:8080/api/checkout/purchase';
  private paymentIntentUrl=environment.shopApiUrl+"/checkout/payment-intent";
  constructor(private httpClient:HttpClient) { }

  createPaymentIntent(paymentInfo:PaymentInfo):Observable<any>{
    return this.httpClient.post<PaymentInfo>(this.paymentIntentUrl,paymentInfo);
  }

  placeOrder(purchase:Purchase):Observable<any>{
    return this.httpClient.post<Purchase>(this.purchaseUrl,purchase);
  }
}
