package com._paynov8.paynov8backend.paymentPlatform.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class TransferRequest {
    private String source = "balance";
    private String reason;
    private BigDecimal amount;
    private String recipient;
}