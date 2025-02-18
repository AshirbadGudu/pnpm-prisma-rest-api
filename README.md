# Prisma REST API with TypeScript

A modern, type-safe REST API built with Node.js, Express, Prisma, and TypeScript, featuring JWT authentication and role-based access control.

## 🌟 Features

- **Type-safe ORM**: Powered by Prisma
- **Authentication**: JWT-based auth with refresh tokens
- **Authorization**: Role-based access control (Admin, Editor, Viewer)
- **Real-time Notifications**: User notification system
- **API Documentation**: REST API endpoints documentation
- **Code Generation**: Built-in scripts for generating controllers, services, and routes
- **Testing**: REST client files for API testing

## 📁 Project Structure

```
.
├── docs/                      # Documentation files
│   ├── prisma-setup.md       # Prisma setup guide
│   └── route-setup.md        # Route setup guide
├── prisma/                   # Prisma configuration and migrations
│   ├── migrations/          # Database migrations
│   ├── schema.prisma        # Prisma schema
│   └── seed.ts             # Database seeding script
├── scripts/                  # Code generation scripts
│   ├── generators/         # Generator utilities
│   ├── make-controller.ts  # Controller generator
│   ├── make-resource.ts   # Resource generator
│   ├── make-route.ts      # Route generator
│   ├── make-schema.ts     # Schema generator
│   └── make-service.ts    # Service generator
├── server/                   # Server source code
│   ├── controllers/        # Request handlers
│   ├── middleware/        # Express middleware
│   ├── routes/           # API routes
│   ├── schemas/          # Validation schemas
│   ├── services/         # Business logic
│   └── utils/            # Utility functions
└── test/                     # API test files
    ├── auth.rest           # Authentication tests
    ├── healths.rest        # Health check tests
    ├── notifications.rest  # Notification tests
    └── users.rest          # User management tests
```

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Language**: TypeScript
- **Framework**: Express.js
- **ORM**: Prisma
- **Database**: SQLite (development) / PostgreSQL (production)
- **Package Manager**: pnpm
- **Authentication**: JWT (jsonwebtoken)
- **Validation**: Zod
- **Development**: Nodemon, esbuild

## 🚀 Getting Started

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd pnpm-prisma-rest-api
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Initialize the database**

   ```bash
   pnpm prisma migrate dev
   pnpm prisma generate
   ```

5. **Seed the database**

   ```bash
   pnpm prisma:seed
   ```

6. **Start the development server**
   ```bash
   pnpm dev
   ```

## 🔑 Default Users

After seeding, the following users are available:

### Admin Users

- admin@example.com (password: admin@123)
- superadmin@example.com (password: admin@123)
- systemadmin@example.com (password: admin@123)

### Editor Users

- editor@example.com (password: editor@123)
- contenteditor@example.com (password: editor@123)
- newseditor@example.com (password: editor@123)
- techeditor@example.com (password: editor@123)
- senioreditor@example.com (password: editor@123)

### Viewer Users

- viewer@example.com (password: viewer@123)
- user1@example.com (password: viewer@123)
- user2@example.com (password: viewer@123)
- reader@example.com (password: viewer@123)
- subscriber@example.com (password: viewer@123)
- guest@example.com (password: viewer@123)

## 📚 API Documentation

### Authentication Endpoints

- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - User logout

### User Endpoints

- `GET /api/users` - List users (Admin only)
- `GET /api/users/:id` - Get user details
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user (Admin only)

### Notification Endpoints

- `GET /api/notifications` - List user notifications
- `GET /api/notifications/:id` - Get notification details
- `PUT /api/notifications/:id` - Update notification
- `DELETE /api/notifications/:id` - Delete notification

## 🛠️ Development Tools

### Code Generation

Generate new components using the built-in scripts:

```bash
# Generate a new controller
pnpm make:controller UserController

# Generate a new service
pnpm make:service UserService

# Generate a new route
pnpm make:route UserRoute

# Generate a new schema
pnpm make:schema UserSchema
```

### Testing

Use the REST client files in the `test` directory to test API endpoints:

1. Install the REST Client extension for VS Code
2. Open any `.rest` file in the `test` directory
3. Click "Send Request" above each request to test

## 🤝 Contributing

1. Fork the repository
2. Create a new branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add some amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

### Development Guidelines

- Follow the existing code style
- Add appropriate comments and documentation
- Write tests for new features
- Update the README if needed

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Prisma](https://www.prisma.io/) - Next-generation ORM
- [Express.js](https://expressjs.com/) - Web framework
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [JWT](https://jwt.io/) - Authentication
