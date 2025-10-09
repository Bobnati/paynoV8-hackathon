package com._paynov8.paynov8backend.wallet.service;

import com._paynov8.paynov8backend.wallet.model.Wallet;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

public interface WalletService {

    void createWalletForUser(String userId, String accountNumber);

    Wallet getWallet(String userId);

    @Transactional
    void credit(String accountNumber, BigDecimal amount);

    @Transactional
    void debit(String accountNumber, BigDecimal amount);

    void updateBalance(String userId, BigDecimal newBalance);

    void setPinByAccountNumber(String accountNumber, String rawPin);

    void setPinByUserId(String userId, String rawPin);

    boolean verifyPin(String accountNumber, String rawPin);

    void requirePinSet(String accountNumber);

}
