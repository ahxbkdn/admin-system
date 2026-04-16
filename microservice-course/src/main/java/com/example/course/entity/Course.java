package com.example.course.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@TableName("course")
public class Course {
    @TableId(type = IdType.AUTO)
    private Long id;
    private String title;
    private String lecturer;
    private Integer totalHours;
    private String description;
    private String coverImage;
    private Double price;
    private Integer status;
    private LocalDateTime createTime;
    private LocalDateTime updateTime;
}
