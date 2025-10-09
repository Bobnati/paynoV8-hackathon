package com._paynov8.paynov8backend.wallet.service.impl;

import com._paynov8.paynov8backend.common.exception.ResourceNotFoundException;
import com._paynov8.paynov8backend.wallet.model.Wallet;
import com._paynov8.paynov8backend.wallet.repository.WalletRepository;
import com._paynov8.paynov8backend.wallet.service.WalletService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;


@Service
@RequiredArgsConstructor
public class WalletServiceImpl implements WalletService {

    private final WalletRepository walletRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void createWalletForUser(String userId, String accountNumber) {
        if (walletRepository.findByUserId(userId).isPresent()) {
            throw new IllegalStateException("Wallet already exists for this user");
        }

        Wallet wallet = new Wallet();
        wallet.setUserId(userId);
        wallet.setBalance(BigDecimal.ZERO);
        wallet.setAccountNumber(accountNumber);
        walletRepository.save(wallet);
    }

    @Override
    public Wallet getWallet(String accountNumber) {
        return walletRepository.findByAccountNumber(accountNumber)
                .orElseThrow(() -> new RuntimeException("Wallet not found for user " + accountNumber));
    }

    @Transactional
    @Override
    public void credit(String accountNumber, BigDecimal amount) {
        validateAmount(amount);

        Wallet wallet = walletRepository.findByAccountNumber(accountNumber)
                .orElseThrow(() -> new RuntimeException("Wallet not found: " + accountNumber));

        wallet.setBalance(wallet.getBalance().add(amount));
        wallet.setUpdatedAt(LocalDateTime.now());

        walletRepository.save(wallet);

    }

    @Transactional
    @Override
    public void debit(String accountNumber, BigDecimal amount) {
        validateAmount(amount);

        Wallet wallet = walletRepository.findByAccountNumber(accountNumber)
                .orElseThrow(() -> new RuntimeException("Wallet not found: " + accountNumber));

        if (wallet.getBalance().compareTo(amount) < 0) {
            throw new IllegalArgumentException( "Insufficient funds in wallet " + accountNumber);
        }

        wallet.setBalance(wallet.getBalance().subtract(amount));
        wallet.setUpdatedAt(LocalDateTime.now());

        walletRepository.save(wallet);

    }

    @Override
    public void updateBalance(String userId, BigDecimal newBalance) {
        Wallet wallet = getWallet(userId);
        wallet.setBalance(newBalance);
        wallet.setUpdatedAt(LocalDateTime.now());
        walletRepository.save(wallet);
    }

    public void setPinByAccountNumber(String accountNumber, String rawPin) {
        Wallet wallet = walletRepository.findByAccountNumber(accountNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Wallet not found for account: " + accountNumber));

        applyPin(wallet, rawPin);
    }

    @Override
    public void setPinByUserId(String userId, String rawPin) {
        Wallet wallet = walletRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Wallet not found for user: " + userId));

        applyPin(wallet, rawPin);
    }

    @Override
    public boolean verifyPin(String accountNumber, String rawPin) {
        Wallet wallet = getWallet(accountNumber);
        return passwordEncoder.matches(rawPin, wallet.getPinHashed());
    }

    @Override
    public void requirePinSet(String accountNumber) {
        Wallet wallet = getWallet(accountNumber);
        if (wallet.getPinHashed() == null)
            throw new IllegalStateException("Transaction PIN not set, Kindly set your pin");
    }

    private void validateAmount(BigDecimal amount) {
        if (amount == null || amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Amount must be greater than zero");
        }
    }

    private void applyPin(Wallet wallet, String rawPin) {
        if (wallet.getPinHashed() != null)
            throw new IllegalStateException("PIN already set");

        wallet.setPinHashed(passwordEncoder.encode(rawPin));
        walletRepository.save(wallet);
    }
}





