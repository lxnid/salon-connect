import { Router } from 'express'
import { getSalons, getSalonById } from '../controllers/salons'

const router = Router()

// GET /api/salons - Search salons
router.get('/', getSalons)

// GET /api/salons/:id - Get salon by ID
router.get('/:id', getSalonById)

export default router