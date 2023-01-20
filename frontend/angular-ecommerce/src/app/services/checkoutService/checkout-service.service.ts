import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment";
import {PaymentInfo} from "../../common/PaymentInfo/payment-info";
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class CheckoutServiceService {

  private paymentIntentUrl=environment.shopApiUrl+"/checkout/payment-intent";
  constructor(private httpClient:HttpClient) { }

  createPaymentIntent(paymentInfo:PaymentInfo):Observable<any>{
   return this.httpClient.post<PaymentInfo>(this.paymentIntentUrl,paymentInfo);
  }
}
