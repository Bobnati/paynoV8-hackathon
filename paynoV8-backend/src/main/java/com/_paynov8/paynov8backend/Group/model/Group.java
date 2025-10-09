package com._paynov8.paynov8backend.Group.model;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@Document
public class Group {
    @Id
    private String id;
    private String name;
    private String creatorId;
    private List<String> memberIds = new ArrayList<>();
}
