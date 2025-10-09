package com._paynov8.paynov8backend.vn.model;

import com._paynov8.paynov8backend.transaction.model.Transaction;
import com._paynov8.paynov8backend.user.model.User;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "voice_reactions")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VoiceReaction {

    @Id
    private String id;

    @DBRef
    private User userId;

    @DBRef
    private Transaction transactionId;  // Reference to the related transaction

    private String audioUrl;  // Cloudinary/Firebase URL
    private int maxDuration;     // Duration in seconds

    @CreatedDate
    private LocalDateTime dateCreated;
}

