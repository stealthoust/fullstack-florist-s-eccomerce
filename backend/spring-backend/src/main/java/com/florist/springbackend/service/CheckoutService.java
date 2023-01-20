package com.florist.springbackend.service;

import com.florist.springbackend.dto.Purchase;
import com.florist.springbackend.dto.PurchaseResponse;

public interface CheckoutService {
PurchaseResponse placeOrder(Purchase purchase);
}
