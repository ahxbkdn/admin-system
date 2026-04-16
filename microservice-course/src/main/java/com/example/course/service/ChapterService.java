package com.example.course.service;

import com.example.course.entity.Chapter;

import java.util.List;

public interface ChapterService {
    List<Chapter> list();
    Chapter getById(Long id);
    boolean save(Chapter chapter);
    boolean updateById(Chapter chapter);
    boolean removeById(Long id);
    // 根据课程ID获取章节列表
    List<Chapter> getChaptersByCourseId(Long courseId);
}
