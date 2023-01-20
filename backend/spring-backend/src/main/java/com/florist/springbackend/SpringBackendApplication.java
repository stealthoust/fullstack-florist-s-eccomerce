package com.florist.springbackend;

import com.florist.springbackend.Entity.PaymentInfo;
import com.florist.springbackend.config.MyDataRestConfig;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.SpringBootConfiguration;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;

@SpringBootApplication
public class SpringBackendApplication {


	public static void main(String[] args) {
		SpringApplication.run(SpringBackendApplication.class, args);

	}


}
