# 课程管理后端接口部署指南

## 1. 部署前准备

### 1.1 服务器要求
- Java 11或更高版本
- MySQL 8.0或更高版本
- 足够的内存和磁盘空间
- 网络连接正常

### 1.2 所需文件
- `microservice-course-1.0.0.jar`：构建生成的可执行JAR文件
- `db-init.sql`：数据库初始化脚本

## 2. 部署步骤

### 2.1 上传文件到服务器

**方法1：使用SCP命令（推荐）**
```bash
# 从本地上传JAR文件到服务器
scp microservice-course-1.0.0.jar root@120.55.194.16:/opt/course-service/

# 上传数据库初始化脚本
scp db-init.sql root@120.55.194.16:/opt/course-service/
```

**方法2：使用FTP工具**
- 使用FileZilla、WinSCP等FTP工具连接服务器
- 将JAR文件和数据库初始化脚本上传到服务器的`/opt/course-service/`目录

### 2.2 初始化数据库

1. 登录服务器
```bash
ssh root@120.55.194.16
```

2. 连接MySQL数据库
```bash
mysql -u root -p
```

3. 创建数据库（如果不存在）
```sql
CREATE DATABASE IF NOT EXISTS course_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

4. 切换到course_db数据库
```sql
USE course_db;
```

5. 执行数据库初始化脚本
```sql
SOURCE /opt/course-service/db-init.sql;
```

6. 验证数据库表是否创建成功
```sql
SHOW TABLES;
```

### 2.3 配置服务

1. 编辑配置文件（如果需要修改配置）
```bash
vi /opt/course-service/application.yml
```

2. 确保数据库连接配置正确
```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/course_db?useUnicode=true&characterEncoding=utf8&serverTimezone=Asia/Shanghai
    username: root
    password: your_password
    driver-class-name: com.mysql.cj.jdbc.Driver
```

### 2.4 启动服务

**方法1：直接启动（测试用）**
```bash
java -jar /opt/course-service/microservice-course-1.0.0.jar
```

**方法2：使用systemd服务（生产用）**
1. 创建systemd服务文件
```bash
vi /etc/systemd/system/course-service.service
```

2. 添加以下内容
```ini
[Unit]
Description=Course Management Service
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/opt/course-service
ExecStart=/usr/bin/java -jar /opt/course-service/microservice-course-1.0.0.jar
Restart=on-failure

[Install]
WantedBy=multi-user.target
```

3. 重新加载systemd配置
```bash
systemctl daemon-reload
```

4. 启动服务
```bash
systemctl start course-service
```

5. 设置服务开机自启
```bash
systemctl enable course-service
```

### 2.5 验证服务状态

1. 检查服务是否启动成功
```bash
systemctl status course-service
```

2. 查看服务日志
```bash
journalctl -u course-service
```

3. 验证服务是否监听端口
```bash
netstat -tulpn | grep 8080
```

## 3. 测试接口

### 3.1 使用curl测试

**测试获取课程列表**
```bash
curl -X GET http://120.55.194.16:8080/courses
```

**测试创建课程**
```bash
curl -X POST http://120.55.194.16:8080/courses \
  -H "Content-Type: application/json" \
  -d '{
    "title": "测试课程",
    "lecturer": "李刚",
    "totalHours": 40,
    "description": "这是一门测试课程",
    "coverImage": "https://example.com/cover.jpg",
    "price": 99.0,
    "status": 1
  }'
```

**测试获取章节列表**
```bash
curl -X GET http://120.55.194.16:8080/chapters/course/1
```

**测试获取小节列表**
```bash
curl -X GET http://120.55.194.16:8080/sections/chapter/1
```

### 3.2 使用Postman测试

1. 打开Postman
2. 创建新的请求
3. 测试以下接口：
   - GET /courses - 获取课程列表
   - POST /courses - 创建课程
   - GET /courses/{id} - 获取课程详情
   - PUT /courses/{id} - 更新课程
   - DELETE /courses/{id} - 删除课程
   - GET /chapters/course/{courseId} - 获取章节列表
   - POST /chapters - 创建章节
   - PUT /chapters/{id} - 更新章节
   - DELETE /chapters/{id} - 删除章节
   - GET /sections/chapter/{chapterId} - 获取小节列表
   - POST /sections - 创建小节
   - PUT /sections/{id} - 更新小节
   - DELETE /sections/{id} - 删除小节

## 4. 故障排除

### 4.1 服务启动失败
- 检查数据库连接是否正确
- 检查端口是否被占用
- 查看服务日志获取详细错误信息

### 4.2 数据库连接失败
- 确保MySQL服务正在运行
- 确保数据库连接信息正确
- 确保数据库用户有足够的权限

### 4.3 接口测试失败
- 检查服务是否正常运行
- 检查请求格式是否正确
- 检查参数是否符合要求

## 5. 性能优化

### 5.1 JVM参数优化
```bash
java -Xms512m -Xmx1024m -jar /opt/course-service/microservice-course-1.0.0.jar
```

### 5.2 数据库优化
- 添加适当的索引
- 优化SQL查询
- 配置连接池

## 6. 监控与维护

### 6.1 日志管理
- 定期清理日志文件
- 配置日志轮转

### 6.2 备份策略
- 定期备份数据库
- 备份配置文件和JAR文件

### 6.3 版本管理
- 保留不同版本的JAR文件
- 记录版本变更历史

## 7. 总结

本部署指南提供了详细的步骤，帮助您将课程管理后端接口部署到服务器上。如果您在部署过程中遇到任何问题，请参考故障排除部分，或联系技术支持。

祝您部署顺利！