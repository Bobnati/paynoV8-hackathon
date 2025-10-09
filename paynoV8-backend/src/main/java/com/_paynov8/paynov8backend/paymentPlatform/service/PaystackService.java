package com._paynov8.paynov8backend.paymentPlatform.service;

import com._paynov8.paynov8backend.paymentPlatform.dto.PayStackInitResponse;
import com._paynov8.paynov8backend.paymentPlatform.dto.PaystackVerifyResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class PaystackService {

    @Value("${paystack.secret.key}")
    private String secretKey;

    @Value("${paystack.base.url}")
    private String baseUrl;

    private final RestTemplate restTemplate = new RestTemplate();

    public PayStackInitResponse initializePayment(String email, BigDecimal amount, String callbackUrl) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(secretKey);

        Map<String, Object> body = new HashMap<>();
        body.put("email", email);
        body.put("amount",amount.multiply(BigDecimal.valueOf(100)).intValue());
        body.put("callback_url", callbackUrl);

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);

        ResponseEntity<PayStackInitResponse> response = restTemplate.postForEntity(
                baseUrl + "/transaction/initialize", request, PayStackInitResponse.class
        );

        return response.getBody();
    }

    public PaystackVerifyResponse verifyPayment(String reference) {
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(secretKey);

        HttpEntity<Void> entity = new HttpEntity<>(headers);

        ResponseEntity<PaystackVerifyResponse> response = restTemplate.exchange(
                baseUrl + "/transaction/verify/" + reference,
                HttpMethod.GET,
                entity,
                PaystackVerifyResponse.class
        );

        return response.getBody();
    }


    public String createRecipient(String name, String accountNumber, String bankCode) {
        String url = baseUrl + "/transferrecipient";

        Map<String, Object> body = Map.of(
                "type", "nuban",
                "name", name,
                "account_number", accountNumber,
                "bank_code", bankCode,
                "currency", "NGN"
        );

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(secretKey);
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);
        Map response = restTemplate.postForObject(url, request, Map.class);

        return (String) ((Map) response.get("data")).get("recipient_code");
    }

    public String initiateTransfer(BigDecimal amount, String recipientCode, String reason) {
        String url = baseUrl + "/transfer";

        Map<String, Object> body = Map.of(
                "source", "balance",
                "amount", amount.multiply(BigDecimal.valueOf(100)).intValue(),
                "recipient", recipientCode,
                "reason", reason
        );

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(secretKey);
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);
        Map response = restTemplate.postForObject(url, request, Map.class);

        return (String) ((Map) response.get("data")).get("transfer_code");
    }
}
