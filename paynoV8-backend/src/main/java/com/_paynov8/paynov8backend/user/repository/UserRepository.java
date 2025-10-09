package com._paynov8.paynov8backend.user.repository;

import com._paynov8.paynov8backend.user.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface UserRepository extends MongoRepository<User, Long> {
    Optional<User> findByEmail(String email);
}
