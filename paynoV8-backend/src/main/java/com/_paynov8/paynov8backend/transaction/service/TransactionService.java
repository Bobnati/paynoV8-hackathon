package com._paynov8.paynov8backend.transaction.service;

import com._paynov8.paynov8backend.transaction.model.Transaction;
import com._paynov8.paynov8backend.transaction.model.TransactionType;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

public interface TransactionService {
    @Transactional
    Transaction deposit(String accountNumber, BigDecimal amount, String description);

    @Transactional
    Transaction withdraw(String accountNumber, BigDecimal amount, String description, String pin);

    @Transactional
    Transaction transfer(String sourceAccount, String destinationAccount, BigDecimal amount, String description, String userId, String pin);

    Transaction saveTransaction(
            TransactionType type,
            String sourceAccount,
            String destinationAccount,
            BigDecimal amount,
            String description
    );

    List<Transaction> getTransactionsForAccount(String accountNumber);

    @Transactional
    Transaction attachVoiceNote(String transactionId, String voiceNoteUrl);
}
