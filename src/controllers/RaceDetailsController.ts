import { Request, Response } from 'express'
import { AppDataSource } from '../config/database'
import { RaceDetails } from '../models/RaceDetails'

const raceDetailsRepository = AppDataSource.getRepository(RaceDetails)

export class RaceDetailsController {
    // Get all race details
    static async getAllRaceDetails(req: Request, res: Response) {
        try {
            const raceDetails = await raceDetailsRepository.find({
                relations: ['race']
            })
            return res.json(raceDetails)
        } catch (error) {
            return res.status(500).json({ message: 'Error fetching race details' })
        }
    }

    // Get race details by id
    static async getRaceDetailsById(req: Request, res: Response) {
        try {
            const { id } = req.params
            const raceDetails = await raceDetailsRepository.findOne({
                where: { id: parseInt(id) },
                relations: ['race']
            })

            if (!raceDetails) {
                return res.status(404).json({ message: 'Race details not found' })
            }

            return res.json(raceDetails)
        } catch (error) {
            return res.status(500).json({ message: 'Error fetching race details' })
        }
    }

    // Create new race details
    static async createRaceDetails(req: Request, res: Response) {
        try {
            const raceDetails = new RaceDetails()
            Object.assign(raceDetails, req.body)

            await raceDetailsRepository.save(raceDetails)
            return res.status(201).json(raceDetails)
        } catch (error) {
            return res.status(400).json({ message: 'Error creating race details' })
        }
    }

    // Update race details
    static async updateRaceDetails(req: Request, res: Response) {
        try {
            const { id } = req.params
            const raceDetails = await raceDetailsRepository.findOne({
                where: { id: parseInt(id) }
            })

            if (!raceDetails) {
                return res.status(404).json({ message: 'Race details not found' })
            }

            Object.assign(raceDetails, req.body)
            await raceDetailsRepository.save(raceDetails)

            return res.json(raceDetails)
        } catch (error) {
            return res.status(400).json({ message: 'Error updating race details' })
        }
    }

    // Delete race details
    static async deleteRaceDetails(req: Request, res: Response) {
        try {
            const { id } = req.params
            const raceDetails = await raceDetailsRepository.findOne({
                where: { id: parseInt(id) }
            })

            if (!raceDetails) {
                return res.status(404).json({ message: 'Race details not found' })
            }

            await raceDetailsRepository.remove(raceDetails)
            return res.status(204).send()
        } catch (error) {
            return res.status(500).json({ message: 'Error deleting race details' })
        }
    }
} 