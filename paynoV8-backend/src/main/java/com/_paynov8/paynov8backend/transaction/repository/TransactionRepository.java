package com._paynov8.paynov8backend.transaction.repository;

import com._paynov8.paynov8backend.transaction.model.Transaction;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface TransactionRepository extends MongoRepository<Transaction, String> {
    List<Transaction> findBySourceAccountOrDestinationAccount(String source, String destination);

    Optional<Transaction>  findById(String transactionId);
}
