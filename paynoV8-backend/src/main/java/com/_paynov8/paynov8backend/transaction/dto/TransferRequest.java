package com._paynov8.paynov8backend.transaction.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class TransferRequest {
    private String sourceAccount;
    private String destinationAccount;
    private BigDecimal amount;
    private String pin;
}