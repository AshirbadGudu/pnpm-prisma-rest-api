# Route Setup Documentation

This document explains the automatic route setup mechanism used in our Express application.

## Overview

The route setup system automatically discovers and registers route files from the `server/routes` directory. It uses a convention-based approach where route files must follow a specific naming pattern and export an Express router.

## File Naming Convention

- Files must end with `.route.ts` (in source) or `.route.js` (after compilation)
- The base name of the file becomes the route path
- Example: `users.route.ts` becomes `/api/v1/users`

## Route Setup Process

### 1. Basic Setup

```typescript
const routesPath = join(__dirname, "../routes");
```

- Determines the absolute path to the routes directory
- Uses Node.js path utilities to handle cross-platform compatibility

### 2. Middleware Initialization

```typescript
setupMiddleware(app);
```

- Sets up basic Express middleware (cors, body-parser, etc.)
- Must run before route registration

### 3. Route Discovery

```typescript
const routeFiles = readdirSync(routesPath).filter((file) =>
  file.endsWith(".route.js")
);
```

- Reads all files from the routes directory
- Filters for files ending in `.route.js` (compiled TypeScript)
- Returns an array of matching filenames

### 4. Route Registration

For each discovered route file:

```typescript
// Convert filename to route path
const routeName = file.replace(".route.js", "");
const routePath = `/api/v1/${routeName}`;

// Import and register route
const routeModule = require(join(routesPath, file));
const router = routeModule.default || routeModule;
app.use(routePath, router);
```

#### Steps:

1. Extracts route name from filename
2. Constructs API path with version prefix
3. Imports route module using CommonJS require
4. Handles both default and named exports
5. Registers route with Express

### 5. Error Handling

```typescript
app.use(notFoundMiddleware);
app.use(errorHandler);
```

- Adds 404 handler for unmatched routes
- Adds global error handling middleware

## Route File Structure

Each route file should:

1. Import Express and create a router
2. Define routes using the router
3. Export the router as default

Example (`users.route.ts`):

```typescript
import express from "express";
import { userController } from "../controllers/user.controller";

const router = express.Router();

router.get("/", userController.getAll);
router.post("/", userController.create);
// ... other routes

export default router;
```

## API Path Structure

Routes follow this structure:

- Base: `/api`
- Version: `/v1`
- Resource: `/${routeName}`
- Full example: `/api/v1/users`

## Error Handling

The setup includes multiple layers of error handling:

1. Individual route import errors (caught per route)
2. Global route setup errors (caught in main try-catch)
3. 404 handling for unmatched routes
4. Global error handling middleware

## Best Practices

1. Always use the `.route.ts` extension for route files
2. Place route files directly in the routes directory
3. Use meaningful names that reflect the resource
4. Export the router as default export
5. Handle errors within route handlers

## Debugging

The setup includes detailed logging:

- Route directory location
- Discovered route files
- Each route registration
- Any errors during setup

## Common Issues

1. **Route Not Found**

   - Check file naming convention
   - Verify file is in correct directory
   - Check for compilation errors

2. **Middleware Function Error**

   - Ensure proper router export
   - Check for syntax errors
   - Verify middleware chain

3. **Import Errors**
   - Check file paths
   - Verify export/import syntax
   - Check for circular dependencies
