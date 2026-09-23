package com.spt.engine.exception;

public class NotYourTurnException extends RuntimeException {
    public NotYourTurnException(String message) {
        super(message);
    }
}
