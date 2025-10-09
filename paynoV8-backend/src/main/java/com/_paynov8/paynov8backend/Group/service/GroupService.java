package com._paynov8.paynov8backend.Group.service;

import com._paynov8.paynov8backend.Group.model.Group;

import java.util.List;

public interface GroupService {
    Group createGroup(String creatorId, String name);

    Group addMember(String groupId, String userId);

    List<Group> getUserGroups(String userId);

    Group findById(String id);
}
