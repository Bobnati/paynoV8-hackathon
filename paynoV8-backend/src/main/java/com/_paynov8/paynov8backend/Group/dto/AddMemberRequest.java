package com._paynov8.paynov8backend.Group.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AddMemberRequest {
    private String groupId;
    private String accountNumber;
}
