import { Response } from 'express'
import { prisma } from '../lib/prisma'
import { AuthenticatedRequest } from '../middleware/auth'

export const createBooking = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Authentication required' })

    const { salonId, stylistId, serviceIds, datetime, notes } = req.body as {
      salonId: string
      stylistId: string
      serviceIds: string[]
      datetime: string
      notes?: string
    }

    if (!salonId || !stylistId || !Array.isArray(serviceIds) || serviceIds.length === 0 || !datetime) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    // Verify stylist belongs to salon
    const stylist = await prisma.stylist.findFirst({ where: { id: stylistId, salonId, isActive: true } })
    if (!stylist) return res.status(400).json({ error: 'Invalid stylist for this salon' })

    // Fetch services and ensure they belong to salon
    const services = await prisma.service.findMany({
      where: { id: { in: serviceIds }, salonId, isActive: true },
      select: { id: true, name: true, duration: true, price: true }
    })
    if (services.length !== serviceIds.length) {
      return res.status(400).json({ error: 'Some selected services are invalid for this salon' })
    }

    const totalPrice = services.reduce((sum, s) => sum + s.price, 0)

    const booking = await prisma.booking.create({
      data: {
        datetime: new Date(datetime),
        totalPrice,
        notes,
        customerId: req.user.id,
        salonId,
        stylistId,
        bookingServices: {
          create: services.map(s => ({ serviceId: s.id }))
        }
      },
      include: {
        salon: { select: { id: true, name: true, address: true, phone: true } },
        stylist: { select: { id: true, user: { select: { firstName: true, lastName: true } } } },
        bookingServices: { include: { service: { select: { id: true, name: true, duration: true, price: true } } } }
      }
    })

    return res.status(201).json({
      success: true,
      data: {
        id: booking.id,
        datetime: booking.datetime.toISOString(),
        totalPrice: booking.totalPrice,
        status: booking.status,
        notes: booking.notes || undefined,
        salon: booking.salon,
        stylist: booking.stylist,
        services: booking.bookingServices.map(bs => bs.service),
        createdAt: booking.createdAt.toISOString()
      }
    })
  } catch (error) {
    console.error('Create booking error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

export const getMyBookings = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Authentication required' })
    const bookings = await prisma.booking.findMany({
      where: { customerId: req.user.id },
      orderBy: { createdAt: 'desc' },
      include: {
        salon: { select: { id: true, name: true, address: true, phone: true } },
        stylist: { select: { id: true, user: { select: { firstName: true, lastName: true } } } },
        bookingServices: { include: { service: { select: { id: true, name: true, duration: true, price: true } } } }
      }
    })

    return res.json({
      success: true,
      data: bookings.map(b => ({
        id: b.id,
        datetime: b.datetime.toISOString(),
        totalPrice: b.totalPrice,
        status: b.status,
        notes: b.notes || undefined,
        salon: b.salon,
        stylist: b.stylist,
        services: b.bookingServices.map(bs => bs.service),
        createdAt: b.createdAt.toISOString()
      }))
    })
  } catch (error) {
    console.error('Get my bookings error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

export const getBooking = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Authentication required' })
    const { id } = req.params as { id: string }

    const booking = await prisma.booking.findFirst({
      where: { id, customerId: req.user.id },
      include: {
        salon: { select: { id: true, name: true, address: true, phone: true } },
        stylist: { select: { id: true, user: { select: { firstName: true, lastName: true } } } },
        bookingServices: { include: { service: { select: { id: true, name: true, duration: true, price: true } } } }
      }
    })

    if (!booking) return res.status(404).json({ error: 'Booking not found' })

    return res.json({
      success: true,
      data: {
        id: booking.id,
        datetime: booking.datetime.toISOString(),
        totalPrice: booking.totalPrice,
        status: booking.status,
        notes: booking.notes || undefined,
        salon: booking.salon,
        stylist: booking.stylist,
        services: booking.bookingServices.map(bs => bs.service),
        createdAt: booking.createdAt.toISOString()
      }
    })
  } catch (error) {
    console.error('Get booking error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}