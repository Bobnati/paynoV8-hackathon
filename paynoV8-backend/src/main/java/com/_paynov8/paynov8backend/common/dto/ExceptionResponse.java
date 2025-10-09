package com._paynov8.paynov8backend.common.dto;

import lombok.Data;

@Data
public class ExceptionResponse {
    private String message;
    private boolean success;
}
