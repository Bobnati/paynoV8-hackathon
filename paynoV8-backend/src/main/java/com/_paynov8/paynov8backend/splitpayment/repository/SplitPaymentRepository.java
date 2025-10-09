package com._paynov8.paynov8backend.splitpayment.repository;

import com._paynov8.paynov8backend.splitpayment.model.SplitPayment;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface SplitPaymentRepository extends MongoRepository<SplitPayment, String> {

    Optional<SplitPayment> findByParticipants_PaystackReference(String reference);

    List<SplitPayment> findByGroupId(String groupId);

    List<SplitPayment> findByParticipantsUserId(String userId);
}
