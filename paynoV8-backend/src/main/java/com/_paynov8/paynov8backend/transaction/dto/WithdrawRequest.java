package com._paynov8.paynov8backend.transaction.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class WithdrawRequest {
    private String accountNumber;
    private BigDecimal amount;
    private String pin;
}