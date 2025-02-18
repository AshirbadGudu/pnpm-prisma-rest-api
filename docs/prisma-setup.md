# Prisma Setup Documentation

This document outlines the setup and usage of Prisma in our REST API application.

## Overview

Prisma is our ORM (Object-Relational Mapping) tool that provides:

- Type-safe database access
- Auto-generated migrations
- Database schema management
- Intuitive data modeling
- Database GUI through Prisma Studio

## Initial Setup

### 1. Installation

```bash
# Install Prisma as a development dependency
pnpm add -D prisma

# Install Prisma Client
pnpm add @prisma/client
```

### 2. Project Initialization

```bash
# Initialize Prisma in your project
pnpm dlx prisma init
```

This creates:

- `prisma` directory
- `prisma/schema.prisma` file
- `.env` file with database connection string

## Database Configuration

### 1. Schema Definition

In `prisma/schema.prisma`:

```prisma
datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

// Define your models here
model User {
  id        String    @id @default(uuid())
  email     String    @unique
  password  String
  role      Role      @default(VIEWER)
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
  deletedAt DateTime?
}

enum Role {
  ADMIN
  EDITOR
  VIEWER
}
```

### 2. Environment Setup

In `.env`:

```env
DATABASE_URL="file:./dev.db"
```

## Migration Workflow

### 1. Generate Migration

```bash
# Create a new migration
pnpm prisma migrate dev --name <migration_name>
```

### 2. Apply Migrations

```bash
# Apply pending migrations
pnpm prisma migrate deploy
```

### 3. Reset Database

```bash
# Reset database and reapply all migrations
pnpm prisma migrate reset --force
```

## Client Generation

```bash
# Generate Prisma Client
pnpm prisma generate

# If you encounter cache issues
rm -rf node_modules/.prisma && pnpm prisma generate
```

## Database GUI

```bash
# Launch Prisma Studio
pnpm prisma studio
```

## Project Structure

```
project-root/
├── prisma/
│   ├── schema.prisma     # Database schema
│   ├── migrations/       # Migration files
│   ├── dev.db           # SQLite database (gitignored)
│   └── seed/            # Seed data scripts
├── src/
│   └── services/        # Database service files
└── .env                 # Environment variables
```

## Best Practices

### 1. Version Control

- Add `prisma/dev.db` to `.gitignore`
- Commit `schema.prisma` and migration files
- Keep `.env` out of version control

### 2. Migration Management

- Create meaningful migration names
- Review migration files before applying
- Test migrations in development first

### 3. Client Usage

```typescript
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Use in async functions
async function getUser(id: string) {
  return await prisma.user.findUnique({
    where: { id },
  });
}
```

### 4. Error Handling

```typescript
try {
  await prisma.user.create({
    data: {
      email: "user@example.com",
      password: hashedPassword,
    },
  });
} catch (error) {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    // Handle known Prisma errors
    if (error.code === "P2002") {
      throw new Error("Unique constraint violation");
    }
  }
  throw error;
}
```

## Common Issues

1. **Client Generation Issues**

   ```bash
   # Fix by regenerating client
   rm -rf node_modules/.prisma
   pnpm prisma generate
   ```

2. **Migration Conflicts**

   ```bash
   # Reset database (development only)
   pnpm prisma migrate reset --force
   ```

3. **Type Errors**
   - Regenerate client after schema changes
   - Update TypeScript types if needed

## Scripts Setup

Add these to `package.json`:

```json
{
  "scripts": {
    "prisma:generate": "prisma generate",
    "prisma:migrate": "prisma migrate dev",
    "prisma:deploy": "prisma migrate deploy",
    "prisma:studio": "prisma studio",
    "prisma:reset": "prisma migrate reset --force"
  }
}
```

## Security Considerations

1. **Password Handling**

   - Never store plain passwords
   - Use bcrypt or similar for hashing

2. **Environment Variables**

   - Keep database credentials in `.env`
   - Use different databases for development/production

3. **Data Access**
   - Implement role-based access control
   - Validate input data before queries

## Debugging

1. **Query Debugging**

   ```typescript
   const prisma = new PrismaClient({
     log: ["query", "info", "warn", "error"],
   });
   ```

2. **Migration Issues**
   - Check `prisma/migrations` directory
   - Verify database connection
   - Review migration history

## Maintenance

1. **Regular Updates**

   ```bash
   pnpm update @prisma/client prisma
   ```

2. **Database Backups**

   - Implement backup strategy
   - Test restore procedures

3. **Performance Monitoring**
   - Use Prisma's metrics
   - Monitor query performance
