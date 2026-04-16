package com.example.course.controller;

import com.example.common.response.ApiResponse;
import com.example.course.entity.Section;
import com.example.course.service.impl.SectionServiceMemoryImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/sections")
public class SectionController {

    @Autowired
    private SectionServiceMemoryImpl sectionService;

    // 根据章节ID获取小节列表
    @GetMapping("/chapter/{chapterId}")
    public ApiResponse<List<Section>> getSectionsByChapterId(@PathVariable Long chapterId) {
        List<Section> sections = sectionService.getSectionsByChapterId(chapterId);
        return ApiResponse.success(sections);
    }

    // 获取小节详情
    @GetMapping("/{id}")
    public ApiResponse<Section> getSectionById(@PathVariable Long id) {
        Section section = sectionService.getById(id);
        if (section == null) {
            return ApiResponse.fail(404, "小节不存在");
        }
        return ApiResponse.success(section);
    }

    // 创建小节
    @PostMapping
    public ApiResponse<Section> createSection(@RequestBody Section section) {
        sectionService.save(section);
        return ApiResponse.success(section);
    }

    // 更新小节
    @PutMapping("/{id}")
    public ApiResponse<Section> updateSection(@PathVariable Long id, @RequestBody Section section) {
        section.setId(id);
        boolean success = sectionService.updateById(section);
        if (!success) {
            return ApiResponse.fail(404, "小节不存在");
        }
        return ApiResponse.success(section);
    }

    // 删除小节
    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteSection(@PathVariable Long id) {
        boolean success = sectionService.removeById(id);
        if (!success) {
            return ApiResponse.fail(404, "小节不存在");
        }
        return ApiResponse.success();
    }
}
