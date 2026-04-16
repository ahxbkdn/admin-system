-- 创建课程表
CREATE TABLE IF NOT EXISTS `course` (
  `id` BIGINT(20) NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(255) NOT NULL COMMENT '课程标题',
  `lecturer` VARCHAR(100) NOT NULL COMMENT '讲师',
  `total_hours` INT(11) DEFAULT NULL COMMENT '总课时',
  `description` TEXT COMMENT '课程简介',
  `cover_image` VARCHAR(255) DEFAULT NULL COMMENT '课程封面图',
  `price` DOUBLE DEFAULT NULL COMMENT '课程价格',
  `status` INT(11) DEFAULT 1 COMMENT '状态：1-正常，0-禁用',
  `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='课程表';

-- 创建章节表
CREATE TABLE IF NOT EXISTS `chapter` (
  `id` BIGINT(20) NOT NULL AUTO_INCREMENT,
  `course_id` BIGINT(20) NOT NULL COMMENT '课程ID',
  `title` VARCHAR(255) NOT NULL COMMENT '章节标题',
  `sort` INT(11) DEFAULT 0 COMMENT '排序',
  PRIMARY KEY (`id`),
  KEY `idx_course_id` (`course_id`),
  CONSTRAINT `fk_chapter_course` FOREIGN KEY (`course_id`) REFERENCES `course` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='章节表';

-- 创建小节表
CREATE TABLE IF NOT EXISTS `section` (
  `id` BIGINT(20) NOT NULL AUTO_INCREMENT,
  `chapter_id` BIGINT(20) NOT NULL COMMENT '章节ID',
  `title` VARCHAR(255) NOT NULL COMMENT '课时名称',
  `content` TEXT COMMENT '内容',
  `video_url` VARCHAR(255) DEFAULT NULL COMMENT '视频URL',
  `duration` INT(11) DEFAULT 0 COMMENT '时长（秒）',
  `sort` INT(11) DEFAULT 0 COMMENT '排序',
  `is_free` BOOLEAN DEFAULT TRUE COMMENT '是否免费',
  PRIMARY KEY (`id`),
  KEY `idx_chapter_id` (`chapter_id`),
  CONSTRAINT `fk_section_chapter` FOREIGN KEY (`chapter_id`) REFERENCES `chapter` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='小节表';

-- 插入测试数据
INSERT INTO `course` (`title`, `lecturer`, `total_hours`, `description`, `cover_image`, `price`, `status`) VALUES
('Spring Boot 基础教程', '李刚', 40, 'Spring Boot 入门到精通', 'https://example.com/cover1.jpg', 99.00, 1),
('React 实战教程', '王老师', 30, 'React 从基础到高级', 'https://example.com/cover2.jpg', 79.00, 1);

-- 插入章节测试数据
INSERT INTO `chapter` (`course_id`, `title`, `sort`) VALUES
(1, '第一章 环境搭建', 1),
(1, '第二章 Spring Boot基础', 2),
(2, '第一章 React基础', 1);

-- 插入小节测试数据
INSERT INTO `section` (`chapter_id`, `title`, `content`, `video_url`, `duration`, `sort`, `is_free`) VALUES
(1, '第1节 DevEcoStudio安装', 'DevEcoStudio安装步骤...', 'https://example.com/video1.mp4', 600, 1, TRUE),
(1, '第2节 环境变量配置', '环境变量配置步骤...', 'https://example.com/video2.mp4', 480, 2, TRUE),
(2, '第1节 Spring Boot简介', 'Spring Boot简介...', 'https://example.com/video3.mp4', 720, 1, FALSE),
(3, '第1节 React简介', 'React简介...', 'https://example.com/video4.mp4', 540, 1, TRUE);

-- 创建轮播图表
CREATE TABLE IF NOT EXISTS `banner` (
  `id` BIGINT(20) NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(255) NOT NULL COMMENT '轮播图标题',
  `image_url` VARCHAR(500) NOT NULL COMMENT '图片URL',
  `link_url` VARCHAR(500) DEFAULT NULL COMMENT '链接URL',
  `sort` INT(11) DEFAULT 0 COMMENT '排序',
  `status` INT(11) DEFAULT 1 COMMENT '状态：1-正常，0-禁用',
  `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='轮播图表';

-- 插入轮播图测试数据
INSERT INTO `banner` (`title`, `image_url`, `link_url`, `sort`, `status`) VALUES
('Spring Boot 课程推荐', 'https://example.com/banner1.jpg', 'https://example.com/course/1', 1, 1),
('React 实战课程', 'https://example.com/banner2.jpg', 'https://example.com/course/2', 2, 1),
('Vue 3 入门教程', 'https://example.com/banner3.jpg', 'https://example.com/course/3', 3, 1);
