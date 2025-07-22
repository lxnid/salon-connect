"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSalonById = exports.getSalons = void 0;
const database_1 = require("@salon-connect/database");
// Calculate distance between two points using Haversine formula
const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
};
const getSalons = async (req, res) => {
    try {
        const { query, latitude, longitude, radius = 10, category, minPrice, maxPrice, minRating = 0, sortBy = 'distance', page = 1, limit = 10 } = req.query;
        const skip = (Number(page) - 1) * Number(limit);
        // Build where clause
        let whereClause = {
            isActive: true
        };
        if (query) {
            whereClause.OR = [
                { name: { contains: query, mode: 'insensitive' } },
                { description: { contains: query, mode: 'insensitive' } },
                { services: { some: { name: { contains: query, mode: 'insensitive' } } } }
            ];
        }
        if (category) {
            whereClause.services = {
                some: {
                    category: category
                }
            };
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
            };
        }
        // Fetch salons with related data
        const salons = await database_1.prisma.salon.findMany({
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
                    include: {
                        user: {
                            select: {
                                firstName: true,
                                lastName: true,
                                avatar: true
                            }
                        }
                    },
                    select: {
                        id: true,
                        bio: true,
                        experience: true,
                        specialties: true,
                        user: true
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
        });
        // Calculate ratings and distances
        const salonsWithDetails = salons
            .map((salon) => {
            // Calculate average rating
            const totalRating = salon.reviews.reduce((sum, review) => sum + review.rating, 0);
            const rating = salon.reviews.length > 0 ? totalRating / salon.reviews.length : 0;
            const reviewCount = salon._count.reviews;
            // Calculate distance if coordinates provided
            let distance;
            if (latitude && longitude && salon.latitude && salon.longitude) {
                distance = calculateDistance(Number(latitude), Number(longitude), salon.latitude, salon.longitude);
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
            };
        })
            .filter((salon) => {
            // Filter by distance if coordinates provided
            if (latitude && longitude && salon.distance !== undefined) {
                return salon.distance <= Number(radius);
            }
            return true;
        })
            .filter((salon) => salon.rating >= Number(minRating));
        // Sort results
        salonsWithDetails.sort((a, b) => {
            switch (sortBy) {
                case 'rating':
                    return b.rating - a.rating;
                case 'price':
                    const avgPriceA = a.services.reduce((sum, s) => sum + s.price, 0) / a.services.length;
                    const avgPriceB = b.services.reduce((sum, s) => sum + s.price, 0) / b.services.length;
                    return avgPriceA - avgPriceB;
                case 'name':
                    return a.name.localeCompare(b.name);
                case 'distance':
                default:
                    if (a.distance !== undefined && b.distance !== undefined) {
                        return a.distance - b.distance;
                    }
                    return a.name.localeCompare(b.name);
            }
        });
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
        });
    }
    catch (error) {
        console.error('Get salons error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.getSalons = getSalons;
const getSalonById = async (req, res) => {
    try {
        const { id } = req.params;
        const salon = await database_1.prisma.salon.findUnique({
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
        });
        if (!salon) {
            return res.status(404).json({ error: 'Salon not found' });
        }
        // Calculate average rating
        const totalRating = salon.reviews.reduce((sum, review) => sum + review.rating, 0);
        const rating = salon.reviews.length > 0 ? totalRating / salon.reviews.length : 0;
        const response = {
            ...salon,
            rating: Math.round(rating * 10) / 10,
            reviewCount: salon._count.reviews
        };
        res.json({
            success: true,
            data: response
        });
    }
    catch (error) {
        console.error('Get salon error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.getSalonById = getSalonById;
//# sourceMappingURL=salons.js.map