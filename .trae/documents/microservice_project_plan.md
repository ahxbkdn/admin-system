# 微服务项目计划

## 项目概述
基于 Spring Boot + MyBatis-Plus + MySQL 创建微服务项目，包含以下服务：
1. 用户认证服务（含RBAC权限管理）
2. 课程服务
3. AI服务

## 技术栈
- **基础框架**：Spring Boot 3.2.x
- **ORM框架**：MyBatis-Plus 3.5.x
- **数据库**：MySQL 8.0
- **微服务框架**：Spring Cloud 2023.x
- **服务注册与发现**：Eureka
- **配置中心**：Spring Cloud Config
- **API网关**：Spring Cloud Gateway
- **服务间通信**：OpenFeign
- **认证框架**：Spring Security + JWT
- **构建工具**：Maven
- **代码管理**：Git

## 项目结构

### 1. 父项目（microservice-parent）
- 管理依赖版本
- 统一配置

### 2. 通用模块（microservice-common）
- 公共工具类
- 公共配置
- 公共实体类
- 公共异常处理

### 3. 用户认证服务（microservice-auth）
- 用户管理
- 角色管理
- 权限管理
- RBAC权限控制
- JWT认证

### 4. 课程服务（microservice-course）
- 课程管理
- 章节管理
- 小节管理
- 课程内容管理

### 5. AI服务（microservice-ai）
- AI模型管理
- AI推理服务
- 智能推荐
- 内容生成

### 6. API网关（microservice-gateway）
- 请求路由
- 认证鉴权
- 流量控制

## 数据库设计

### 用户认证服务数据库
- `sys_user`：用户表
- `sys_role`：角色表
- `sys_permission`：权限表
- `sys_user_role`：用户角色关联表
- `sys_role_permission`：角色权限关联表

### 课程服务数据库
- `course`：课程表
- `chapter`：章节表
- `section`：小节表
- `course_content`：课程内容表

### AI服务数据库
- `ai_model`：AI模型表
- `ai_task`：AI任务表
- `ai_result`：AI结果表

## 服务间通信
- 使用 OpenFeign 进行服务间调用
- 使用 RabbitMQ 进行异步消息传递

## 部署方案
- 使用 Docker 容器化部署
- 使用 Kubernetes 进行容器编排
- 使用 Jenkins 进行 CI/CD

## 实现步骤

### 步骤1：创建父项目和通用模块
- 创建 Maven 父项目
- 配置依赖版本
- 创建通用模块

### 步骤2：创建用户认证服务
- 实现用户管理功能
- 实现角色管理功能
- 实现权限管理功能
- 实现 RBAC 权限控制
- 实现 JWT 认证

### 步骤3：创建课程服务
- 实现课程管理功能
- 实现章节管理功能
- 实现小节管理功能
- 实现课程内容管理功能

### 步骤4：创建 AI 服务
- 实现 AI 模型管理功能
- 实现 AI 推理服务功能
- 实现智能推荐功能
- 实现内容生成功能

### 步骤5：创建 API 网关
- 配置请求路由
- 实现认证鉴权
- 实现流量控制

### 步骤6：测试和部署
- 单元测试
- 集成测试
- 部署到生产环境

## 预期成果
- 完整的微服务架构
- 实现用户认证和 RBAC 权限管理
- 实现课程管理功能
- 实现 AI 服务功能
- 服务间通信正常
- 系统稳定运行