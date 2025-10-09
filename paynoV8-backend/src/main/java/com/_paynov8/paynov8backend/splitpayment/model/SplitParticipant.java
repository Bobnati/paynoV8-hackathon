package com._paynov8.paynov8backend.splitpayment.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@Builder
public class SplitParticipant {
    private String userId;
    private BigDecimal amount;
    private boolean isPaid;
    private String paymentLink;
    private String paystackReference;
    private String providerReference;
    private String transferCode;
    private String recipientCode;

}
