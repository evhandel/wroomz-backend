import { DataSource } from "typeorm";
import dotenv from "dotenv";
import path from "path";

dotenv.config();

// Determine if we're in production or development
const isProd = process.env.NODE_ENV === "production";

// Set the correct paths based on environment
const entitiesPath = isProd
  ? [path.join(__dirname, "..", "models", "**", "*.js")]
  : ["src/models/**/*.ts"];

const migrationsPath = isProd
  ? [path.join(__dirname, "..", "migrations", "**", "*.js")]
  : ["src/migrations/**/*.ts"];

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "5432"),
  username: process.env.DB_USERNAME || "postgres",
  password: process.env.DB_PASSWORD || "postgres",
  database: process.env.DB_NAME || "wroomz",
  synchronize: false,
  logging: true,
  entities: entitiesPath,
  subscribers: [],
  migrations: migrationsPath,
  migrationsTableName: "migrations",
});
