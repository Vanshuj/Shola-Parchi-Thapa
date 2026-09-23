package com.spt.exception;

import com.spt.dto.response.ErrorResponse;
import com.spt.engine.exception.GameOverException;
import com.spt.engine.exception.InvalidCardException;
import com.spt.engine.exception.NotYourTurnException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ApiException.class)
    public ResponseEntity<ErrorResponse> handleApiException(ApiException ex) {
        return ResponseEntity.status(ex.getStatus()).body(new ErrorResponse(ex.getCode(), ex.getMessage()));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidation(MethodArgumentNotValidException ex) {
        String message = ex.getBindingResult().getFieldErrors().stream()
                .findFirst()
                .map(err -> err.getField() + ": " + err.getDefaultMessage())
                .orElse("Validation failed");
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ErrorResponse("VALIDATION_ERROR", message));
    }

    @ExceptionHandler(NotYourTurnException.class)
    public ResponseEntity<ErrorResponse> handleNotYourTurn(NotYourTurnException ex) {
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(new ErrorResponse("NOT_YOUR_TURN", ex.getMessage()));
    }

    @ExceptionHandler(InvalidCardException.class)
    public ResponseEntity<ErrorResponse> handleInvalidCard(InvalidCardException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ErrorResponse("INVALID_CARD", ex.getMessage()));
    }

    @ExceptionHandler(GameOverException.class)
    public ResponseEntity<ErrorResponse> handleGameOver(GameOverException ex) {
        return ResponseEntity.status(HttpStatus.CONFLICT).body(new ErrorResponse("GAME_OVER", ex.getMessage()));
    }

    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<ErrorResponse> handleAuth(AuthenticationException ex) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new ErrorResponse("AUTH_INVALID", "Invalid credentials"));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGeneric(Exception ex) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ErrorResponse("INTERNAL_ERROR", "Something went wrong. Please try again."));
    }
}
