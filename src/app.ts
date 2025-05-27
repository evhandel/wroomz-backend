import "reflect-metadata";
import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import { AppDataSource } from "./config/database";
import userRoutes from "./routes/userRoutes";
import authRoutes from "./routes/authRoutes";
import publicRaceRoutes from "./routes/publicRaceRoutes";
import publicRaceDetailsRoutes from "./routes/publicRaceDetailsRoutes";
import privateRaceRoutes from "./routes/privateRaceRoutes";
import privateRaceDetailsRoutes from "./routes/privateRaceDetailsRoutes";
import { authMiddleware } from "./middleware/authMiddleware";

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

app.use(cors());

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    error: "Internal Server Error",
    message: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

// Публичные маршруты
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/public/races", publicRaceRoutes);
app.use("/api/public/race-details", publicRaceDetailsRoutes);

// Защищенные маршруты (требуют авторизации)
app.use("/api/races", authMiddleware, privateRaceRoutes);
app.use("/api/race-details", authMiddleware, privateRaceDetailsRoutes);

// Initialize database connection
AppDataSource.initialize()
  .then(() => {
    console.log("Data Source has been initialized!");

    // Start server
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error: Error) => {
    console.error("Error during Data Source initialization:", error);
  });
