package com.spt.validation;

import com.spt.exception.BadRequestException;
import org.springframework.stereotype.Component;

import java.util.regex.Pattern;

/**
 * Server-side source of truth for custom card labels. Client-side validation
 * (Zod) mirrors these rules but must never be trusted alone.
 */
@Component
public class LabelValidator {

    private static final int MAX_LENGTH = 12;
    // Letters, numbers, whitespace, common symbols, and emoji ranges.
    private static final Pattern ALLOWED = Pattern.compile(
            "^[\\p{L}\\p{N}\\s★♥♦♣♠•·" +
            "\\x{1F300}-\\x{1FAFF}\\x{2600}-\\x{27BF}\\x{1F1E6}-\\x{1F1FF}]+$");
    private static final Pattern HTML_LIKE = Pattern.compile("[<>&]|script", Pattern.CASE_INSENSITIVE);

    public String validateAndClean(String rawLabel) {
        if (rawLabel == null || rawLabel.isBlank()) {
            throw new BadRequestException("INVALID_LABEL", "Label must not be blank");
        }
        String stripped = stripControlChars(rawLabel).trim();
        if (stripped.isEmpty()) {
            throw new BadRequestException("INVALID_LABEL", "Label must not be blank");
        }
        if (stripped.length() > MAX_LENGTH) {
            throw new BadRequestException("INVALID_LABEL", "Label must be at most " + MAX_LENGTH + " characters");
        }
        if (HTML_LIKE.matcher(stripped).find()) {
            throw new BadRequestException("INVALID_LABEL", "Label contains disallowed characters");
        }
        if (!ALLOWED.matcher(stripped).matches()) {
            throw new BadRequestException("INVALID_LABEL", "Label contains unsupported characters");
        }
        return stripped;
    }

    private String stripControlChars(String input) {
        StringBuilder sb = new StringBuilder(input.length());
        for (int i = 0; i < input.length(); i++) {
            char c = input.charAt(i);
            if (!Character.isISOControl(c)) {
                sb.append(c);
            }
        }
        return sb.toString();
    }
}
