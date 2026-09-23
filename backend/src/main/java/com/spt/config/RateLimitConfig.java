package com.spt.config;

import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.Refill;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.time.Duration;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;

/**
 * Bucket4j token-bucket rate limiter: 10 actions/sec per client, keyed by
 * the authenticated principal when present, else by remote IP.
 */
@Configuration
public class RateLimitConfig {

    @Bean
    public FilterRegistrationBean<OncePerRequestFilter> rateLimitFilter() {
        FilterRegistrationBean<OncePerRequestFilter> registration = new FilterRegistrationBean<>();
        registration.setFilter(new RateLimitFilter());
        registration.addUrlPatterns("/api/*");
        registration.setOrder(1);
        return registration;
    }

    static class RateLimitFilter extends OncePerRequestFilter {

        private final ConcurrentMap<String, Bucket> buckets = new ConcurrentHashMap<>();

        @Override
        protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response,
                                         FilterChain filterChain) throws ServletException, IOException {
            String key = resolveKey(request);
            Bucket bucket = buckets.computeIfAbsent(key, k -> newBucket());
            if (bucket.tryConsume(1)) {
                filterChain.doFilter(request, response);
            } else {
                response.setStatus(429);
                response.setContentType("application/json");
                response.getWriter().write("{\"code\":\"RATE_LIMITED\",\"message\":\"Too many requests\"}");
            }
        }

        private Bucket newBucket() {
            Bandwidth limit = Bandwidth.classic(10, Refill.greedy(10, Duration.ofSeconds(1)));
            return Bucket.builder().addLimit(limit).build();
        }

        private String resolveKey(HttpServletRequest request) {
            String auth = request.getHeader("Authorization");
            if (auth != null && !auth.isBlank()) {
                return auth;
            }
            return request.getRemoteAddr();
        }
    }
}
