# 课程管理服务

## 项目简介

课程管理服务是一个基于Spring Boot + MyBatis-Plus + MySQL的微服务，提供课程、章节和小节的管理功能。

## 技术栈

- Spring Boot 3.2.x
- MyBatis-Plus 3.5.x
- MySQL 8.0
- Spring Cloud 2023.x
- Eureka 服务注册与发现
- Spring Cloud Config 配置管理
- Spring Cloud Gateway API网关
- OpenFeign 服务间通信
- Spring Security + JWT 认证

## 项目结构

```
microservice-course/
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/
│   │   │       └── example/
│   │   │           └── course/
│   │   │               ├── controller/   # 控制器
│   │   │               ├── entity/       # 实体类
│   │   │               ├── mapper/       # 数据访问
│   │   │               ├── service/      # 服务
│   │   │               └── CourseApplication.java  # 应用入口
│   │   └── resources/
│   │       ├── application.yml  # 配置文件
│   │       └── mapper/          # XML映射文件
│   └── test/                    # 测试
├── pom.xml                      # Maven配置
└── README.md                    # 项目说明
```

## 接口说明

### 课程接口

- **GET /courses** - 获取课程列表
- **GET /courses/{id}** - 获取课程详情
- **POST /courses** - 创建课程
- **PUT /courses/{id}** - 更新课程
- **DELETE /courses/{id}** - 删除课程

### 章节接口

- **GET /chapters/course/{courseId}** - 获取课程的章节列表
- **GET /chapters/{id}** - 获取章节详情
- **POST /chapters** - 创建章节
- **PUT /chapters/{id}** - 更新章节
- **DELETE /chapters/{id}** - 删除章节

### 小节接口

- **GET /sections/chapter/{chapterId}** - 获取章节的小节列表
- **GET /sections/{id}** - 获取小节详情
- **POST /sections** - 创建小节
- **PUT /sections/{id}** - 更新小节
- **DELETE /sections/{id}** - 删除小节

## 部署步骤

1. **创建数据库**
   - 登录MySQL数据库
   - 执行 `db-init.sql` 脚本创建表结构和测试数据

2. **配置服务**
   - 修改 `application.yml` 文件中的数据库连接信息
   - 配置Eureka服务地址

3. **构建项目**
   ```bash
   mvn clean package
   ```

4. **启动服务**
   ```bash
   java -jar target/microservice-course-1.0.0.jar
   ```

## 测试接口

使用Postman或其他API测试工具测试接口：

1. **获取课程列表**
   - 请求方式：GET
   - 请求URL：http://localhost:8080/courses

2. **创建课程**
   - 请求方式：POST
   - 请求URL：http://localhost:8080/courses
   - 请求体：
   ```json
   {
     "title": "Java 基础教程",
     "lecturer": "张老师",
     "totalHours": 50,
     "description": "Java 从入门到精通",
     "coverImage": "https://example.com/cover3.jpg",
     "price": 129.00,
     "status": 1
   }
   ```

3. **获取章节列表**
   - 请求方式：GET
   - 请求URL：http://localhost:8080/chapters/course/1

4. **创建章节**
   - 请求方式：POST
   - 请求URL：http://localhost:8080/chapters
   - 请求体：
   ```json
   {
     "courseId": 1,
     "title": "第三章 Spring Boot进阶",
     "sort": 3
   }
   ```

5. **获取小节列表**
   - 请求方式：GET
   - 请求URL：http://localhost:8080/sections/chapter/1

6. **创建小节**
   - 请求方式：POST
   - 请求URL：http://localhost:8080/sections
   - 请求体：
   ```json
   {
     "chapterId": 1,
     "title": "第3节 项目搭建",
     "content": "项目搭建步骤...",
     "videoUrl": "https://example.com/video5.mp4",
     "duration": 600,
     "sort": 3,
     "isFree": true
   }
   ```

## 注意事项

- 确保MySQL数据库服务正在运行
- 确保Eureka服务注册中心正在运行
- 确保数据库连接信息配置正确
- 确保端口号没有被占用
