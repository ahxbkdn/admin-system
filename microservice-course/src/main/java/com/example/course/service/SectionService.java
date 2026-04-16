package com.example.course.service;

import com.example.course.entity.Section;

import java.util.List;

public interface SectionService {
    List<Section> list();
    Section getById(Long id);
    boolean save(Section section);
    boolean updateById(Section section);
    boolean removeById(Long id);
    // 根据章节ID获取小节列表
    List<Section> getSectionsByChapterId(Long chapterId);
}
