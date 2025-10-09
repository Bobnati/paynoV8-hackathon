package com._paynov8.paynov8backend.Group.controller;

import com._paynov8.paynov8backend.Group.dto.AddMemberRequest;
import com._paynov8.paynov8backend.Group.dto.CreateGroupRequest;
import com._paynov8.paynov8backend.Group.model.Group;
import com._paynov8.paynov8backend.Group.service.GroupService;
import com._paynov8.paynov8backend.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/groups")
@RequiredArgsConstructor
public class GroupController {

    private final GroupService service;

    @PostMapping("/create")
    public ResponseEntity<ApiResponse<Group>> createGroup(@RequestBody CreateGroupRequest request) {
        Group group = service.createGroup(request.getCreatorId(), request.getName());
        return ResponseEntity.ok(
                ApiResponse.success("Group created successfully", group));
    }
    @PostMapping("/add-member")
    public ResponseEntity<ApiResponse<Group>> addMember(@RequestBody AddMemberRequest request) {
        Group updatedGroup = service.addMember(request.getGroupId(), request.getAccountNumber());
        return ResponseEntity.ok(
                ApiResponse.success("Member added successfully", updatedGroup)
        );
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<ApiResponse<List<Group>>> getUserGroups(@PathVariable String userId) {
        List<Group> groups = service.getUserGroups(userId);
        return ResponseEntity.ok(
                ApiResponse.success("Fetched user groups successfully", groups)
        );
    }

    @GetMapping("/{groupId}")
    public ResponseEntity<ApiResponse<Group>> getGroupById(@PathVariable String groupId) {
        Group group = service.findById(groupId);
        return ResponseEntity.ok(
                ApiResponse.success("Fetched group successfully", group)
        );
    }

}