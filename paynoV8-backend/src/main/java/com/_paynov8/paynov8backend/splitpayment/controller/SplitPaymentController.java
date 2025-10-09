package com._paynov8.paynov8backend.splitpayment.controller;

import com._paynov8.paynov8backend.notification.service.NotificationService;
import com._paynov8.paynov8backend.splitpayment.dto.SplitPaymentRequest;
import com._paynov8.paynov8backend.splitpayment.model.SplitPayment;
import com._paynov8.paynov8backend.splitpayment.service.SplitPaymentServiceB;
import com._paynov8.paynov8backend.splitpayment.service.SplitPaymentServiceB;
import com._paynov8.paynov8backend.user.model.User;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/api/split")
@RequiredArgsConstructor
public class SplitPaymentController {

    private final SplitPaymentServiceB splitPaymentService;

    @PostMapping("/create")
    public ResponseEntity<SplitPayment> createSplitPayment(@RequestBody SplitPaymentRequest request) {
        SplitPayment payment = splitPaymentService.createSplitPayment(request);
        return ResponseEntity.ok(payment);
    }

    @GetMapping("/{groupId}")
    public ResponseEntity<List<SplitPayment>> getGroupSplits(@PathVariable String groupId) {
        List<SplitPayment> payments = splitPaymentService.getSplitsByGroup(groupId);
        return ResponseEntity.ok(payments);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<SplitPayment>> getUserSplits(@PathVariable String userId) {
        List<SplitPayment> payments = splitPaymentService.getSplitsByUser(userId);
        return ResponseEntity.ok(payments);
    }

    @PostMapping("/{splitId}/confirm")
    public ResponseEntity<Void> confirmPayment(
            @PathVariable String splitId,
            @RequestParam String pin,
            @AuthenticationPrincipal User user
    ) {
        String userId = user.getId();
        splitPaymentService.confirmParticipantPayment(splitId, userId, pin);
        return ResponseEntity.ok().build();
    }
}




