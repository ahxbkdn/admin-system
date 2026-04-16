# 课程管理系统后端接口文档

## 1. 接口基础信息

- **服务器地址**: `http://120.55.194.16`
- **API基础路径**: `/api`
- **认证方式**: JWT Token（在请求头中添加 `Authorization: Bearer {token}`）
- **响应格式**: JSON

## 2. 课程管理接口

### 2.1 创建课程

**接口地址**: `POST /api/courses`

**请求参数**:

| 字段名 | 类型 | 必填 | 描述 |
|-------|------|------|------|
| title | string | 是 | 课程标题 |
| teacher | string | 是 | 课程主讲老师 |
| totalHours | number | 是 | 总课时 |
| description | string | 是 | 课程简介 |
| price | number | 是 | 课程价格 |
| category | string | 是 | 课程分类 |
| status | string | 是 | 课程状态（draft/published/offline） |
| cover | string | 否 | 课程封面图URL |

**响应示例**:

```json
{
  "code": 200,
  "message": "操作成功",
  "data": {
    "id": "1",
    "title": "后端开发实战",
    "teacher": "李老师",
    "totalHours": 40,
    "description": "本课程介绍后端开发的核心技术...",
    "price": 299,
    "category": "backend",
    "status": "published",
    "cover": "http://example.com/cover.jpg",
    "createTime": "2026-03-23 10:00:00"
  }
}
```

### 2.2 获取课程列表

**接口地址**: `GET /api/courses`

**请求参数**:

| 字段名 | 类型 | 必填 | 描述 |
|-------|------|------|------|
| page | number | 否 | 页码，默认1 |
| size | number | 否 | 每页数量，默认10 |
| title | string | 否 | 课程标题搜索 |
| teacher | string | 否 | 老师名称搜索 |
| category | string | 否 | 课程分类搜索 |
| status | string | 否 | 课程状态搜索 |

**响应示例**:

```json
{
  "code": 200,
  "message": "操作成功",
  "data": {
    "records": [
      {
        "id": "1",
        "title": "后端开发实战",
        "teacher": "李老师",
        "totalHours": 40,
        "price": 299,
        "category": "backend",
        "status": "published",
        "createTime": "2026-03-23 10:00:00"
      }
    ],
    "total": 1,
    "size": 10,
    "current": 1
  }
}
```

### 2.3 获取课程详情

**接口地址**: `GET /api/courses/{id}`

**响应示例**:

```json
{
  "code": 200,
  "message": "操作成功",
  "data": {
    "id": "1",
    "title": "后端开发实战",
    "teacher": "李老师",
    "totalHours": 40,
    "description": "本课程介绍后端开发的核心技术...",
    "price": 299,
    "category": "backend",
    "status": "published",
    "cover": "http://example.com/cover.jpg",
    "createTime": "2026-03-23 10:00:00"
  }
}
```

### 2.4 更新课程

**接口地址**: `PUT /api/courses/{id}`

**请求参数**:

| 字段名 | 类型 | 必填 | 描述 |
|-------|------|------|------|
| title | string | 否 | 课程标题 |
| teacher | string | 否 | 课程主讲老师 |
| totalHours | number | 否 | 总课时 |
| description | string | 否 | 课程简介 |
| price | number | 否 | 课程价格 |
| category | string | 否 | 课程分类 |
| status | string | 否 | 课程状态（draft/published/offline） |
| cover | string | 否 | 课程封面图URL |

**响应示例**:

```json
{
  "code": 200,
  "message": "操作成功",
  "data": {
    "id": "1",
    "title": "后端开发实战（更新）",
    "teacher": "李老师",
    "totalHours": 45,
    "description": "本课程介绍后端开发的核心技术...",
    "price": 399,
    "category": "backend",
    "status": "published",
    "cover": "http://example.com/cover.jpg",
    "createTime": "2026-03-23 10:00:00",
    "updateTime": "2026-03-23 11:00:00"
  }
}
```

### 2.5 删除课程

**接口地址**: `DELETE /api/courses/{id}`

**响应示例**:

```json
{
  "code": 200,
  "message": "操作成功",
  "data": true
}
```

## 3. 章节管理接口

### 3.1 添加章节

**接口地址**: `POST /api/courses/{courseId}/chapters`

**请求参数**:

| 字段名 | 类型 | 必填 | 描述 |
|-------|------|------|------|
| title | string | 是 | 章节标题 |
| sort | number | 否 | 章节排序 |

**响应示例**:

```json
{
  "code": 200,
  "message": "操作成功",
  "data": {
    "id": "1",
    "courseId": "1",
    "title": "第一章 环境搭建",
    "sort": 1,
    "createTime": "2026-03-23 10:00:00"
  }
}
```

### 3.2 获取章节列表

**接口地址**: `GET /api/courses/{courseId}/chapters`

**响应示例**:

