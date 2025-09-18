import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// Security middleware
app.use(helmet())
const allowedOrigins = (process.env.ALLOWED_ORIGINS ||
  (process.env.NODE_ENV === 'production'
    ? 'https://salon-connect-web.onrender.com'
    : 'http://localhost:3000,http://localhost:3001'
  )
).split(',').map(o => o.trim())

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}))

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
})
app.use('/api/', limiter)

// Body parsing middleware
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  })
})

// Import routes
import authRoutes from './routes/auth'
import salonRoutes from './routes/salons'
import bookingRoutes from './routes/bookings'

// API routes
app.use('/api/auth', authRoutes)
app.use('/api/salons', salonRoutes)
app.use('/api/bookings', bookingRoutes)

app.get('/api', (req, res) => {
  res.json({
    message: 'SalonConnect API is running!',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      auth: '/api/auth/*',
      salons: '/api/salons/*',
      bookings: '/api/bookings/*',
      users: '/api/users/*'
    }
  })
})

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' })
})

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err)
  res.status(500).json({ 
    error: 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { message: err.message })
  })
})

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
  console.log(`📊 Health check: http://localhost:${PORT}/health`)
  console.log(`📡 API endpoint: http://localhost:${PORT}/api`)
})