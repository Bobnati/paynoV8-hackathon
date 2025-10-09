package com._paynov8.paynov8backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class PaynoV8BackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(PaynoV8BackendApplication.class, args);
	}

}
