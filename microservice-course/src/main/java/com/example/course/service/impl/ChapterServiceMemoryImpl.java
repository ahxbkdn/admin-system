package com.example.course.service.impl;

import com.example.course.entity.Chapter;
import com.example.course.service.ChapterService;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.atomic.AtomicLong;
import java.util.stream.Collectors;

@Service
public class ChapterServiceMemoryImpl implements ChapterService {

    private final List<Chapter> chapters = new ArrayList<>();
    private final AtomicLong idGenerator = new AtomicLong(1);

    public ChapterServiceMemoryImpl() {
        // 初始化一些测试数据
        Chapter chapter1 = new Chapter();
        chapter1.setId(idGenerator.getAndIncrement());
        chapter1.setCourseId(1L);
        chapter1.setTitle("第一章 环境搭建");
        chapter1.setSort(1);
        chapters.add(chapter1);

        Chapter chapter2 = new Chapter();
        chapter2.setId(idGenerator.getAndIncrement());
        chapter2.setCourseId(1L);
        chapter2.setTitle("第二章 Spring Boot基础");
        chapter2.setSort(2);
        chapters.add(chapter2);

        Chapter chapter3 = new Chapter();
        chapter3.setId(idGenerator.getAndIncrement());
        chapter3.setCourseId(2L);
        chapter3.setTitle("第一章 React基础");
        chapter3.setSort(1);
        chapters.add(chapter3);
    }

    @Override
    public List<Chapter> getChaptersByCourseId(Long courseId) {
        return chapters.stream()
                .filter(chapter -> chapter.getCourseId().equals(courseId))
                .collect(Collectors.toList());
    }

    @Override
    public List<Chapter> list() {
        return chapters;
    }

    @Override
    public Chapter getById(Long id) {
        return chapters.stream()
                .filter(chapter -> chapter.getId().equals(id))
                .findFirst()
                .orElse(null);
    }

    @Override
    public boolean save(Chapter chapter) {
        chapter.setId(idGenerator.getAndIncrement());
        return chapters.add(chapter);
    }

    @Override
    public boolean updateById(Chapter chapter) {
        Chapter existingChapter = getById(chapter.getId());
        if (existingChapter != null) {
            existingChapter.setCourseId(chapter.getCourseId());
            existingChapter.setTitle(chapter.getTitle());
            existingChapter.setSort(chapter.getSort());
            return true;
        }
        return false;
    }

    @Override
    public boolean removeById(Long id) {
        return chapters.removeIf(chapter -> chapter.getId().equals(id));
    }
}