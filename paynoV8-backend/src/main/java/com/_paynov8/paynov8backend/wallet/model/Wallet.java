package com._paynov8.paynov8backend.wallet.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Document("wallets")
@Data
public class Wallet {
    @Id
    private String id;
    private String userId;
    private BigDecimal balance = BigDecimal.ZERO;
    private String accountNumber;
    private AccountStatus status = AccountStatus.ACTIVE;
    private String currency = "NGN";
    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updatedAt = LocalDateTime.now();
    private String pinHashed;
}
