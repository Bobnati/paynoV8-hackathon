package com._paynov8.paynov8backend.common.exception;

import com._paynov8.paynov8backend.common.dto.ApiResponse;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalException {

    @ExceptionHandler(UserAlreadyExistException.class)
    @ResponseStatus(HttpStatus.CONFLICT)
    public ApiResponse<?> handleUserAlreadyExistException(UserAlreadyExistException e) {
        return ApiResponse.error(e.getMessage());
    }

    @ExceptionHandler(ResourceNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public ApiResponse<?> handleResourceNotFoundException(ResourceNotFoundException e) {
        return ApiResponse.error(e.getMessage());
    }

    @ExceptionHandler(ResourceAllReadyExistException.class)
    @ResponseStatus(HttpStatus.CONFLICT)
    public ApiResponse<?> handleResourceAlreadyExistException(ResourceAllReadyExistException e) {
        return ApiResponse.error(e.getMessage());
    }

    @ExceptionHandler(IllegalArgumentException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ApiResponse<?> handleIllegalArgumentException(IllegalArgumentException e) {
        return ApiResponse.error(e.getMessage());
    }

    @ExceptionHandler(RuntimeException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ApiResponse<?> handleRuntimeException(RuntimeException e) {
        return ApiResponse.error(e.getMessage());
    }



    @ExceptionHandler(UsernameNotFoundException.class)
    public ApiResponse<?> handleUsernameNotFoundException(UsernameNotFoundException e) {
        return ApiResponse.error(e.getMessage());
    }

    @ExceptionHandler(Exception.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public ApiResponse<?> handleGenericException(Exception e) {
//        e.printStackTrace();
        return ApiResponse.error(e.getMessage());
    }

    @ResponseStatus(HttpStatus.BAD_REQUEST) @ExceptionHandler(MethodArgumentNotValidException.class)
    public Map<String, String > handleMethodArgumentNotValidException(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage); });
         return errors;
    }
}
