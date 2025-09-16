import { Request, Response } from 'express'
import { validationResult } from 'express-validator'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { prisma } from '../lib/prisma'
import { LoginRequest, RegisterRequest, AuthResponse } from '../types'

const DEMO_MODE = process.env.USE_DEMO_AUTH === 'true' || process.env.NODE_ENV !== 'production'

const generateToken = (user: { id: string; email: string; role: string }) => {
  const secret = process.env.JWT_SECRET || 'dev-secret'
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    secret,
    { expiresIn: (process.env.JWT_EXPIRES_IN as jwt.SignOptions['expiresIn']) || '7d' }
  )
}

export const register = async (req: Request<{}, {}, RegisterRequest>, res: Response) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { email, password, firstName, lastName } = req.body

    // Force default role assignment for public signup
    const role: 'CUSTOMER' = 'CUSTOMER'

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return res.status(400).json({ error: 'User already exists with this email' })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role: role as any,
        firstName,
        lastName,
        phone: (req.body as any)?.phone
      },
      select: {
        id: true,
        email: true,
        role: true,
        firstName: true,
        lastName: true
      }
    })

    // Generate token
    const token = generateToken(user)

    const response: AuthResponse = {
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        firstName: user.firstName || undefined,
        lastName: user.lastName || undefined
      },
      token
    }

    res.status(201).json({
      success: true,
      data: response,
      message: 'User registered successfully'
    })
  } catch (error) {
    console.error('Registration error:', error)

    if (DEMO_MODE) {
      try {
        const { email, firstName, lastName, role = 'CUSTOMER' } = (req.body || {}) as RegisterRequest
        const user = {
          id: `demo-${Date.now()}`,
          email,
          role: role as string,
          firstName,
          lastName
        }
        const token = generateToken(user as any)
        const response: AuthResponse = {
          user: {
            id: user.id,
            email: user.email,
            role: user.role,
            firstName: user.firstName || undefined,
            lastName: user.lastName || undefined
          },
          token
        }
        return res.status(201).json({
          success: true,
          data: response,
          message: 'User registered successfully (demo mode: no database)'
        })
      } catch (e) {
        // fallthrough to 500
      }
    }

    res.status(500).json({ error: 'Internal server error' })
  }
}

export const login = async (req: Request<{}, {}, LoginRequest>, res: Response) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { email, password } = req.body

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        password: true,
        role: true,
        firstName: true,
        lastName: true
      }
    })

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' })
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid email or password' })
    }

    // Generate token
    const token = generateToken(user)

    const response: AuthResponse = {
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        firstName: user.firstName || undefined,
        lastName: user.lastName || undefined
      },
      token
    }

    res.json({
      success: true,
      data: response,
      message: 'Login successful'
    })
  } catch (error) {
    console.error('Login error:', error)

    if (DEMO_MODE) {
      try {
        const { email } = (req.body || {}) as LoginRequest
        const user = {
          id: 'demo-user',
          email: email || 'demo@salonconnect.local',
          role: 'CUSTOMER',
          firstName: 'Demo',
          lastName: 'User'
        }
        const token = generateToken(user)
        const response: AuthResponse = {
          user: {
            id: user.id,
            email: user.email,
            role: user.role,
            firstName: user.firstName,
            lastName: user.lastName
          },
          token
        }
        return res.json({
          success: true,
          data: response,
          message: 'Login successful (demo mode)'
        })
      } catch (e) {
        // fallthrough
      }
    }

    res.status(500).json({ error: 'Internal server error' })
  }
}

export const getProfile = async (req: any, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        email: true,
        role: true,
        firstName: true,
        lastName: true,
        phone: true,
        avatar: true,
        createdAt: true
      }
    })

    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    res.json({
      success: true,
      data: user
    })
  } catch (error) {
    console.error('Get profile error:', error)

    if (DEMO_MODE && req.user) {
      return res.json({
        success: true,
        data: {
          id: req.user.id,
          email: req.user.email,
          role: req.user.role,
          firstName: 'Demo',
          lastName: 'User',
          phone: undefined,
          avatar: undefined,
          createdAt: new Date().toISOString()
        }
      })
    }

    res.status(500).json({ error: 'Internal server error' })
  }
}