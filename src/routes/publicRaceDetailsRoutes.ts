import { Router } from "express";
import type { Request, Response } from "express";
import { RaceDetailsController } from "../controllers/RaceDetailsController";

const router = Router();

// Get race details by id (public)
router.get("/:id", async (req: Request, res: Response) => {
  await RaceDetailsController.getRaceDetailsById(req, res);
});

export default router;
