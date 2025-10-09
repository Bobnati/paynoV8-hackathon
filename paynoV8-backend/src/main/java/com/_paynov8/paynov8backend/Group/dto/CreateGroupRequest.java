package com._paynov8.paynov8backend.Group.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateGroupRequest {

    private String creatorId;
    private String name;
}
