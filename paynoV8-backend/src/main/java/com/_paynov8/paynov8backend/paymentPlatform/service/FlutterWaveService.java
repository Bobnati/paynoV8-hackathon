package com._paynov8.paynov8backend.paymentPlatform.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class FlutterWaveService {

    private final RestTemplate restTemplate = new RestTemplate();
    @Value("${flutterwave.secret.key}")
    private String secretKey;

    @Value("${flutterwave.base.url}")
    private String baseUrl;

    public String createPaymentLink(String email, BigDecimal amount, String beneficiary) {
        Map<String, Object> body = Map.of(
                "tx_ref", UUID.randomUUID().toString(),
                "amount", amount,
                "currency", "NGN",
                "payment_options", "card,banktransfer",
                "redirect_url", "https://yourapp.com/api/flutterwave/webhook",
                "customer", Map.of("email", email),
                "customizations", Map.of("title", "Split Payment", "description", "Pay your share"),
                "meta", Map.of("beneficiary_account", beneficiary)
        );

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(secretKey);
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Map<String,Object>> request = new HttpEntity<>(body, headers);
        Map response = restTemplate.postForObject(baseUrl + "/payments", request, Map.class);

        return (String) ((Map) response.get("data")).get("link");
    }
}

