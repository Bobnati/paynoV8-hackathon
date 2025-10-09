package com._paynov8.paynov8backend.transaction.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Document("transactions")
@Data
@Builder
public class Transaction {
    @Id
    private String id;

    private String type;
    private String reference;
    private String sourceAccount;
    private String destinationAccount;
    private BigDecimal amount;
    private String status;
    private String description;
    private String voiceNoteUrl;
    private LocalDateTime createdAt = LocalDateTime.now();
}
