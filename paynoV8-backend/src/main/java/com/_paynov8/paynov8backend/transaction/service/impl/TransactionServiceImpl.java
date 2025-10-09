package com._paynov8.paynov8backend.transaction.service.impl;

import com._paynov8.paynov8backend.transaction.model.Transaction;
import com._paynov8.paynov8backend.transaction.model.TransactionStatus;
import com._paynov8.paynov8backend.transaction.model.TransactionType;
import com._paynov8.paynov8backend.transaction.repository.TransactionRepository;
import com._paynov8.paynov8backend.transaction.service.TransactionService;
import com._paynov8.paynov8backend.wallet.service.WalletService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TransactionServiceImpl implements TransactionService {

    private final WalletService walletService;
    private final TransactionRepository transactionRepository;
    public static final String SYSTEM_ACCOUNT = "SYSTEM";
    public static final String EXTERNAL_ACCOUNT = "EXTERNAL";


    @Transactional
    @Override
    public Transaction deposit(String accountNumber, BigDecimal amount, String description) {
        validateInputs(accountNumber, amount);

        walletService.credit(accountNumber, amount);

        return saveTransaction(
                TransactionType.DEPOSIT,
                SYSTEM_ACCOUNT,
                accountNumber,
                amount,
                description
        );
    }

    @Transactional
    @Override
    public Transaction withdraw(String accountNumber, BigDecimal amount, String description, String pin) {
        walletService.requirePinSet(accountNumber);

        if (!walletService.verifyPin(accountNumber, pin))
            throw new SecurityException("Invalid PIN");

        validateInputs(accountNumber, amount);

        walletService.debit(accountNumber, amount);

        return saveTransaction(
                TransactionType.WITHDRAWAL,
                accountNumber,
                EXTERNAL_ACCOUNT,
                amount,
                description
        );
    }

    @Transactional
    @Override
    public Transaction transfer(String sourceAccount, String destinationAccount, BigDecimal amount, String description, String userId, String pin) {

        System.out.println("Account" + sourceAccount);
        System.out.println("UserId" + userId);

        walletService.requirePinSet(sourceAccount);

        if (!walletService.verifyPin(sourceAccount, pin))
            throw new SecurityException("Invalid PIN");

        validateInputs(sourceAccount, amount);

        if (sourceAccount.equals(destinationAccount))
            throw new IllegalArgumentException("Cannot transfer to the same account");

        walletService.debit(sourceAccount, amount);
        walletService.credit(destinationAccount, amount);

        return saveTransaction(
                TransactionType.TRANSFER,
                sourceAccount,
                destinationAccount,
                amount,
                description
        );
    }



    private void validateInputs(String accountNumber, BigDecimal amount) {
        if (accountNumber == null || accountNumber.isBlank()) {
            throw new IllegalArgumentException("Account number cannot be null or blank");
        }
        if (amount == null || amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Amount must be greater than zero");
        }
    }

    @Override
    public Transaction saveTransaction(
            TransactionType type,
            String sourceAccount,
            String destinationAccount,
            BigDecimal amount,
            String description
    ) {

        Transaction txn = Transaction.builder()
                .type(type.name())
                .reference(UUID.randomUUID().toString())
                .sourceAccount(sourceAccount)
                .destinationAccount(destinationAccount)
                .amount(amount)
                .status(TransactionStatus.SUCCESS.name())
                .description(description != null ? description : type.name() + " Transaction")
                .build();

        return transactionRepository.save(txn);
    }

    @Override
    public List<Transaction> getTransactionsForAccount(String accountNumber) {
        return transactionRepository.findBySourceAccountOrDestinationAccount(accountNumber, accountNumber);
    }
    @Transactional
    @Override
    public Transaction attachVoiceNote(String transactionId, String voiceNoteUrl) {
        Transaction transaction = transactionRepository.findById(transactionId)
                .orElseThrow(() -> new RuntimeException("Transaction not found"));

        transaction.setVoiceNoteUrl(voiceNoteUrl);
        return transactionRepository.save(transaction);
    }
}
