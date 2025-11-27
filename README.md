# NestJS Auth + RBAC + PostgreSQL Project

This is a full-featured NestJS project with:

- User authentication (register/login)
- JWT-based authorization
- Role-based access control (RBAC) support
- PostgreSQL as database
- TypeORM for ORM
- Swagger for API documentation
- Auto-create database and tables

---

## **Project Structure**

src/
├── auth/
│ ├── auth.controller.ts
│ ├── auth.service.ts
│ ├── dto/
│ │ ├── login.dto.ts
│ │ └── register.dto.ts
│ └── entities/
│ └── auth.entity.ts
├── user/
│ ├── user.controller.ts
│ ├── user.service.ts
│ ├── dto/
│ │ └── create-user.dto.ts
│ └── entities/
│ └── user.entity.ts
├── post/
│ ├── post.controller.ts
│ ├── post.service.ts
│ ├── dto/
│ │ ├── create-post.dto.ts
│ │ └── update-post.dto.ts
│ └── entities/
│ └── post.entity.ts
├── config/
│ ├── create-database.ts
│ └── typeorm.config.ts
├── app.module.ts
└── main.ts
