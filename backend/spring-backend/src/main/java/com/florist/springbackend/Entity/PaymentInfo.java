package com.florist.springbackend.Entity;

import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;

@Data
public class PaymentInfo {

private int amount;
private String currency;


}
