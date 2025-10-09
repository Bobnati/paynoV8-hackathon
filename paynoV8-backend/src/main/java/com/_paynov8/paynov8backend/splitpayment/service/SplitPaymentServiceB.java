package com._paynov8.paynov8backend.splitpayment.service;

import com._paynov8.paynov8backend.splitpayment.dto.SplitPaymentRequest;
import com._paynov8.paynov8backend.splitpayment.model.SplitPayment;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

public interface SplitPaymentServiceB {
    SplitPayment createSplitPayment(SplitPaymentRequest request);

    Optional<SplitPayment> getPayment(String id);

    List<SplitPayment> getSplitsByGroup(String groupId);

    List<SplitPayment> getSplitsByUser(String userId);

    @Transactional
    void confirmParticipantPayment(String splitId, String participantId, String pin);
}
