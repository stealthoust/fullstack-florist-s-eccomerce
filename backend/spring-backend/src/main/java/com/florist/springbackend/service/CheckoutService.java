package com.florist.springbackend.service;

import com.florist.springbackend.Entity.PaymentInfo;
import com.florist.springbackend.dto.Purchase;
import com.florist.springbackend.dto.PurchaseResponse;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;

public interface CheckoutService {
PurchaseResponse placeOrder(Purchase purchase);
PaymentIntent createPaymentIntent(PaymentInfo paymentInfo) throws StripeException;
}
