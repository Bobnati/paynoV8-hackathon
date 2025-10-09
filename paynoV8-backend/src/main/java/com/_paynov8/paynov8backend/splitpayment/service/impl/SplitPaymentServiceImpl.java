package com._paynov8.paynov8backend.splitpayment.service.impl;

import com._paynov8.paynov8backend.Group.service.GroupService;
import com._paynov8.paynov8backend.notification.service.NotificationService;
import com._paynov8.paynov8backend.paymentPlatform.dto.PayStackInitResponse;
import com._paynov8.paynov8backend.paymentPlatform.service.FlutterWaveService;
import com._paynov8.paynov8backend.paymentPlatform.service.PaystackService;
import com._paynov8.paynov8backend.splitpayment.dto.SplitPaymentRequest;
import com._paynov8.paynov8backend.Group.model.Group;
import com._paynov8.paynov8backend.splitpayment.model.SplitPayment;
import com._paynov8.paynov8backend.splitpayment.model.SplitParticipant;
import com._paynov8.paynov8backend.splitpayment.model.SplitType;
import com._paynov8.paynov8backend.splitpayment.repository.SplitPaymentRepository;
import com._paynov8.paynov8backend.splitpayment.service.SplitPaymentService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
@RequiredArgsConstructor
public class SplitPaymentServiceImpl implements SplitPaymentService {

    private final NotificationService notificationService;
    private final SplitPaymentRepository paymentRepository;
    private final GroupService groupService;
    private final PaystackService paystackService;
    private final FlutterWaveService flutterWaveService;

    private static final Logger logger = LoggerFactory.getLogger(SplitPaymentServiceImpl.class);


    @Override
    public SplitPayment createSplitPayment(SplitPaymentRequest request) {
        Group group = validateGroupAndMembers(request);

        List<SplitParticipant> participants = buildParticipants(request, group);

//        validateUserBalances(participants);

        SplitPayment payment = buildSplitPayment(request, participants);

        SplitPayment savedPayment = paymentRepository.save(payment);

        initializeParticipantPayments(savedPayment);

        return paymentRepository.save(savedPayment);
    }

//    @Override
//    public SplitPayment createSplitPayment(SplitPaymentRequest request) {
//        Group group = validateGroupAndMembers(request);
//
//        List<String> emails = List.of(
//                "salamitijani02@gmail.com",
//                "testUser@gmail.com",
//                "hammed@gmail.com"
//        );
//        int count = 0;
//
//
//        List<SplitParticipant> participants = buildParticipants(request, group);
//
//        SplitPayment payment = buildSplitPayment(request, participants);
//
//        SplitPayment saved = paymentRepository.save(payment);
//
//        // Initialize payment links for participants
//        for (SplitParticipant participant : saved.getParticipants()) {
//            if (count < emails.size()) {
//                String email = emails.get(count);
//                String link = flutterWaveService.createPaymentLink(email, participant.getAmount(), request.getBeneficiaryAccount());
//                participant.setPaymentLink(link);
//                notificationService.notifyParticipant(participant, saved,email);
//            }else {
//                System.err.println("No email available for participant: " + participant.getUserId());
//            }
//            count++;
//        }
//
//
//        return paymentRepository.save(saved);
//    }




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
            return buildCustomParticipants(request);
        } else {
            throw new IllegalArgumentException("Unsupported split type: " + request.getSplitType());
        }
    }

    private List<SplitParticipant> buildCustomParticipants(SplitPaymentRequest request) {
        return request.getCustomSplits().entrySet().stream()
                .map(entry ->  SplitParticipant.builder()
                        .userId(entry.getKey())
                        .amount(entry.getValue())
                        .isPaid(false)
                        .build())
                        .toList();
    }


    private List<SplitParticipant> buildEqualParticipants(SplitPaymentRequest request, Group group) {
        BigDecimal totalAmount = request.getTotalAmount();
        int numberOfParticipants = request.getParticipantIds().size();

        logger.info("Number of participant {}", numberOfParticipants);
        BigDecimal equalShare = totalAmount.divide(
                BigDecimal.valueOf(numberOfParticipants),
                2,
                RoundingMode.HALF_UP
        );

        return group.getMemberIds().stream()
                .map(id -> SplitParticipant.builder()
                        .userId(id)
                        .amount(equalShare)
                        .isPaid( false)
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

    private void initializeParticipantPayments(SplitPayment savedPayment) {
        List<String> emails = List.of(
                "salamitijani02@gmail.com",
                "joellegend582@gmail.com",
                "hammed@gmail.com"
        );

        int count = 0;

        for (SplitParticipant participant : savedPayment.getParticipants()) {
            if (count >= emails.size()) {
                System.err.println("No email available for participant: " + participant.getUserId());
                continue;
            }

            String email = emails.get(count);
            count++;

            try {
                PayStackInitResponse res = paystackService.initializePayment(
                        email,
                        participant.getAmount(),
                        "https://yourapp.com/api/paystack/callback"
                );

                if (res.isStatus()) {
                    participant.setPaymentLink(res.getData().getAuthorization_url());
                    participant.setPaystackReference(res.getData().getReference());

                    notificationService.notifyParticipant(participant, savedPayment, email);
                }

            } catch (Exception e) {
                System.err.println("Failed to initialize payment for " + participant.getUserId() + ": " + e.getMessage());
            }
        }
    }


//    private void validateUserBalances(List<SplitParticipant> participants) {
//        for (SplitParticipant participant : participants) {
//            BigDecimal balance = userService.getWalletBalance(participant.getUserId());
//            BigDecimal amount = participant.getAmount();
//
//            if (balance.compareTo(amount) < 0) {
//                throw new RuntimeException(
//                        String.format("User %s has insufficient balance. Required: %s, Available: %s",
//                                participant.getUserId(), amount, balance)
//                );
//            }
//        }



    private String getParticipantEmail(String userId, int count) {
        List<String> emails = List.of(
                "salamitijani02@gmail.com",
                "testUser@gmail.com",
                "hammed@gmail.com"
        );
        return emails.get(count);
    }

}

