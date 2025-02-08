import express from "express";
import { setupRoutes } from "./middleware/routes.middleware";
import { SECRETS } from "./secrets";

const app = express();

// Initialize the server asynchronously
const initServer = async () => {
  try {
    console.log("Setting up routes...");
    // Setup Routes (includes error handling)
    await setupRoutes(app);
    console.log("Routes setup complete!");

    app.listen(SECRETS.PORT, () => {
      console.log(`http://localhost:${SECRETS.PORT}`);
    });
  } catch (error) {
    console.error("Failed to initialize server:", error);
    process.exit(1);
  }
};

// Start the server
initServer();

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.error("UNHANDLED REJECTION! 💥 Shutting down...");
  console.error(err);
  process.exit(1);
});
