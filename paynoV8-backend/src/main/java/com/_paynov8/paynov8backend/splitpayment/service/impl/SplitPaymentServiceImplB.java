package com._paynov8.paynov8backend.splitpayment.service.impl;

import com._paynov8.paynov8backend.Group.model.Group;
import com._paynov8.paynov8backend.Group.service.GroupService;
import com._paynov8.paynov8backend.notification.service.NotificationService;
import com._paynov8.paynov8backend.splitpayment.dto.SplitPaymentRequest;
import com._paynov8.paynov8backend.splitpayment.model.SplitParticipant;
import com._paynov8.paynov8backend.splitpayment.model.SplitPayment;
import com._paynov8.paynov8backend.splitpayment.model.SplitType;
import com._paynov8.paynov8backend.splitpayment.repository.SplitPaymentRepository;
import com._paynov8.paynov8backend.splitpayment.service.SplitPaymentServiceB;
import com._paynov8.paynov8backend.transaction.model.TransactionType;
import com._paynov8.paynov8backend.transaction.service.TransactionService;
import com._paynov8.paynov8backend.wallet.model.Wallet;
import com._paynov8.paynov8backend.wallet.service.WalletService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class SplitPaymentServiceImplB implements SplitPaymentServiceB {

    private final NotificationService notificationService;
    private final SplitPaymentRepository paymentRepository;
    private final GroupService groupService;
    private final WalletService walletService;
    private final TransactionService transactionService;

    private static final Logger logger = LoggerFactory.getLogger(SplitPaymentServiceImplB.class);

    @Override
    public SplitPayment createSplitPayment(SplitPaymentRequest request) {
        Group group = validateGroupAndMembers(request);
        List<SplitParticipant> participants = buildParticipants(request, group);

        SplitPayment payment = buildSplitPayment(request, participants);
        SplitPayment savedPayment = paymentRepository.save(payment);

        notificationService.notifyGroupParticipants(savedPayment, group);
        return savedPayment;
    }

    @Override
    public Optional<SplitPayment> getPayment(String id) {
        return paymentRepository.findById(id);
    }

    @Override
    public List<SplitPayment> getSplitsByGroup(String groupId) {
        return paymentRepository.findByGroupId(groupId);
    }

    @Override
    public List<SplitPayment> getSplitsByUser(String userId) {
        return paymentRepository.findByParticipantsUserId(userId);
    }

    @Transactional
    @Override
    public void confirmParticipantPayment(String splitId, String userId, String pin) {
        SplitPayment split = paymentRepository.findById(splitId)
                .orElseThrow(() -> new RuntimeException("Split payment not found"));

        Wallet wallet = walletService.getWallet(userId);
        String accountNumber = wallet.getAccountNumber();
        SplitParticipant participant = split.getParticipants().stream()
                .filter(p -> p.getUserId().equals(accountNumber))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Participant not found in split"));

        if (participant.isPaid())
            throw new IllegalStateException("Payment already confirmed");

        walletService.verifyPin(accountNumber, pin);
        walletService.debit(accountNumber, participant.getAmount());

        walletService.credit(split.getBeneficiaryAccount(), participant.getAmount());

        participant.setPaid(true);
        paymentRepository.save(split);

        transactionService.saveTransaction(
                TransactionType.TRANSFER,
                participant.getUserId(),
                split.getBeneficiaryAccount(),
                participant.getAmount(),
                "Split payment: " + split.getPurpose()
        );

    }

    // --- Helper Methods ---
    private Group validateGroupAndMembers(SplitPaymentRequest request) {
        Group group = groupService.findById(request.getGroupId());

        if (!group.getMemberIds().contains(request.getCreatorId())) {
            throw new RuntimeException("Creator not in group");
        }

        for (String participantId : request.getParticipantIds()) {
            if (!group.getMemberIds().contains(participantId)) {
                throw new RuntimeException("Participant not in group");
            }
        }

        return group;
    }

    private List<SplitParticipant> buildParticipants(SplitPaymentRequest request, Group group) {
        if (request.getSplitType() == SplitType.EQUAL) {
            return buildEqualParticipants(request, group);
        } else if (request.getSplitType() == SplitType.CUSTOM) {
            validateCustomSplit(request);
            return buildCustomParticipants(request);
        } else {
            throw new IllegalArgumentException("Unsupported split type: " + request.getSplitType());
        }
    }

    private List<SplitParticipant> buildCustomParticipants(SplitPaymentRequest request) {
        return request.getCustomSplits().entrySet().stream()
                .map(entry -> SplitParticipant.builder()
                        .userId(entry.getKey())
                        .amount(entry.getValue())
                        .isPaid(false)
                        .build())
                .toList();
    }

    private List<SplitParticipant> buildEqualParticipants(SplitPaymentRequest request, Group group) {
        BigDecimal totalAmount = request.getTotalAmount();
        int numberOfParticipants = request.getParticipantIds().size();

        BigDecimal equalShare = totalAmount.divide(
                BigDecimal.valueOf(numberOfParticipants),
                2,
                RoundingMode.HALF_UP
        );

        return request.getParticipantIds().stream()
                .map(id -> SplitParticipant.builder()
                        .userId(id)
                        .amount(equalShare)
                        .isPaid(false)
                        .build())
                .toList();
    }

    private SplitPayment buildSplitPayment(SplitPaymentRequest request, List<SplitParticipant> participants) {
        SplitPayment payment = new SplitPayment();
        payment.setCreatorId(request.getCreatorId());
        payment.setGroupId(request.getGroupId());
        payment.setTotalAmount(request.getTotalAmount());
        payment.setBeneficiaryAccount(request.getBeneficiaryAccount());
        payment.setPurpose(request.getPurpose());
        payment.setVoiceNoteUrl(request.getVoiceNoteUrl());
        payment.setSplitType(request.getSplitType());
        payment.setParticipants(participants);
        payment.setStatus("PENDING");
        return payment;
    }

    private void validateCustomSplit(SplitPaymentRequest request) {
        if (request.getCustomSplits() == null || request.getCustomSplits().isEmpty()) {
            throw new IllegalArgumentException("Custom splits cannot be empty for CUSTOM split type");
        }

        BigDecimal totalFromSplits = request.getCustomSplits().values().stream()
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        if (totalFromSplits.compareTo(request.getTotalAmount()) != 0) {
            throw new IllegalArgumentException(
                    String.format("Custom split total (₦%s) does not match total amount (₦%s)",
                            totalFromSplits, request.getTotalAmount())
            );
        }
    }
}
