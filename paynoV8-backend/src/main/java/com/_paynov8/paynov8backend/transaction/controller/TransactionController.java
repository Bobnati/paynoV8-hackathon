package com._paynov8.paynov8backend.transaction.controller;

import com._paynov8.paynov8backend.common.dto.ApiResponse;
import com._paynov8.paynov8backend.transaction.dto.DepositRequest;
import com._paynov8.paynov8backend.transaction.dto.TransferRequest;
import com._paynov8.paynov8backend.transaction.dto.VoiceNoteRequest;
import com._paynov8.paynov8backend.transaction.dto.WithdrawRequest;
import com._paynov8.paynov8backend.transaction.model.Transaction;
import com._paynov8.paynov8backend.transaction.service.TransactionService;
import com._paynov8.paynov8backend.user.model.User;
import com._paynov8.paynov8backend.wallet.model.Wallet;
import com._paynov8.paynov8backend.wallet.service.WalletService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.filter.RequestContextFilter;

import java.nio.file.attribute.UserPrincipal;
import java.util.List;

@RestController
@RequestMapping("/api/banking")
@RequiredArgsConstructor
public class TransactionController {

    private final TransactionService transactionService;
    private final WalletService walletService;
    private final RequestContextFilter requestContextFilter;

    @PostMapping("/deposit")
    public ResponseEntity<ApiResponse<Transaction>> deposit(@RequestBody DepositRequest request) {
        Transaction txn = transactionService.deposit(
                request.getAccountNumber(),
                request.getAmount(),
                "Wallet deposit"
        );
        return ResponseEntity.ok(
                ApiResponse.success("Deposit successful", txn)
        );
    }

    @PostMapping("/withdraw")
    public ResponseEntity<ApiResponse<Transaction>> withdraw(@RequestBody WithdrawRequest request) {
        Transaction txn = transactionService.withdraw(
                request.getAccountNumber(),
                request.getAmount(),
                "Wallet withdrawal",
                request.getPin()
        );
        return ResponseEntity.ok(
                ApiResponse.success("Withdrawal successful", txn)
        );
    }

    @PostMapping("/transfer")
    public ResponseEntity<ApiResponse<Transaction>> transfer(@RequestBody TransferRequest request, @AuthenticationPrincipal User user) {
        String userId = user.getId();

        Transaction txn = transactionService.transfer(
                request.getSourceAccount(),
                request.getDestinationAccount(),
                request.getAmount(),
                "Wallet transfer",
                userId,
                request.getPin()
        );
        return ResponseEntity.ok(
                ApiResponse.success("Transfer completed successfully", txn)
        );
    }

    @GetMapping("/{accountNumber}/transactions")
    public ResponseEntity<ApiResponse<List<Transaction>>> getTransactions(@PathVariable String accountNumber) {
        List<Transaction> transactions = transactionService.getTransactionsForAccount(accountNumber);
        return ResponseEntity.ok(
                ApiResponse.success("Transactions retrieved successfully", transactions)
        );
    }

    @GetMapping("/{accountNumber}/wallet")
    public ResponseEntity<ApiResponse<Wallet>> getUserWallet(@PathVariable String accountNumber) {
        Wallet wallet = walletService.getWallet(accountNumber);
        return ResponseEntity.ok(
                ApiResponse.success("Transactions retrieved successfully", wallet)
        );
    }

    @PatchMapping("/voice-note")
    public ResponseEntity<ApiResponse<Transaction>> attachVoiceNote(@RequestBody VoiceNoteRequest request) {
        Transaction updated = transactionService.attachVoiceNote(request.getTransactionReference(), request.getVoiceNoteUrl());
        return ResponseEntity.ok(ApiResponse.success("Voice note fetch successfully",updated));
    }

    @PostMapping("/set-pin")
    public ResponseEntity<ApiResponse<String>> setPin(@AuthenticationPrincipal User user,
                                         @RequestParam String pin) {
        walletService.setPinByUserId(user.getId(), pin);
        return ResponseEntity.ok(ApiResponse.success("Transaction PIN set successfully", null));
    }
}

