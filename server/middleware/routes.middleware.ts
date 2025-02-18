import express, { Express } from "express";
import { readdirSync } from "fs";
import { join } from "path";
import { errorHandler, notFoundMiddleware } from "./error.middleware";
import { setupMiddleware } from "./setup.middleware";

export const setupRoutes = async (app: Express) => {
  const routesPath = join(__dirname, "../routes");
  console.log("Routes directory:", routesPath);

  try {
    // Setup basic middleware first
    setupMiddleware(app);
    console.log("Basic middleware setup complete");

    // Read all files from routes directory
    const routeFiles = readdirSync(routesPath).filter((file) =>
      file.endsWith(".route.js")
    );
    console.log("Found route files:", routeFiles);

    // Dynamically import and setup each route
    for (const file of routeFiles) {
      try {
        // Convert filename to route path
        const routeName = file.replace(".route.js", "");
        const routePath = `/api/v1/${routeName}`;
        console.log(`Setting up route: ${routePath} from file: ${file}`);

        // Dynamic import of route module
        const routeModule = require(join(routesPath, file));
        const router = routeModule.default || routeModule;

        // Register the route
        app.use(routePath, router);
        console.log(`✅ Route registered: ${routePath}`);
      } catch (error) {
        console.error(`❌ Error loading route ${file}:`, error);
      }
    }

    // Add error handling middleware after all routes
    app.use(notFoundMiddleware);
    app.use(errorHandler);
    console.log("Error handling middleware setup complete");
  } catch (error) {
    console.error("Error setting up routes:", error);
    throw error;
  }
};
