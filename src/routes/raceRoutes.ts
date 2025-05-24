import { Router } from "express";
import type { Request, Response } from "express";
import { RaceController } from "../controllers/RaceController";
import { validationMiddleware } from "../middleware/validationMiddleware";
import { CreateRaceDto, UpdateRaceDto } from "../dtos/RaceDto";

const router = Router();

// Get all races
router.get("/", async (req: Request, res: Response) => {
  await RaceController.getAllRaces(req, res);
});

// Get race by id
router.get("/:id", async (req: Request, res: Response) => {
  await RaceController.getRaceById(req, res);
});

// Create new race
router.post(
  "/",
  validationMiddleware(CreateRaceDto),
  async (req: Request, res: Response) => {
    await RaceController.createRace(req, res);
  }
);

// Update race
router.put(
  "/:id",
  validationMiddleware(UpdateRaceDto),
  async (req: Request, res: Response) => {
    await RaceController.updateRace(req, res);
  }
);

// Delete race
router.delete("/:id", async (req: Request, res: Response) => {
  await RaceController.deleteRace(req, res);
});

export default router;
