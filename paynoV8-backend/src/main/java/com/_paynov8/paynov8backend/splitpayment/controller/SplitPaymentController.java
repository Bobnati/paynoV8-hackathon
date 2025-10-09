package com._paynov8.paynov8backend.splitpayment.controller;

import com._paynov8.paynov8backend.notification.service.NotificationService;
import com._paynov8.paynov8backend.splitpayment.dto.SplitPaymentRequest;
import com._paynov8.paynov8backend.splitpayment.model.SplitPayment;
import com._paynov8.paynov8backend.splitpayment.service.SplitPaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/api/split")
@RequiredArgsConstructor
public class SplitPaymentController {

    private final SplitPaymentService splitPaymentService;

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
}




