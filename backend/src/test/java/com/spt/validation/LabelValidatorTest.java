package com.spt.validation;

import com.spt.exception.BadRequestException;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class LabelValidatorTest {

    private final LabelValidator validator = new LabelValidator();

    @Test
    void rejectsBlank() {
        assertThrows(BadRequestException.class, () -> validator.validateAndClean(""));
        assertThrows(BadRequestException.class, () -> validator.validateAndClean("   "));
        assertThrows(BadRequestException.class, () -> validator.validateAndClean(null));
    }

    @Test
    void rejectsTooLong() {
        assertThrows(BadRequestException.class, () -> validator.validateAndClean("ThisIsWayTooLongForALabel"));
    }

    @Test
    void acceptsPlainWord() {
        assertEquals("Mummy", validator.validateAndClean("Mummy"));
    }

    @Test
    void acceptsAllowedSymbols() {
        assertEquals("★ Raju", validator.validateAndClean("★ Raju"));
    }

    @Test
    void rejectsHtmlLikeContent() {
        assertThrows(BadRequestException.class, () -> validator.validateAndClean("<script>alert(1)</script>"));
        assertThrows(BadRequestException.class, () -> validator.validateAndClean("a&b"));
    }

    @Test
    void stripsControlCharsAndTrims() {
        assertEquals("Raju", validator.validateAndClean("  Raju\u0007  "));
    }
}
