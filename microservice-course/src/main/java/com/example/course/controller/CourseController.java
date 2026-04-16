package com.example.course.controller;

import com.example.common.response.ApiResponse;
import com.example.course.entity.Course;
import com.example.course.service.impl.CourseServiceMemoryImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/courses")
public class CourseController {

    @Autowired
    private CourseServiceMemoryImpl courseService;

    // 获取课程列表
    @GetMapping
    public ApiResponse<List<Course>> getCourses() {
        List<Course> courses = courseService.list();
        return ApiResponse.success(courses);
    }

    // 获取课程详情
    @GetMapping("/{id}")
    public ApiResponse<Course> getCourseById(@PathVariable Long id) {
        Course course = courseService.getById(id);
        if (course == null) {
            return ApiResponse.fail(404, "课程不存在");
        }
        return ApiResponse.success(course);
    }

    // 创建课程
    @PostMapping
    public ApiResponse<Course> createCourse(@RequestBody Course course) {
        courseService.save(course);
        return ApiResponse.success(course);
    }

    // 更新课程
    @PutMapping("/{id}")
    public ApiResponse<Course> updateCourse(@PathVariable Long id, @RequestBody Course course) {
        course.setId(id);
        boolean success = courseService.updateById(course);
        if (!success) {
            return ApiResponse.fail(404, "课程不存在");
        }
        return ApiResponse.success(course);
    }

    // 删除课程
    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteCourse(@PathVariable Long id) {
        boolean success = courseService.removeById(id);
        if (!success) {
            return ApiResponse.fail(404, "课程不存在");
        }
        return ApiResponse.success();
    }
}
