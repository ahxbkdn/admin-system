package com.example.course.controller;

import com.example.common.response.ApiResponse;
import com.example.course.entity.Chapter;
import com.example.course.service.impl.ChapterServiceMemoryImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/chapters")
public class ChapterController {

    @Autowired
    private ChapterServiceMemoryImpl chapterService;

    // 根据课程ID获取章节列表
    @GetMapping("/course/{courseId}")
    public ApiResponse<List<Chapter>> getChaptersByCourseId(@PathVariable Long courseId) {
        List<Chapter> chapters = chapterService.getChaptersByCourseId(courseId);
        return ApiResponse.success(chapters);
    }

    // 获取章节详情
    @GetMapping("/{id}")
    public ApiResponse<Chapter> getChapterById(@PathVariable Long id) {
        Chapter chapter = chapterService.getById(id);
        if (chapter == null) {
            return ApiResponse.fail(404, "章节不存在");
        }
        return ApiResponse.success(chapter);
    }

    // 创建章节
    @PostMapping
    public ApiResponse<Chapter> createChapter(@RequestBody Chapter chapter) {
        chapterService.save(chapter);
        return ApiResponse.success(chapter);
    }

    // 更新章节
    @PutMapping("/{id}")
    public ApiResponse<Chapter> updateChapter(@PathVariable Long id, @RequestBody Chapter chapter) {
        chapter.setId(id);
        boolean success = chapterService.updateById(chapter);
        if (!success) {
            return ApiResponse.fail(404, "章节不存在");
        }
        return ApiResponse.success(chapter);
    }

    // 删除章节
    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteChapter(@PathVariable Long id) {
        boolean success = chapterService.removeById(id);
        if (!success) {
            return ApiResponse.fail(404, "章节不存在");
        }
        return ApiResponse.success();
    }
}
