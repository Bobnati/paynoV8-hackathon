package com._paynov8.paynov8backend.splitpayment.model;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@Document(collection = "split_payments")
public class SplitPayment {
    @Id
    private String id;
    private String creatorId;
    private String groupId;
    private SplitType splitType;
    private String beneficiaryAccount;
    private BigDecimal totalAmount;
    private String purpose;
    private String voiceNoteUrl;
    private List<SplitParticipant> participants;
    private LocalDateTime createdAt = LocalDateTime.now();
    private String status;
}