```json
{
  "code": 200,
  "message": "操作成功",
  "data": [
    {
      "id": "1",
      "courseId": "1",
      "title": "第一章 环境搭建",
      "sort": 1,
      "createTime": "2026-03-23 10:00:00",
      "children": [
        {
          "id": "1-1",
          "chapterId": "1",
          "title": "第1节 DevEcoStudio安装",
          "sort": 1,
          "isFree": true,
          "videoUrl": "http://example.com/video1.mp4",
          "createTime": "2026-03-23 10:00:00"
        }
      ]
    }
  ]
}
```

### 3.3 更新章节

**接口地址**: `PUT /api/chapters/{id}`

**请求参数**:

| 字段名 | 类型 | 必填 | 描述 |
|-------|------|------|------|
| title | string | 否 | 章节标题 |
| sort | number | 否 | 章节排序 |

**响应示例**:

```json
{
  "code": 200,
  "message": "操作成功",
  "data": {
    "id": "1",
    "courseId": "1",
    "title": "第一章 环境搭建（更新）",
    "sort": 1,
    "createTime": "2026-03-23 10:00:00",
    "updateTime": "2026-03-23 11:00:00"
  }
}
```

### 3.4 删除章节

**接口地址**: `DELETE /api/chapters/{id}`

**响应示例**:

```json
{
  "code": 200,
  "message": "操作成功",
  "data": true
}
```

## 4. 小节管理接口

### 4.1 添加小节

**接口地址**: `POST /api/chapters/{chapterId}/sections`

**请求参数**:

| 字段名 | 类型 | 必填 | 描述 |
|-------|------|------|------|
| title | string | 是 | 课时名称 |
| sort | number | 否 | 课时排序 |
| isFree | boolean | 是 | 是否免费 |
| videoUrl | string | 否 | 视频URL |

**响应示例**:

```json
{
  "code": 200,
  "message": "操作成功",
  "data": {
    "id": "1-1",
    "chapterId": "1",
    "title": "第1节 DevEcoStudio安装",
    "sort": 1,
    "isFree": true,
    "videoUrl": "http://example.com/video1.mp4",
    "createTime": "2026-03-23 10:00:00"
  }
}
```

### 4.2 更新小节

**接口地址**: `PUT /api/sections/{id}`

**请求参数**:

| 字段名 | 类型 | 必填 | 描述 |
|-------|------|------|------|
| title | string | 否 | 课时名称 |
| sort | number | 否 | 课时排序 |
| isFree | boolean | 否 | 是否免费 |
| videoUrl | string | 否 | 视频URL |

**响应示例**:

```json
{
  "code": 200,
  "message": "操作成功",
  "data": {
    "id": "1-1",
    "chapterId": "1",
    "title": "第1节 DevEcoStudio安装（更新）",
    "sort": 1,
    "isFree": true,
    "videoUrl": "http://example.com/video1.mp4",
    "createTime": "2026-03-23 10:00:00",
    "updateTime": "2026-03-23 11:00:00"
  }
}
```

### 4.3 删除小节

**接口地址**: `DELETE /api/sections/{id}`

**响应示例**:

```json
{
  "code": 200,
  "message": "操作成功",
  "data": true
}
```

## 5. 文件上传接口

### 5.1 上传文件

**接口地址**: `POST /api/upload`

**请求参数**:
- 表单数据：`file` (文件)

**响应示例**:

```json
{
  "code": 200,
  "message": "操作成功",
  "data": {
    "url": "http://120.55.194.16/upload/file.jpg"
  }
}
```

## 6. 数据模型

### 6.1 课程模型

```json
{
  "id": "1",
  "title": "后端开发实战",
  "teacher": "李老师",
  "totalHours": 40,
  "description": "本课程介绍后端开发的核心技术...",
  "price": 299,
  "category": "backend",
  "status": "published",
  "cover": "http://example.com/cover.jpg",
  "createTime": "2026-03-23 10:00:00",
  "updateTime": "2026-03-23 11:00:00"
}
```

### 6.2 章节模型

```json
{
  "id": "1",
  "courseId": "1",
  "title": "第一章 环境搭建",
  "sort": 1,
  "createTime": "2026-03-23 10:00:00",
  "updateTime": "2026-03-23 11:00:00",
  "children": [
    // 小节列表
  ]
}
```

### 6.3 小节模型

```json
{
  "id": "1-1",
  "chapterId": "1",
  "title": "第1节 DevEcoStudio安装",
  "sort": 1,
  "isFree": true,
  "videoUrl": "http://example.com/video1.mp4",
  "createTime": "2026-03-23 10:00:00",
  "updateTime": "2026-03-23 11:00:00"
}
```

## 7. 错误响应格式

```json
{
  "code": 400,
  "message": "请求参数错误",
  "data": null
}
```

```json
{
  "code": 401,
  "message": "未授权",
  "data": null
}
```

```json
{
  "code": 404,
  "message": "资源不存在",
  "data": null
}
```

```json
{
  "code": 500,
  "message": "服务器内部错误",
  "data": null
}
```
