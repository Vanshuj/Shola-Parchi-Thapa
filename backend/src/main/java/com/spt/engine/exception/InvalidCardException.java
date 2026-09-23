package com.spt.engine.exception;

public class InvalidCardException extends RuntimeException {
    public InvalidCardException(String message) {
        super(message);
    }
}
