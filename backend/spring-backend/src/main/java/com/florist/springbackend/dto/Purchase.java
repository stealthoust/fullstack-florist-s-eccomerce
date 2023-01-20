package com.florist.springbackend.dto;

import com.florist.springbackend.Entity.Address;
import com.florist.springbackend.Entity.Customer;
import com.florist.springbackend.Entity.Order;
import com.florist.springbackend.Entity.OrderItem;
import lombok.Data;

import java.util.Set;

@Data
public class Purchase {
    private Customer customer;
    private Address shippingAddress;
    private Order order;
    private Set<OrderItem> orderItems;

}
