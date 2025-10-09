package com._paynov8.paynov8backend.wallet.repository;

import com._paynov8.paynov8backend.wallet.model.Wallet;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface WalletRepository extends MongoRepository<Wallet, String> {
    Optional<Wallet> findByUserId(String userId);

    Optional<Wallet> findByAccountNumber(String accountNumber);
}
