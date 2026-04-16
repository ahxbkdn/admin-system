# 部署说明 (阿里云 120.55.194.16)

本项目已针对阿里云服务器进行配置。

## 1. 前端配置更新
- `.env.production` 中的 `VITE_API_URL` 已更新为 `http://120.55.194.16:8080`。
- `vite.config.ts` 中的代理目标已更新为 `http://120.55.194.16:8080`。

## 2. 后端部署步骤 (Docker)
建议使用 Docker Compose 在阿里云服务器上部署后端微服务。

### 准备工作
1. 将整个项目代码上传到阿里云服务器。
2. 确保服务器已安装 `Docker` 和 `Docker Compose`。

### 部署命令
在项目根目录下执行以下命令：

```bash
# 1. 编译所有 Java 模块 (确保本地或服务器有 JDK 17 和 Maven)
mvn clean package -DskipTests

# 2. 启动所有容器
docker-compose up -d --build
```

### 访问地址
- **Eureka 注册中心**: `http://120.55.194.16:8761`
- **网关 (API 入口)**: `http://120.55.194.16:8080`
- **课程接口示例**: `http://120.55.194.16:8080/system/course/list`

## 3. 数据库初始化
Docker Compose 启动时会自动执行 `db-init.sql` 脚本，初始化 `auth_db`、`course_db` 和 `ai_db` 数据库及其测试数据。
