import { Request, Response } from "express";
import { AppDataSource } from "../config/database";
import { Race } from "../models/Race";
import { RaceDetails } from "../models/RaceDetails";

const raceRepository = AppDataSource.getRepository(Race);

export class RaceController {
  // Get all races
  static async getAllRaces(req: Request, res: Response) {
    try {
      const races = await raceRepository.find({
        relations: ["details"],
        order: {
          createdAt: "DESC", // Sort by creation date in descending order (newest first)
        },
      });
      return res.json(races);
    } catch (error) {
      return res.status(500).json({ message: "Error fetching races" });
    }
  }

  // Get race by id
  static async getRaceById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const race = await raceRepository.findOne({
        where: { id: parseInt(id) },
        relations: ["details"],
      });

      if (!race) {
        return res.status(404).json({ message: "Race not found" });
      }

      return res.json(race);
    } catch (error) {
      return res.status(500).json({ message: "Error fetching race" });
    }
  }

  // Create new race
  static async createRace(req: Request, res: Response) {
    // Create query runner to use transactions
    const queryRunner = AppDataSource.createQueryRunner();

    try {
      const { name, isPublished = false, details } = req.body;

      // Start a transaction
      await queryRunner.connect();
      await queryRunner.startTransaction();

      const raceRepository = queryRunner.manager.getRepository(Race);
      const raceDetailsRepository =
        queryRunner.manager.getRepository(RaceDetails);

      const race = new Race();
      race.name = name;
      race.isPublished = isPublished;

      // Save race first
      await raceRepository.save(race);

      if (details) {
        const raceDetails = new RaceDetails();
        raceDetails.race = race;
        Object.assign(raceDetails, details);

        // Save race details
        await raceDetailsRepository.save(raceDetails);
      }

      // Commit transaction
      await queryRunner.commitTransaction();

      // Fetch clean copy of the race with its details to avoid circular reference
      const savedRace = await AppDataSource.getRepository(Race).findOne({
        where: { id: race.id },
        relations: ["details"],
      });

      return res.status(201).json(savedRace);
    } catch (error) {
      console.error("Error creating race:", error);

      // Only attempt to rollback if transaction is active
      if (queryRunner.isTransactionActive) {
        await queryRunner.rollbackTransaction();
      }

      return res.status(400).json({ message: "Error creating race" });
    } finally {
      // Release query runner regardless of outcome
      await queryRunner.release();
    }
  }

  // Update race
  static async updateRace(req: Request, res: Response) {
    // Create query runner outside of try/catch to ensure it's accessible in all blocks
    const queryRunner = AppDataSource.createQueryRunner();

    try {
      const { id } = req.params;
      const { details, ...raceData } = req.body;

      // Start a transaction
      await queryRunner.connect();
      await queryRunner.startTransaction();

      const raceRepository = queryRunner.manager.getRepository(Race);
      const raceDetailsRepository =
        queryRunner.manager.getRepository(RaceDetails);

      const race = await raceRepository.findOne({
        where: { id: parseInt(id) },
        relations: ["details"],
      });

      if (!race) {
        // Don't try to rollback if we haven't started the transaction
        return res.status(404).json({ message: "Race not found" });
      }

      // Update race data
      Object.assign(race, raceData);

      // Update or create race details
      if (details) {
        if (!race.details) {
          // Create new details if they don't exist
          const raceDetails = new RaceDetails();
          raceDetails.race = race;
          Object.assign(raceDetails, details);

          // Save details first
          await raceDetailsRepository.save(raceDetails);
          race.details = raceDetails;
        } else {
          // Update existing details
          Object.assign(race.details, details);
          await raceDetailsRepository.save(race.details);
        }
      }

      // Save race
      await raceRepository.save(race);

      // Commit transaction
      await queryRunner.commitTransaction();

      return res.json(race);
    } catch (error) {
      console.error("Error updating race:", error);

      // Only attempt to rollback if transaction is active
      if (queryRunner.isTransactionActive) {
        await queryRunner.rollbackTransaction();
      }

      return res.status(400).json({ message: "Error updating race" });
    } finally {
      // Release query runner regardless of outcome
      await queryRunner.release();
    }
  }

  // Delete race
  static async deleteRace(req: Request, res: Response) {
    // Create query runner to use transactions
    const queryRunner = AppDataSource.createQueryRunner();

    try {
      const { id } = req.params;

      // Start a transaction
      await queryRunner.connect();
      await queryRunner.startTransaction();

      const raceRepository = queryRunner.manager.getRepository(Race);
      const raceDetailsRepository =
        queryRunner.manager.getRepository(RaceDetails);

      // Fetch the race with its details
      const race = await raceRepository.findOne({
        where: { id: parseInt(id) },
        relations: ["details"],
      });

      if (!race) {
        return res.status(404).json({ message: "Race not found" });
      }

      // First delete the race details if they exist
      if (race.details) {
        await raceDetailsRepository.remove(race.details);
      }

      // Then delete the race
      await raceRepository.remove(race);

      // Commit transaction
      await queryRunner.commitTransaction();

      return res.status(204).send();
    } catch (error) {
      console.error("Error deleting race:", error);

      // Rollback transaction on error
      if (queryRunner.isTransactionActive) {
        await queryRunner.rollbackTransaction();
      }

      return res.status(500).json({ message: "Error deleting race" });
    } finally {
      // Release query runner
      await queryRunner.release();
    }
  }
}
