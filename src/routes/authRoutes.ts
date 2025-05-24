import { Router } from "express";
import type { Request, Response } from "express";
import { AuthController } from "../controllers/AuthController";

const router = Router();

// Регистрация нового пользователя
router.post("/register", async (req: Request, res: Response) => {
  await AuthController.register(req, res);
});

// Вход пользователя
router.post("/login", async (req: Request, res: Response) => {
  await AuthController.login(req, res);
});

export default router;
