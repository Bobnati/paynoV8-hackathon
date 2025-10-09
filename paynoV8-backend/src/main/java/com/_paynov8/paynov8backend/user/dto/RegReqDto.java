package com._paynov8.paynov8backend.user.dto;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class RegReqDto {
    private String firstName;
    private String middleName;
    private String lastName;
    private String phoneNumber;
    private String gender;
    private String address;
    private String email;
    private String password;
}
