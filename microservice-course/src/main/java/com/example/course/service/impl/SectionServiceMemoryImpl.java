package com.example.course.service.impl;

import com.example.course.entity.Section;
import com.example.course.service.SectionService;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.atomic.AtomicLong;
import java.util.stream.Collectors;

@Service
public class SectionServiceMemoryImpl implements SectionService {

    private final List<Section> sections = new ArrayList<>();
    private final AtomicLong idGenerator = new AtomicLong(1);

    public SectionServiceMemoryImpl() {
        // 初始化一些测试数据
        Section section1 = new Section();
        section1.setId(idGenerator.getAndIncrement());
        section1.setChapterId(1L);
        section1.setTitle("第1节 DevEcoStudio安装");
        section1.setContent("DevEcoStudio安装步骤...");
        section1.setVideoUrl("https://example.com/video1.mp4");
        section1.setDuration(600);
        section1.setSort(1);
        section1.setIsFree(true);
        sections.add(section1);

        Section section2 = new Section();
        section2.setId(idGenerator.getAndIncrement());
        section2.setChapterId(1L);
        section2.setTitle("第2节 环境变量配置");
        section2.setContent("环境变量配置步骤...");
        section2.setVideoUrl("https://example.com/video2.mp4");
        section2.setDuration(480);
        section2.setSort(2);
        section2.setIsFree(true);
        sections.add(section2);

        Section section3 = new Section();
        section3.setId(idGenerator.getAndIncrement());
        section3.setChapterId(2L);
        section3.setTitle("第1节 Spring Boot简介");
        section3.setContent("Spring Boot简介...");
        section3.setVideoUrl("https://example.com/video3.mp4");
        section3.setDuration(720);
        section3.setSort(1);
        section3.setIsFree(false);
        sections.add(section3);

        Section section4 = new Section();
        section4.setId(idGenerator.getAndIncrement());
        section4.setChapterId(3L);
        section4.setTitle("第1节 React简介");
        section4.setContent("React简介...");
        section4.setVideoUrl("https://example.com/video4.mp4");
        section4.setDuration(540);
        section4.setSort(1);
        section4.setIsFree(true);
        sections.add(section4);
    }

    @Override
    public List<Section> getSectionsByChapterId(Long chapterId) {
        return sections.stream()
                .filter(section -> section.getChapterId().equals(chapterId))
                .collect(Collectors.toList());
    }

    @Override
    public List<Section> list() {
        return sections;
    }

    @Override
    public Section getById(Long id) {
        return sections.stream()
                .filter(section -> section.getId().equals(id))
                .findFirst()
                .orElse(null);
    }

    @Override
    public boolean save(Section section) {
        section.setId(idGenerator.getAndIncrement());
        return sections.add(section);
    }

    @Override
    public boolean updateById(Section section) {
        Section existingSection = getById(section.getId());
        if (existingSection != null) {
            existingSection.setChapterId(section.getChapterId());
            existingSection.setTitle(section.getTitle());
            existingSection.setContent(section.getContent());
            existingSection.setVideoUrl(section.getVideoUrl());
            existingSection.setDuration(section.getDuration());
            existingSection.setSort(section.getSort());
            existingSection.setIsFree(section.getIsFree());
            return true;
        }
        return false;
    }

    @Override
    public boolean removeById(Long id) {
        return sections.removeIf(section -> section.getId().equals(id));
    }
}