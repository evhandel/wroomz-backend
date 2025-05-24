import { Router } from "express";
import type { Request, Response } from "express";
import { RaceController } from "../controllers/RaceController";
import { validationMiddleware } from "../middleware/validationMiddleware";
import { CreateRaceDto, UpdateRaceDto } from "../dtos/RaceDto";

const router = Router();

// Create new race (private)
router.post(
  "/",
  validationMiddleware(CreateRaceDto),
  async (req: Request, res: Response) => {
    await RaceController.createRace(req, res);
  }
);

// Update race (private)
router.put(
  "/:id",
  validationMiddleware(UpdateRaceDto),
  async (req: Request, res: Response) => {
    await RaceController.updateRace(req, res);
  }
);

// Delete race (private)
router.delete("/:id", async (req: Request, res: Response) => {
  await RaceController.deleteRace(req, res);
});

export default router;
