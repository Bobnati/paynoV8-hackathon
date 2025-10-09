package com._paynov8.paynov8backend.user.model;

import com._paynov8.paynov8backend.user.enums.Role;
import com._paynov8.paynov8backend.user.enums.Preference;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Document(collection = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    private String id;

    @NonNull
    private String firstName;
    @NonNull
    private String middleName;
    @NonNull
    private String lastName;
    @NonNull
    private String phoneNumber;
    @NonNull
    private String email;
    @NonNull
    private String passwordHash;
    @NonNull
    private String gender;
    @NonNull
    private String address;
    private String accountNumber;

    private Role role;
    private BigDecimal walletBalance;  // Main wallet
    private BigDecimal savingsBalance; // Auto-saved funds (SmartPay+)

    private Preference preference;

    private String dob;

    private boolean isVerified = true;

    @CreatedDate
    @Field("dateCreated")
    private LocalDateTime dateCreated;

    @LastModifiedDate
    @Field("dateUpdated")
    private LocalDateTime dateUpdated;
}

