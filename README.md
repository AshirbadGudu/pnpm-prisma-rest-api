# Node.js API with TypeScript, ESBuild, and Express

This project is a Node.js API built with TypeScript, using ESBuild for fast compilation and Express.js for the server framework.

## Features

- Fast compilation with ESBuild
- TypeScript support
- Express.js with proper routing
- Automatic route discovery and registration
- Environment configuration
- Error handling middleware
- Request validation with Zod
- JWT Authentication
- API versioning
- CORS support
- Helmet security
- Email support with Nodemailer
- WebSocket support with Socket.io

## Project Setup

Follow these steps to set up the project:

1. Initialize the project and create package.json:

```bash
pnpm init
```

2. Create .gitignore file for Node.js:

```bash
pnpm dlx gitignore node
```

3. Install TypeScript and build tools:

```bash
# Install TypeScript and ESBuild
pnpm i -D typescript esbuild esbuild-node-tsc nodemon
```

4. Create configuration files:

**tsconfig.json**:

```json
{
  "compilerOptions": {
    "target": "es2016",
    "module": "node16",
    "rootDir": "./",
    "outDir": "./build",
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "strict": true,
    "skipLibCheck": true,
    "moduleResolution": "node16"
  },
  "include": ["server/**/*", "scripts/**/*"]
}
```

**nodemon.json**:

```json
{
  "watch": ["server", "scripts"],
  "ignore": ["**/*.test.ts", "node_modules", "build", ".git", "**/*.spec.ts"],
  "ext": "ts,json",
  "exec": "etsc && node ./build/server/index.js"
}
```

5. Install main dependencies:

```bash
pnpm i express express-validator helmet dotenv bcryptjs cors nodemailer http-errors jsonwebtoken socket.io zod
```

6. Install TypeScript type definitions:

```bash
pnpm i -D @types/express @types/bcryptjs @types/cors @types/nodemailer @types/http-errors @types/jsonwebtoken
```

7. Create environment files:

```bash
touch .env .env.example
```

8. Create server directory and entry file:

```bash
mkdir server
touch server/index.ts
```

## Available Scripts

- `pnpm start`: Start the production server
- `pnpm dev`: Start development server with auto-reload
- `pnpm build`: Clean and build the TypeScript code
- `pnpm build:watch`: Watch mode for TypeScript compilation

### Resource Generation Scripts

- `pnpm make:resource <name>`: Generate a complete resource (controller, service, route, schema)
- `pnpm make:controller <name>`: Generate a controller
- `pnpm make:service <name>`: Generate a service
- `pnpm make:schema <name>`: Generate a schema
- `pnpm make:route <name>`: Generate a route

## Environment Variables

Copy `.env.example` to `.env` and fill in your environment variables:

```env
PORT=8025
NODE_ENV=development
JWT_SECRET=your_jwt_secret
API_PREFIX=api
API_VERSION=v1
```

## Project Structure

```
.
├── server/          # TypeScript source files
│   ├── controllers/ # Request handlers
│   ├── services/    # Business logic
│   ├── routes/      # API routes
│   ├── schemas/     # Validation schemas
│   ├── middleware/  # Express middleware
│   └── utils/       # Utility functions
├── scripts/         # Generator scripts
├── docs/           # Documentation
├── build/          # Compiled JavaScript
├── .env            # Environment variables
├── .env.example    # Example environment file
├── nodemon.json    # Nodemon configuration
└── tsconfig.json   # TypeScript configuration
```

## Documentation

- [Route Setup](docs/route-setup.md): Detailed documentation of the automatic route setup system

## Development

1. Install dependencies:

```bash
pnpm install
```

2. Start development server:

```bash
pnpm dev
```

The server will automatically reload when you make changes.

## Production

1. Build the project:

```bash
pnpm build
```

2. Start the production server:

```bash
pnpm start
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

ISC
