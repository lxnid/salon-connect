import { Request, Response } from 'express'
import { prisma } from '../lib/prisma'
import { SalonSearchParams, SalonWithDetails } from '../types'

// Calculate distance between two points using Haversine formula
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371 // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
  return R * c
}

export const getSalons = async (req: Request<{}, {}, {}, SalonSearchParams>, res: Response) => {
  try {
    const {
      query,
      latitude,
      longitude,
      radius = 10,
      category,
      minPrice,
      maxPrice,
      minRating = 0,
      sortBy = 'distance',
      page = 1,
      limit = 10
    } = req.query

    const skip = (Number(page) - 1) * Number(limit)

    // Build where clause
    let whereClause: any = {
      isActive: true
    }

    if (query) {
      whereClause.OR = [
        { name: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
        { services: { some: { name: { contains: query, mode: 'insensitive' } } } }
      ]
    }

    if (category) {
      whereClause.services = {
        some: {
          category: category
        }
      }
    }

    if (minPrice || maxPrice) {
      whereClause.services = {
        ...whereClause.services,
        some: {
          ...whereClause.services?.some,
          price: {
            ...(minPrice && { gte: Number(minPrice) }),
            ...(maxPrice && { lte: Number(maxPrice) })
          }
        }
      }
    }

    // Fetch salons with related data
    const salons = await prisma.salon.findMany({
      where: whereClause,
      include: {
        services: {
          where: { isActive: true },
          select: {
            id: true,
            name: true,
            category: true,
            duration: true,
            price: true
          }
        },
        stylists: {
          where: { isActive: true },
          select: {
            id: true,
            bio: true,
            experience: true,
            specialties: true,
            user: {
              select: {
                firstName: true,
                lastName: true,
                avatar: true
              }
            }
          }
        },
        reviews: {
          select: {
            rating: true
          }
        },
        _count: {
          select: {
            reviews: true
          }
        }
      },
      skip,
      take: Number(limit)
    })

    // Calculate ratings and distances
    const salonsWithDetails: SalonWithDetails[] = salons
      .map((salon: any) => {
        // Calculate average rating
        const totalRating = salon.reviews.reduce((sum: number, review: any) => sum + review.rating, 0)
        const rating = salon.reviews.length > 0 ? totalRating / salon.reviews.length : 0
        const reviewCount = salon._count.reviews

        // Calculate distance if coordinates provided
        let distance: number | undefined
        if (latitude && longitude && salon.latitude && salon.longitude) {
          distance = calculateDistance(
            Number(latitude),
            Number(longitude),
            salon.latitude,
            salon.longitude
          )
        }

        return {
          id: salon.id,
          name: salon.name,
          description: salon.description,
          address: salon.address,
          city: salon.city,
          state: salon.state,
          latitude: salon.latitude,
          longitude: salon.longitude,
          phone: salon.phone,
          images: salon.images,
          rating: Math.round(rating * 10) / 10, // Round to 1 decimal place
          reviewCount,
          distance: distance ? Math.round(distance * 10) / 10 : undefined,
          services: salon.services,
          stylists: salon.stylists,
          nextAvailable: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // Mock next available time
        }
      })
      .filter((salon: any) => {
        // Filter by distance if coordinates provided
        if (latitude && longitude && salon.distance !== undefined) {
          return salon.distance <= Number(radius)
        }
        return true
      })
      .filter((salon: any) => salon.rating >= Number(minRating))

    // Sort results
    salonsWithDetails.sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating
        case 'price':
          const avgPriceA = a.services.reduce((sum, s) => sum + s.price, 0) / a.services.length
          const avgPriceB = b.services.reduce((sum, s) => sum + s.price, 0) / b.services.length
          return avgPriceA - avgPriceB
        case 'name':
          return a.name.localeCompare(b.name)
        case 'distance':
        default:
          if (a.distance !== undefined && b.distance !== undefined) {
            return a.distance - b.distance
          }
          return a.name.localeCompare(b.name)
      }
    })

    res.json({
      success: true,
      data: {
        salons: salonsWithDetails,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total: salonsWithDetails.length
        }
      }
    })
  } catch (error) {
    console.error('Get salons error:', error)
    // Fallback: return demo data when DB is unavailable (e.g., local dev without Postgres)
    const demoSalons: SalonWithDetails[] = [
      {
        id: 'demo-1',
        name: 'Elite Hair Studio (Demo)',
        description: 'Professional hair studio - demo data',
        address: '123 Main Street',
        city: 'Downtown',
        state: 'CA',
        latitude: undefined as unknown as number,
        longitude: undefined as unknown as number,
        phone: '+1 (555) 123-4567',
        images: ['https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800'],
        rating: 4.8,
        reviewCount: 124,
        distance: undefined,
        services: [
          { id: 's1', name: "Women's Haircut", category: 'Haircut', duration: 60, price: 65 },
          { id: 's2', name: "Men's Haircut", category: 'Haircut', duration: 45, price: 35 },
        ],
        stylists: [],
        nextAvailable: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'demo-2',
        name: 'Urban Barber (Demo)',
        description: 'Modern barbershop - demo data',
        address: '456 Market Ave',
        city: 'Uptown',
        state: 'NY',
        latitude: undefined as unknown as number,
        longitude: undefined as unknown as number,
        phone: '+1 (555) 987-6543',
        images: ['https://images.unsplash.com/photo-1556228724-4a3aa6458a27?w=800'],
        rating: 4.5,
        reviewCount: 89,
        distance: undefined,
        services: [
          { id: 's3', name: 'Beard Trim', category: 'Grooming', duration: 30, price: 20 },
          { id: 's4', name: 'Fade Cut', category: 'Haircut', duration: 45, price: 40 },
        ],
        stylists: [],
        nextAvailable: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
      },
    ]

    res.status(200).json({
      success: true,
      data: {
        salons: demoSalons,
        pagination: {
          page: 1,
          limit: demoSalons.length,
          total: demoSalons.length,
        },
      },
      message: 'Served demo salons because the database is unavailable',
    } as any)
  }
}

export const getSalonById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params

    const salon = await prisma.salon.findFirst({
      where: { id, isActive: true },
      include: {
        services: {
          where: { isActive: true },
          select: {
            id: true,
            name: true,
            description: true,
            category: true,
            duration: true,
            price: true
          }
        },
        stylists: {
          where: { isActive: true },
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
                avatar: true
              }
            },
            schedules: {
              select: {
                dayOfWeek: true,
                startTime: true,
                endTime: true,
                isAvailable: true
              }
            }
          }
        },
        reviews: {
          include: {
            customer: {
              select: {
                firstName: true,
                lastName: true,
                avatar: true
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          },
          take: 10
        },
        _count: {
          select: {
            reviews: true
          }
        }
      }
    })

    if (!salon) {
      return res.status(404).json({ error: 'Salon not found' })
    }

    // Calculate average rating
    const totalRating = salon.reviews.reduce((sum: number, review: any) => sum + review.rating, 0)
    const rating = salon.reviews.length > 0 ? totalRating / salon.reviews.length : 0

    const response = {
      ...salon,
      rating: Math.round(rating * 10) / 10,
      reviewCount: salon._count.reviews
    }

    res.json({
      success: true,
      data: response
    })
  } catch (error) {
    console.error('Get salon error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}