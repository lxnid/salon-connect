import { Router } from 'express'
import { register, login, getProfile } from '../controllers/auth'
import { authenticate } from '../middleware/auth'
import { validateRegister, validateLogin } from '../middleware/validation'

const router = Router()

// POST /api/auth/register
router.post('/register', validateRegister, register)

// POST /api/auth/login
router.post('/login', validateLogin, login)

// GET /api/auth/profile
router.get('/profile', authenticate, getProfile)

export default router