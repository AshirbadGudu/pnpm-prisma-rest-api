import { generateFile } from "./generators/index.js";

const resourceName = process.argv[2];
if (!resourceName) {
  console.error("Please provide a resource name");
  process.exit(1);
}

generateFile("route", resourceName);
