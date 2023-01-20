package com.florist.springbackend.service;

import com.florist.springbackend.Entity.Customer;
import com.florist.springbackend.Entity.Order;
import com.florist.springbackend.Entity.OrderItem;
import com.florist.springbackend.dao.CustomerRepository;
import com.florist.springbackend.dto.Purchase;
import com.florist.springbackend.dto.PurchaseResponse;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Set;
import java.util.UUID;

@Service
public class CheckoutServiceImpl implements CheckoutService {

    private CustomerRepository customerRepository;

    public CheckoutServiceImpl(CustomerRepository customerRepository) {
        this.customerRepository = customerRepository;
    }

    @Override
    @Transactional
    public PurchaseResponse placeOrder(Purchase purchase) {
        Order order=purchase.getOrder();

        String orderTrackingNumber=generateOrderTrackingNumber();
        order.setOrderTrackingNumber(orderTrackingNumber);

        Set<OrderItem> orderItems=purchase.getOrderItems();
        orderItems.forEach((item -> order.add(item)));


        order.setShippingAddress(purchase.getShippingAddress());

        Customer customer= purchase.getCustomer();

        customer.add(order);

        customerRepository.save(customer);

        return new PurchaseResponse(orderTrackingNumber);
    }

    private String generateOrderTrackingNumber() {
        return UUID.randomUUID().toString();
    }
}

