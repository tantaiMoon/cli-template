# Moyi Backend Project

## 项目概述

基于 NestJS 构建的现代化后端服务，提供用户管理、角色权限控制、多数据库支持等功能。项目采用模块化架构设计，支持 Docker
容器化部署，整合了 Prisma ORM、Redis 缓存、邮件服务等常用组件。

## 技术栈

- **核心框架**: NestJS 11.x
- **数据库**:
    - MySQL 8.0 / PostgreSQL（通过环境变量切换）
    - Prisma 5.x（多数据库 ORM）
- **缓存**: Redis (bitnami/redis)
- **容器化**:
    - Docker + Docker Compose
    - 多环境配置（开发/生产）
- **工具链**:
    - pnpm 8.x
    - Swagger 文档
    - ESLint + Prettier

## 项目结构

```
. 
├── .dockerignore  # 用于 Docker 构建的忽略文件列表
├── .env.development  # 开发环境变量配置文件
├── .env.local  # 本地环境变量配置文件
├── .env.production # 生产环境变量配置文件
├── .gitignore # Git 忽略文件列表
├── .prettierrc # Prettier 配置文件
├── .swcrc # SWC 配置文件
├── Dockerfile # Docker 构建文件 
├── README.md # 项目文档
├── docker-compose.dev.yml # 开发环境 Docker Compose 文件
├── docker-compose.yml # 生产环境 Docker Compose 文件
├── eslint.config.mjs # ESLint 配置文件
├── mysql-init.sql # MySQL 初始化脚本
├── nest-cli.json # NestJS CLI 配置文件
├── package.json # Node.js 依赖管理文件
├── pg-initial.sql # PostgreSQL 初始化脚本
├── prisma/ # Prisma 配置目录
│ └── schema.prisma # Prisma 数据模型定义文件
├── src/ 
│ ├── access-control/ # 权限控制模块
│ ├── app.controller.ts # 应用主控制器
│ ├── app.module.ts # 应用主模块
│ ├── common/ # 通用模块
│ ├── conditional/ # 第三方模块
│ ├── config/ # 配置w文件夹
│ ├── database/ # 数据库模块
│ ├── global.d.ts 
│ ├── i18n/ # 国际化
│ ├── main.ts # 主应用入口
│ ├── modules/ # 模块管理
│ ├── user/ # 用户模块
│ └── utils/ # 工具函数
├── test/ 
│ ├── app.e2e-spec.ts 
│ └── jest-e2e.json 
├── tsconfig.build.json 
└── tsconfig.json
```


## 环境配置

### 开发环境

在 `.env.development` 文件中配置开发环境变量：

```plaintext
JWT_EXPIRES=7d
JWT_EXPIRES_REFRESH=30d
################# DB
DATABASE_TYPE=postgres
DATABASE_HOST=localhost
DATABASE_PORT=5431
DATABASE_USER=pguser
DATABASE_PASSWORD=example
DATABASE_NAME=moyi-be-p
DATABASE_URL="postgresql://pguser:example@localhost:5431/moyi-be-p?schema=public"
```
### 生产环境
在 `.env.production` 文件中配置生产环境变量：
```plaintext
JWT_EXPIRES=7d
JWT_EXPIRES_REFRESH=30d
################# DB
DATABASE_TYPE=postgres
DATABASE_HOST=localhost
DATABASE_PORT=5431
DATABASE_USER=pguser
DATABASE_PASSWORD=example
DATABASE_NAME=moyi-be-p
DATABASE_URL="postgresql://pguser:example@localhost:5431/moyi-be-p?schema=public"
```

## 技术栈

- **框架**: NestJS
- **数据库**: MySQL 8.0, PostgreSQL
- **ORM**: Prisma
- **容器化**: Docker, Docker Compose
- **依赖管理**: pnpm

## 权限控制体系

本系统采用 **RBAC 角色权限模型** 与 **策略控制** 相结合的权限管理方案：

1. **核心机制**

- 三级权限控制：`用户 -> 角色 -> 权限`
- 策略(Policy)系统支持细粒度资源控制（如 `article:create`）
- 多守卫验证流程：JWT鉴权 → 管理员验证 → 权限策略验证

2. **主要特性**

- 动态权限配置：通过数据库管理角色权限关系
- 白名单机制：支持配置特权角色绕过常规验证
- 多租户支持：通过请求头 `x-tenant-id` 实现租户隔离
- CASL 集成：实现基于属性的资源级访问控制

3. **技术实现**

- 守卫层：`RolePermissionGuard` + `AdminGuard` + `JwtGuard` 组合验证
- 策略管理：独立 Policy 模块实现权限策略的 CRUD
- 权限元数据：通过装饰器 `@Permission('user:create')` 声明接口权限

工作流程:

- 请求到达
- JWTGuard 验证令牌有效性
- AdminGuard 验证管理员身份
- RolePermissionGuard 执行：
- 解析 @Permission 元数据
- 查询用户角色关联权限
- 验证权限组合 (资源:操作)
- PolicyService 检查资源级策略
- 授予/拒绝访问



## 安装依赖
```bash
# 安装依赖
pnpm install

# 生成 Prisma 客户端
pnpm run build:prisma

# 运行数据库迁移
pnpm run migrate

# 启动开发服务器
pnpm start:dev
```

## Docker 部署
```bash
# 生产环境
docker-compose up -d

# 开发环境 
docker-compose -f docker-compose.dev.yml up -d
```

包含服务：
- MySQL 8.0 集群（3306/3307）
- PostgreSQL 集群（5432/5431） 
- Redis 缓存服务 
- Adminer 数据库管理（8080 端口）
