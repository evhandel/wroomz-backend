import { DataSource } from "typeorm"
import dotenv from 'dotenv'

dotenv.config()

export const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT || "5432"),
    username: process.env.DB_USERNAME || "postgres",
    password: process.env.DB_PASSWORD || "postgres",
    database: process.env.DB_NAME || "wroomz",
    synchronize: false,
    logging: true,
    entities: ["src/models/**/*.ts"],
    subscribers: [],
    migrations: ["src/migrations/**/*.ts"],
    migrationsTableName: "migrations"
}) 