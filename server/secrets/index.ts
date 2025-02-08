import dotenv from "dotenv";

export const generateSecrets = () => {
  dotenv.config();
  return {
    PORT: process.env.PORT,
    JWT_SECRET: process.env.JWT_SECRET,
  };
};

export const SECRETS = generateSecrets();
