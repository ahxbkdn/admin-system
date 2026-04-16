package com.example.banner;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@MapperScan("com.example.banner.mapper")
public class BannerApplication {
    public static void main(String[] args) {
        SpringApplication.run(BannerApplication.class, args);
    }
}
