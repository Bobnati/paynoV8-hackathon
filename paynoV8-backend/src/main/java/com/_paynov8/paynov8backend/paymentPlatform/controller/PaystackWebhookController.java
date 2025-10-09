package com._paynov8.paynov8backend.paymentPlatform.controller;

import com._paynov8.paynov8backend.splitpayment.model.SplitParticipant;
import com._paynov8.paynov8backend.splitpayment.model.SplitPayment;
import com._paynov8.paynov8backend.splitpayment.repository.SplitPaymentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/paystack")
@RequiredArgsConstructor
public class PaystackWebhookController {

    private final SplitPaymentRepository paymentRepository;

    @PostMapping("/webhook")
    public ResponseEntity<Void> handleWebhook(@RequestBody Map<String, Object> payload) {
        Map<String, Object> data = (Map<String, Object>) payload.get("data");
        String reference = (String) data.get("reference");

        Optional<SplitPayment> paymentOpt = paymentRepository.findByParticipants_PaystackReference(reference);
        if (paymentOpt.isPresent()) {
            SplitPayment payment = paymentOpt.get();

            payment.getParticipants().forEach(participant -> {
                if (reference.equals(participant.getPaystackReference())) {
                    participant.setPaid(true);
                }
            });

            boolean allPaid = payment.getParticipants().stream().allMatch(SplitParticipant::isPaid);
            if (allPaid) payment.setStatus("COMPLETED");

            paymentRepository.save(payment);
        }

        return ResponseEntity.ok().build();
    }
}

