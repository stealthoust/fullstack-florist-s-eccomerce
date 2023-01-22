package com.florist.springbackend.dao;

import com.florist.springbackend.Entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;



public interface CustomerRepository extends JpaRepository<Customer,Integer> {

    Customer findByEmail(String email);
}
