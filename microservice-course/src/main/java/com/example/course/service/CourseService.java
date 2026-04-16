package com.example.course.service;

import com.example.course.entity.Course;

import java.util.List;

public interface CourseService {
    List<Course> list();
    Course getById(Long id);
    boolean save(Course course);
    boolean updateById(Course course);
    boolean removeById(Long id);
}
