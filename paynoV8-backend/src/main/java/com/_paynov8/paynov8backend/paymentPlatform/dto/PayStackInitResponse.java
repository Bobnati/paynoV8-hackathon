package com._paynov8.paynov8backend.paymentPlatform.dto;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PayStackInitResponse {
    private boolean status;
    private String message;
    private PaystackInitData data;

    @Data
    public static class PaystackInitData {
        private String authorization_url;
        private String access_code;
        private String reference;
    }
}