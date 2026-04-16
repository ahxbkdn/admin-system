package com.example.banner.controller;

import com.example.banner.entity.Banner;
import com.example.banner.service.BannerService;
import com.example.common.response.ApiResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/banner")
public class BannerController {

    @Autowired
    private BannerService bannerService;

    @GetMapping("/list")
    public ApiResponse<List<Banner>> list() {
        List<Banner> banners = bannerService.list();
        return ApiResponse.success(banners);
    }

    @GetMapping("/get/{id}")
    public ApiResponse<Banner> get(@PathVariable Long id) {
        Banner banner = bannerService.getById(id);
        return ApiResponse.success(banner);
    }

    @PostMapping("/add")
    public ApiResponse<Void> add(@RequestBody Banner banner) {
        bannerService.save(banner);
        return ApiResponse.success();
    }

    @PutMapping("/update")
    public ApiResponse<Void> update(@RequestBody Banner banner) {
        bannerService.updateById(banner);
        return ApiResponse.success();
    }

    @DeleteMapping("/delete/{id}")
    public ApiResponse<Void> delete(@PathVariable Long id) {
        bannerService.removeById(id);
        return ApiResponse.success();
    }
}
