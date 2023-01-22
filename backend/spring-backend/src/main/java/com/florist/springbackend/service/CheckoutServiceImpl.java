package com.florist.springbackend.service;

import com.florist.springbackend.Entity.Customer;
import com.florist.springbackend.Entity.Order;
import com.florist.springbackend.Entity.OrderItem;
import com.florist.springbackend.Entity.PaymentInfo;
import com.florist.springbackend.dao.CustomerRepository;
import com.florist.springbackend.dto.Purchase;
import com.florist.springbackend.dto.PurchaseResponse;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.PropertySource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
@PropertySource("classpath:secret.properties")
public class CheckoutServiceImpl implements CheckoutService {

    private CustomerRepository customerRepository;

    public CheckoutServiceImpl(CustomerRepository customerRepository,@Value("${stripe.key.secret}") String secretKey) {
        this.customerRepository = customerRepository;
        Stripe.apiKey=secretKey;
    }

    @Override
    @Transactional
    public PurchaseResponse placeOrder(Purchase purchase) {
        Order order = purchase.getOrder();
        String orderTrackingNumber = generateOrderTrackingNumber();
        order.setOrderTrackingNumber(orderTrackingNumber);
        Set<OrderItem> orderItems = purchase.getOrderItems();
        orderItems.forEach((item -> order.add(item)));
        order.setShippingAddress(purchase.getShippingAddress());
        Customer customer = purchase.getCustomer();
        if (customerRepository.findByEmail(purchase.getCustomer().getEmail()) != null) {
            customer=customerRepository.findByEmail(purchase.getCustomer().getEmail());
        }

        customer.add(order);
        customerRepository.save(customer);
        return new PurchaseResponse(orderTrackingNumber);
    }

    @Override
    public PaymentIntent createPaymentIntent(PaymentInfo paymentInfo) throws StripeException {
        List<String> paymentMethodTypes=new ArrayList<>();
        paymentMethodTypes.add("card");
        Map<String,Object> params=new HashMap<>();
        params.put("amount",paymentInfo.getAmount());
        params.put("currency",paymentInfo.getCurrency());
        params.put("payment_method_types",paymentMethodTypes);


        return PaymentIntent.create(params);
    }

    private String generateOrderTrackingNumber() {
        return UUID.randomUUID().toString();
    }
}

