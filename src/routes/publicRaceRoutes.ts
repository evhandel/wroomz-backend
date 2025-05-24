import { Router } from "express";
import type { Request, Response } from "express";
import { RaceController } from "../controllers/RaceController";

const router = Router();

// Get all races (public)
router.get("/", async (req: Request, res: Response) => {
  await RaceController.getAllRaces(req, res);
});

// Get race by id (public)
router.get("/:id", async (req: Request, res: Response) => {
  await RaceController.getRaceById(req, res);
});

export default router;
