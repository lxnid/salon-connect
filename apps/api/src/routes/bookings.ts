import { Router, Request, Response } from 'express'
import { authenticate } from '../middleware/auth'
import { validateBookingCreate } from '../middleware/validation'
import { createBooking, getMyBookings, getBooking } from '../controllers/bookings'
import { validationResult } from 'express-validator'

const router = Router()

// Create a booking (authenticated)
router.post('/', authenticate, validateBookingCreate, (req: Request, res: Response) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }
  return createBooking(req as any, res)
})

// Get current user's bookings (authenticated)
router.get('/me', authenticate, (req: Request, res: Response) => getMyBookings(req as any, res))

// Get a single booking by id (only if belongs to current user)
router.get('/:id', authenticate, (req: Request, res: Response) => getBooking(req as any, res))

export default router