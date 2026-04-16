# 课程管理API文档

## 1. 概述

本文档描述了课程管理系统的API接口，包括课程、章节和小节的CRUD操作。

## 2. 基础信息

- **API基础URL**: `http://localhost:8080`
- **请求方法**: GET, POST, PUT, DELETE
- **响应格式**: JSON
- **状态码**: 200（成功）, 404（资源不存在）, 500（服务器错误）

## 3. API接口列表

### 3.1 课程相关接口

| 接口路径 | 方法 | 功能描述 | 请求体 (JSON) | 成功响应 (200 OK) |
|---------|------|---------|--------------|-------------------|
| `/courses` | GET | 获取课程列表 | N/A | `{"code": 200, "data": [{"id": 1, "title": "Spring Boot 基础教程", ...}], "message": "获取课程列表成功"}` |
| `/courses` | POST | 创建课程 | `{"title": "课程标题", "lecturer": "讲师", "totalHours": 40, "description": "课程简介", "coverImage": "封面图片URL", "price": 99.0, "status": 1}` | `{"code": 200, "data": {"id": 3, "title": "课程标题", ...}, "message": "创建课程成功"}` |
| `/courses/:id` | GET | 获取课程详情 | N/A | `{"code": 200, "data": {"id": 1, "title": "Spring Boot 基础教程", ...}, "message": "获取课程成功"}` |
| `/courses/:id` | PUT | 更新课程 | `{"title": "更新后的标题", "lecturer": "讲师", ...}` | `{"code": 200, "data": {"id": 1, "title": "更新后的标题", ...}, "message": "更新课程成功"}` |
| `/courses/:id` | DELETE | 删除课程 | N/A | `{"code": 200, "message": "删除课程成功"}` |

### 3.2 章节相关接口

| 接口路径 | 方法 | 功能描述 | 请求体 (JSON) | 成功响应 (200 OK) |
|---------|------|---------|--------------|-------------------|
| `/chapters/course/:courseId` | GET | 获取课程的章节列表 | N/A | `{"code": 200, "data": [{"id": 1, "courseId": 1, "title": "第一章 简介", "sort": 1}], "message": "获取章节列表成功"}` |
| `/chapters` | POST | 创建章节 | `{"courseId": 1, "title": "章节标题", "sort": 1}` | `{"code": 200, "data": {"id": 3, "courseId": 1, "title": "章节标题", "sort": 1}, "message": "创建章节成功"}` |
| `/chapters/:id` | PUT | 更新章节 | `{"title": "更新后的标题", "sort": 2}` | `{"code": 200, "data": {"id": 1, "courseId": 1, "title": "更新后的标题", "sort": 2}, "message": "更新章节成功"}` |
| `/chapters/:id` | DELETE | 删除章节 | N/A | `{"code": 200, "message": "删除章节成功"}` |

### 3.3 小节相关接口

| 接口路径 | 方法 | 功能描述 | 请求体 (JSON) | 成功响应 (200 OK) |
|---------|------|---------|--------------|-------------------|
| `/sections/chapter/:chapterId` | GET | 获取章节的小节列表 | N/A | `{"code": 200, "data": [{"id": 1, "chapterId": 1, "title": "1.1 什么是课程", ...}], "message": "获取小节列表成功"}` |
| `/sections` | POST | 创建小节 | `{"chapterId": 1, "title": "小节标题", "content": "小节内容", "videoUrl": "视频URL", "duration": 600, "sort": 1, "isFree": true}` | `{"code": 200, "data": {"id": 3, "chapterId": 1, "title": "小节标题", ...}, "message": "创建小节成功"}` |
| `/sections/:id` | PUT | 更新小节 | `{"title": "更新后的标题", "content": "更新后的内容", ...}` | `{"code": 200, "data": {"id": 1, "chapterId": 1, "title": "更新后的标题", ...}, "message": "更新小节成功"}` |
| `/sections/:id` | DELETE | 删除小节 | N/A | `{"code": 200, "message": "删除小节成功"}` |

## 4. 数据模型

### 4.1 课程 (Course)

