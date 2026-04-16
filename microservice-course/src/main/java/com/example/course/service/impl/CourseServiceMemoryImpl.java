package com.example.course.service.impl;

import com.example.course.entity.Course;
import com.example.course.service.CourseService;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.atomic.AtomicLong;

@Service
public class CourseServiceMemoryImpl implements CourseService {

    private final List<Course> courses = new ArrayList<>();
    private final AtomicLong idGenerator = new AtomicLong(1);

    public CourseServiceMemoryImpl() {
        // 初始化一些测试数据
        Course course1 = new Course();
        course1.setId(idGenerator.getAndIncrement());
        course1.setTitle("Spring Boot 基础教程");
        course1.setLecturer("李刚");
        course1.setTotalHours(40);
        course1.setDescription("Spring Boot 入门到精通");
        course1.setCoverImage("https://example.com/cover1.jpg");
        course1.setPrice(99.00);
        course1.setStatus(1);
        course1.setCreateTime(LocalDateTime.now());
        course1.setUpdateTime(LocalDateTime.now());
        courses.add(course1);

        Course course2 = new Course();
        course2.setId(idGenerator.getAndIncrement());
        course2.setTitle("React 实战教程");
        course2.setLecturer("王老师");
        course2.setTotalHours(30);
        course2.setDescription("React 从基础到高级");
        course2.setCoverImage("https://example.com/cover2.jpg");
        course2.setPrice(79.00);
        course2.setStatus(1);
        course2.setCreateTime(LocalDateTime.now());
        course2.setUpdateTime(LocalDateTime.now());
        courses.add(course2);
    }

    @Override
    public List<Course> list() {
        return courses;
    }

    @Override
    public Course getById(Long id) {
        return courses.stream()
                .filter(course -> course.getId().equals(id))
                .findFirst()
                .orElse(null);
    }

    @Override
    public boolean save(Course course) {
        course.setId(idGenerator.getAndIncrement());
        course.setCreateTime(LocalDateTime.now());
        course.setUpdateTime(LocalDateTime.now());
        return courses.add(course);
    }

    @Override
    public boolean updateById(Course course) {
        Course existingCourse = getById(course.getId());
        if (existingCourse != null) {
            existingCourse.setTitle(course.getTitle());
            existingCourse.setLecturer(course.getLecturer());
            existingCourse.setTotalHours(course.getTotalHours());
            existingCourse.setDescription(course.getDescription());
            existingCourse.setCoverImage(course.getCoverImage());
            existingCourse.setPrice(course.getPrice());
            existingCourse.setStatus(course.getStatus());
            existingCourse.setUpdateTime(LocalDateTime.now());
            return true;
        }
        return false;
    }

    @Override
    public boolean removeById(Long id) {
        return courses.removeIf(course -> course.getId().equals(id));
    }
}