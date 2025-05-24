import { Router } from "express";
import type { Request, Response } from "express";
import { RaceDetailsController } from "../controllers/RaceDetailsController";
import { validationMiddleware } from "../middleware/validationMiddleware";
import { RaceDetailsDto } from "../dtos/RaceDetailsDto";

const router = Router();

// Create race details (private)
router.post(
  "/",
  validationMiddleware(RaceDetailsDto),
  async (req: Request, res: Response) => {
    await RaceDetailsController.createRaceDetails(req, res);
  }
);

// Update race details (private)
router.put(
  "/:id",
  validationMiddleware(RaceDetailsDto),
  async (req: Request, res: Response) => {
    await RaceDetailsController.updateRaceDetails(req, res);
  }
);

// Delete race details (private)
router.delete("/:id", async (req: Request, res: Response) => {
  await RaceDetailsController.deleteRaceDetails(req, res);
});

export default router;
