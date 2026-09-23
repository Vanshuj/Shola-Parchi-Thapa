package com.spt;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class SolahParchiThapApplication {
    public static void main(String[] args) {
        SpringApplication.run(SolahParchiThapApplication.class, args);
    }
}
