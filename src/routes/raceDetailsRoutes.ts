import { Router } from 'express'
import type { Request, Response } from 'express'
import { RaceDetailsController } from '../controllers/RaceDetailsController'

const router = Router()

// Get all race details
router.get('/', async (req: Request, res: Response) => {
    await RaceDetailsController.getAllRaceDetails(req, res)
})

// Get race details by id
router.get('/:id', async (req: Request, res: Response) => {
    await RaceDetailsController.getRaceDetailsById(req, res)
})

// Create new race details
router.post('/', async (req: Request, res: Response) => {
    await RaceDetailsController.createRaceDetails(req, res)
})

// Update race details
router.put('/:id', async (req: Request, res: Response) => {
    await RaceDetailsController.updateRaceDetails(req, res)
})

// Delete race details
router.delete('/:id', async (req: Request, res: Response) => {
    await RaceDetailsController.deleteRaceDetails(req, res)
})

export default router 