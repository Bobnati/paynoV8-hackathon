package com._paynov8.paynov8backend.Group.repository;

import com._paynov8.paynov8backend.Group.model.Group;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface GroupRepository extends MongoRepository<Group, String> {
    List<Group> findByMemberIdsContaining(String userId);
}
