package com._paynov8.paynov8backend.transaction.dto;


import lombok.Data;

@Data
public class VoiceNoteRequest {
    private String transactionReference;
    private String voiceNoteUrl;
}
