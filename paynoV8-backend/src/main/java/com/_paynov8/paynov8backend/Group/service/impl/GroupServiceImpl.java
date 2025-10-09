package com._paynov8.paynov8backend.Group.service.impl;

import com._paynov8.paynov8backend.Group.model.Group;
import com._paynov8.paynov8backend.Group.repository.GroupRepository;
import com._paynov8.paynov8backend.Group.service.GroupService;
import com._paynov8.paynov8backend.common.exception.ResourceAllReadyExistException;
import com._paynov8.paynov8backend.common.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class GroupServiceImpl implements GroupService {
    private final GroupRepository groupRepository;



    @Override
    public Group createGroup(String creatorId, String name) {
        Group group = new Group();
        group.setName(name);
        group.setCreatorId(creatorId);
        group.getMemberIds().add(creatorId);
        return groupRepository.save(group);
    }

    @Override
    public Group addMember(String groupId, String accountNumber) {
        Group group = groupRepository.findById(groupId)
                .orElseThrow(() -> new RuntimeException("Group not found"));

        if (group.getMemberIds().contains(accountNumber)) throw new ResourceAllReadyExistException("Member already exist");

        group.getMemberIds().add(accountNumber);
        groupRepository.save(group);

        return group;
    }

    @Override
    public List<Group> getUserGroups(String accountNumber) {
        return groupRepository.findByMemberIdsContaining(accountNumber);
    }

    @Override
    public Group findById(String id) {
        return groupRepository.findById(id).orElseThrow(()-> new ResourceNotFoundException("Group does not exist"));

    }

}