| 字段名 | 类型 | 描述 | 示例值 |
|-------|------|------|--------|
| id | Long | 课程ID | 1 |
| title | String | 课程标题 | "Spring Boot 基础教程" |
| lecturer | String | 讲师 | "李刚" |
| totalHours | Integer | 总课时 | 40 |
| description | String | 课程简介 | "Spring Boot 入门到精通" |
| coverImage | String | 课程封面图 | "https://example.com/cover1.jpg" |
| price | Double | 课程价格 | 99.0 |
| status | Integer | 状态（1-正常，0-禁用） | 1 |
| createTime | LocalDateTime | 创建时间 | "2026-03-24T14:17:50.617Z" |
| updateTime | LocalDateTime | 更新时间 | "2026-03-24T14:17:50.617Z" |

### 4.2 章节 (Chapter)

| 字段名 | 类型 | 描述 | 示例值 |
|-------|------|------|--------|
| id | Long | 章节ID | 1 |
| courseId | Long | 课程ID | 1 |
| title | String | 章节标题 | "第一章 环境搭建" |
| sort | Integer | 排序 | 1 |

### 4.3 小节 (Section)

| 字段名 | 类型 | 描述 | 示例值 |
|-------|------|------|--------|
| id | Long | 小节ID | 1 |
| chapterId | Long | 章节ID | 1 |
| title | String | 课时名称 | "1.1 什么是课程" |
| content | String | 内容 | "课程是..." |
| videoUrl | String | 视频URL | "https://example.com/video1.mp4" |
| duration | Integer | 时长（秒） | 600 |
| sort | Integer | 排序 | 1 |
| isFree | Boolean | 是否免费 | true |

## 5. 错误响应

| 状态码 | 响应示例 | 描述 |
|-------|---------|------|
| 404 | `{"code": 404, "message": "课程不存在"}` | 资源不存在 |
| 500 | `{"code": 500, "message": "服务器错误"}` | 服务器内部错误 |

## 6. 测试数据

系统默认包含以下测试数据：

### 6.1 课程
- ID: 1, 标题: "Spring Boot 基础教程", 讲师: "李刚", 总课时: 40, 价格: 99.0
- ID: 2, 标题: "React 实战教程", 讲师: "王老师", 总课时: 30, 价格: 79.0

### 6.2 章节
- ID: 1, 课程ID: 1, 标题: "第一章 环境搭建", 排序: 1
- ID: 2, 课程ID: 1, 标题: "第二章 Spring Boot基础", 排序: 2
- ID: 3, 课程ID: 2, 标题: "第一章 React基础", 排序: 1

### 6.3 小节
- ID: 1, 章节ID: 1, 标题: "第1节 DevEcoStudio安装", 时长: 600, 免费: true
- ID: 2, 章节ID: 1, 标题: "第2节 环境变量配置", 时长: 480, 免费: true
- ID: 3, 章节ID: 2, 标题: "第1节 Spring Boot简介", 时长: 720, 免费: false
- ID: 4, 章节ID: 3, 标题: "第1节 React简介", 时长: 540, 免费: true

## 7. 前端集成

前端通过以下步骤集成API：

1. 配置Vite代理，将`/api`请求转发到`http://localhost:8080`
2. 使用axios发送HTTP请求
3. 处理响应数据和错误
4. 实现课程管理的两步创建流程：
   - 第一步：填写课程基本信息
   - 第二步：创建课程大纲（章节和小节）

## 8. 部署说明

1. **后端服务**：
   - 可以使用mock服务器模拟API接口
   - 也可以部署真实的Spring Boot后端服务

2. **前端服务**：
   - 开发环境：`npm run dev`
   - 生产环境：`npm run build` 然后部署生成的`dist`目录

3. **数据库**：
   - 执行`db-init.sql`脚本创建表结构和测试数据
   - 配置数据库连接信息

## 9. 总结

本API文档提供了完整的课程管理功能，包括课程、章节和小节的CRUD操作。前端可以通过这些API接口实现完整的课程管理系统，包括课程创建、编辑、删除，以及章节和小节的管理。