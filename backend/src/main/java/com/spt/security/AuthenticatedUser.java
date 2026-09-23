package com.spt.security;

import com.spt.exception.UnauthorizedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;

/** Small helper to read the current request's userId out of the Spring Security context. */
public final class AuthenticatedUser {

    private AuthenticatedUser() {
    }

    public static Long currentUserId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !(auth.getPrincipal() instanceof UserDetails userDetails)) {
            throw new UnauthorizedException("AUTH_INVALID", "No authenticated user");
        }
        return Long.valueOf(userDetails.getUsername());
    }
}
