# Node.js API with TypeScript, ESBuild, and Express

This project is a Node.js API built with TypeScript, using ESBuild for fast compilation and Express.js for the server framework.

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
# Install TypeScript
pnpm i -D typescript

# Install ESBuild and related tools
pnpm i -D esbuild
pnpm install esbuild-node-tsc nodemon -D
```

4. Create nodemon configuration file:

```bash
touch nodemon.json
```

5. Install main dependencies:

```bash
pnpm i express express-validator helmet dotenv bcryptjs cors nodemailer http-errors jsonwebtoken socket.io
```

6. Install TypeScript type definitions:

```bash
pnpm i -D @types/express @types/bcryptjs @types/cors @types/nodemailer @types/http-errors @types/jsonwebtoken
```

7. Create environment files:

```bash
touch .env .env.example
```

8. Initialize TypeScript configuration:

```bash
pnpm init:tsc
```

9. Create server directory and entry file:

```bash
mkdir server
touch server/index.ts
```

## Scripts

The following npm scripts are available:

- `pnpm start`: Start the production server
- `pnpm dev`: Start development server with hot-reload
- `pnpm build`: Build the TypeScript code
- `pnpm init:tsc`: Initialize TypeScript configuration

## Environment Variables

Copy `.env.example` to `.env` and fill in your environment variables:

```env
PORT=3000
NODE_ENV=development
JWT_SECRET=your_jwt_secret
API_PREFIX=api
API_VERSION=v1
```

## Project Structure

```
.
├── server/         # TypeScript source files
├── build/          # Compiled JavaScript files
├── .env            # Environment variables
├── .env.example    # Example environment variables
├── nodemon.json    # Nodemon configuration
└── tsconfig.json   # TypeScript configuration
```
