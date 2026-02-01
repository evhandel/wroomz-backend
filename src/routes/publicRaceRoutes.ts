import { Router } from "express";
import type { Request, Response } from "express";
import { RaceController } from "../controllers/RaceController";
import { optionalAuthMiddleware } from "../middleware/authMiddleware";

const router = Router();

// Опциональная авторизация для всех роутов - если авторизован, показываем все гонки
router.use(optionalAuthMiddleware);

// Get all races
router.get("/", async (req: Request, res: Response) => {
  await RaceController.getAllRaces(req, res);
});

// Get race by id
router.get("/:id", async (req: Request, res: Response) => {
  await RaceController.getRaceById(req, res);
});

export default router;
