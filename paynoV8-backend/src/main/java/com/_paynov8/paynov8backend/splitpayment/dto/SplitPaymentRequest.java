package com._paynov8.paynov8backend.splitpayment.dto;

import com._paynov8.paynov8backend.splitpayment.model.SplitType;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Getter
@Setter
public class SplitPaymentRequest {
    private String groupId;
    private String creatorId;
    private BigDecimal totalAmount;
    private String beneficiaryAccount;
    private String purpose;
    private String voiceNoteUrl;
    private SplitType splitType;
    private Map<String, BigDecimal> customSplits;
    private List<String> participantIds = new ArrayList<>();

}
