import { generateFile } from "./generators";

const resourceName = process.argv[2];
if (!resourceName) {
  console.error("Please provide a resource name");
  process.exit(1);
}

generateFile("schema", resourceName);
