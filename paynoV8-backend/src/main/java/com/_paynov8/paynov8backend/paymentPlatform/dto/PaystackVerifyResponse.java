package com._paynov8.paynov8backend.paymentPlatform.dto;


import lombok.Data;

@Data
public class PaystackVerifyResponse {
    private boolean status;
    private String message;
    private PaystackVerifyData data;

    @Data
    public static class PaystackVerifyData {
        private String status;
        private String reference;
        private int amount;
        private String gateway_response;
    }
}
