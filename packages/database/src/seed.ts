import { PrismaClient, UserRole, ServiceCategory } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Idempotency: skip if any user exists
  const existingUser = await prisma.user.findFirst()
  if (existingUser) {
    console.log('✅ Database already seeded, skipping...')
    return
  }

  // Create sample users
  const hashedPassword = await bcrypt.hash('password123', 12)

  // Sample customer
  const customer = await prisma.user.create({
    data: {
      email: 'customer@example.com',
      password: hashedPassword,
      role: UserRole.CUSTOMER,
      firstName: 'Jessica',
      lastName: 'Martinez',
      phone: '+1 (555) 987-6543',
    },
  })

  // Sample salon owner
  const salonOwner = await prisma.user.create({
    data: {
      email: 'owner@example.com',
      password: hashedPassword,
      role: UserRole.SALON_OWNER,
      firstName: 'David',
      lastName: 'Johnson',
      phone: '+1 (555) 123-4567',
    },
  })

  // Sample stylist users
  const stylistUser1 = await prisma.user.create({
    data: {
      email: 'sarah@example.com',
      password: hashedPassword,
      role: UserRole.STYLIST,
      firstName: 'Sarah',
      lastName: 'Johnson',
      phone: '+1 (555) 234-5678',
    },
  })

  const stylistUser2 = await prisma.user.create({
    data: {
      email: 'mike@example.com',
      password: hashedPassword,
      role: UserRole.STYLIST,
      firstName: 'Mike',
      lastName: 'Chen',
      phone: '+1 (555) 345-6789',
    },
  })

  // Create sample salon
  const salon = await prisma.salon.create({
    data: {
      name: 'Elite Hair Studio',
      description: 'Professional hair studio offering premium cuts, coloring, and styling services.',
      address: '123 Main Street',
      city: 'Downtown',
      state: 'New York',
      zipCode: '10001',
      latitude: 40.7589,
      longitude: -73.9851,
      phone: '+1 (555) 123-0000',
      email: 'info@elitehairstudio.com',
      images: [
        'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800',
        'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=800',
      ],
      ownerId: salonOwner.id,
    },
  })

  // Create stylists
  const stylist1 = await prisma.stylist.create({
    data: {
      userId: stylistUser1.id,
      salonId: salon.id,
      bio: 'Senior stylist with 8+ years of experience in modern cuts and color.',
      experience: 8,
      specialties: ['Hair Cutting', 'Color Correction', 'Styling'],
    },
  })

  const stylist2 = await prisma.stylist.create({
    data: {
      userId: stylistUser2.id,
      salonId: salon.id,
      bio: 'Color specialist passionate about creative transformations.',
      experience: 5,
      specialties: ['Hair Coloring', 'Highlights', 'Balayage'],
    },
  })

  // Create services
  const services = await Promise.all([
    prisma.service.create({
      data: {
        name: "Women's Haircut",
        description: 'Professional haircut and styling',
        category: ServiceCategory.HAIRCUT,
        duration: 45,
        price: 65,
        salonId: salon.id,
      },
    }),
    prisma.service.create({
      data: {
        name: "Men's Haircut",
        description: 'Classic and modern cuts for men',
        category: ServiceCategory.HAIRCUT,
        duration: 30,
        price: 35,
        salonId: salon.id,
      },
    }),
    prisma.service.create({
      data: {
        name: 'Hair Coloring',
        description: 'Full hair color service',
        category: ServiceCategory.COLORING,
        duration: 120,
        price: 120,
        salonId: salon.id,
      },
    }),
    prisma.service.create({
      data: {
        name: 'Highlights',
        description: 'Professional highlighting service',
        category: ServiceCategory.COLORING,
        duration: 150,
        price: 150,
        salonId: salon.id,
      },
    }),
    prisma.service.create({
      data: {
        name: 'Blowout',
        description: 'Professional blow dry and styling',
        category: ServiceCategory.STYLING,
        duration: 30,
        price: 45,
        salonId: salon.id,
      },
    }),
  ])

  // Assign services to stylists
  await Promise.all([
    ...services.map(service => 
      prisma.stylistService.create({
        data: {
          stylistId: stylist1.id,
          serviceId: service.id,
        },
      })
    ),
    ...services.slice(0, 3).map(service => 
      prisma.stylistService.create({
        data: {
          stylistId: stylist2.id,
          serviceId: service.id,
        },
      })
    ),
  ])

  // Create sample schedules for stylists (Mon-Fri, 9am-6pm)
  const scheduleData = Array.from({ length: 5 }, (_, i) => ({
    dayOfWeek: i + 1, // Monday = 1
    startTime: '09:00',
    endTime: '18:00',
    isAvailable: true,
  }))

  await Promise.all([
    ...scheduleData.map(schedule =>
      prisma.stylistSchedule.create({
        data: { ...schedule, stylistId: stylist1.id },
      })
    ),
    ...scheduleData.map(schedule =>
      prisma.stylistSchedule.create({
        data: { ...schedule, stylistId: stylist2.id },
      })
    ),
  ])

  // Booking + Review for first salon
  const booking1 = await prisma.booking.create({
    data: {
      datetime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      totalPrice: services[0].price,
      customerId: customer.id,
      salonId: salon.id,
      stylistId: stylist1.id,
    }
  })
  await prisma.bookingService.create({ data: { bookingId: booking1.id, serviceId: services[0].id } })
  await prisma.review.create({
    data: {
      rating: 5,
      comment: 'Fantastic experience! Highly recommend.',
      customerId: customer.id,
      salonId: salon.id,
      bookingId: booking1.id,
    }
  })

  // ---------------- Additional sample salons ----------------
  const salonOwner2 = await prisma.user.create({
    data: {
      email: 'owner2@example.com',
      password: hashedPassword,
      role: UserRole.SALON_OWNER,
      firstName: 'Amanda',
      lastName: 'Clark',
      phone: '+1 (555) 111-2222',
    },
  })
  const stylistUser3 = await prisma.user.create({
    data: {
      email: 'emily@example.com',
      password: hashedPassword,
      role: UserRole.STYLIST,
      firstName: 'Emily',
      lastName: 'Stone',
      phone: '+1 (555) 222-3333',
    },
  })
  const stylistUser4 = await prisma.user.create({
    data: {
      email: 'jake@example.com',
      password: hashedPassword,
      role: UserRole.STYLIST,
      firstName: 'Jake',
      lastName: 'Williams',
      phone: '+1 (555) 333-4444',
    },
  })

  const salon2 = await prisma.salon.create({
    data: {
      name: 'Urban Barber',
      description: 'Modern barbershop specializing in fades, beard trims, and classic cuts.',
      address: '456 Market Ave',
      city: 'Uptown',
      state: 'New York',
      zipCode: '10002',
      latitude: 40.7306,
      longitude: -73.9352,
      phone: '+1 (555) 222-0000',
      email: 'hello@urbanbarber.com',
      images: [
        'https://images.unsplash.com/photo-1556228724-4a3aa6458a27?w=800',
        'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800',
      ],
      ownerId: salonOwner2.id,
    },
  })

  const stylist3 = await prisma.stylist.create({
    data: {
      userId: stylistUser3.id,
      salonId: salon2.id,
      bio: 'Barber with 7 years of experience in modern fades and beard styling.',
      experience: 7,
      specialties: ['Fade', 'Beard Trim', 'Line Up'],
    },
  })
  const stylist4 = await prisma.stylist.create({
    data: {
      userId: stylistUser4.id,
      salonId: salon2.id,
      bio: 'Classic barber focusing on premium shaves and scissor cuts.',
      experience: 10,
      specialties: ['Scissor Cut', 'Shave', 'Beard Styling'],
    },
  })

  const services2 = await Promise.all([
    prisma.service.create({
      data: {
        name: 'Fade Cut',
        description: 'Skin fade or low/mid/high fade',
        category: ServiceCategory.HAIRCUT,
        duration: 45,
        price: 40,
        salonId: salon2.id,
      },
    }),
    prisma.service.create({
      data: {
        name: 'Beard Trim',
        description: 'Precision beard shaping and trimming',
        category: ServiceCategory.STYLING,
        duration: 20,
        price: 20,
        salonId: salon2.id,
      },
    }),
    prisma.service.create({
      data: {
        name: 'Hot Towel Shave',
        description: 'Traditional straight razor shave with hot towel',
        category: ServiceCategory.TREATMENT,
        duration: 30,
        price: 35,
        salonId: salon2.id,
      },
    }),
  ])

  await Promise.all([
    ...services2.map(s => prisma.stylistService.create({ data: { stylistId: stylist3.id, serviceId: s.id } })),
    ...services2.slice(0, 2).map(s => prisma.stylistService.create({ data: { stylistId: stylist4.id, serviceId: s.id } })),
  ])
  await Promise.all(
    Array.from({ length: 5 }, (_, i) => prisma.stylistSchedule.create({
      data: { dayOfWeek: i + 1, startTime: '10:00', endTime: '19:00', isAvailable: true, stylistId: stylist3.id }
    }))
  )
  await Promise.all(
    Array.from({ length: 5 }, (_, i) => prisma.stylistSchedule.create({
      data: { dayOfWeek: i + 1, startTime: '11:00', endTime: '20:00', isAvailable: true, stylistId: stylist4.id }
    }))
  )

  const booking2 = await prisma.booking.create({
    data: {
      datetime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      totalPrice: services2[0].price,
      customerId: customer.id,
      salonId: salon2.id,
      stylistId: stylist3.id,
    }
  })
  await prisma.bookingService.create({ data: { bookingId: booking2.id, serviceId: services2[0].id } })
  await prisma.review.create({
    data: {
      rating: 4,
      comment: 'Great fade and friendly staff.',
      customerId: customer.id,
      salonId: salon2.id,
      bookingId: booking2.id,
    }
  })

  // Third salon: Glow Beauty Spa
  const salonOwner3 = await prisma.user.create({
    data: {
      email: 'owner3@example.com',
      password: hashedPassword,
      role: UserRole.SALON_OWNER,
      firstName: 'Sofia',
      lastName: 'Rivera',
      phone: '+1 (555) 444-5555',
    },
  })
  const stylistUser5 = await prisma.user.create({
    data: {
      email: 'anna@example.com',
      password: hashedPassword,
      role: UserRole.STYLIST,
      firstName: 'Anna',
      lastName: 'Lee',
      phone: '+1 (555) 555-6666',
    },
  })
  const stylistUser6 = await prisma.user.create({
    data: {
      email: 'luis@example.com',
      password: hashedPassword,
      role: UserRole.STYLIST,
      firstName: 'Luis',
      lastName: 'Garcia',
      phone: '+1 (555) 666-7777',
    },
  })

  const salon3 = await prisma.salon.create({
    data: {
      name: 'Glow Beauty Spa',
      description: 'Relaxing spa offering facials, massages, and nail care.',
      address: '789 Sunset Blvd',
      city: 'Midtown',
      state: 'California',
      zipCode: '90001',
      latitude: 34.0522,
      longitude: -118.2437,
      phone: '+1 (555) 333-0000',
      email: 'contact@glowbeautyspa.com',
      images: [
        'https://images.unsplash.com/photo-1556228720-1933dfaa89ae?w=800',
        'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800',
      ],
      ownerId: salonOwner3.id,
    },
  })

  const stylist5 = await prisma.stylist.create({
    data: {
      userId: stylistUser5.id,
      salonId: salon3.id,
      bio: 'Esthetician specializing in facials and skincare treatments.',
      experience: 6,
      specialties: ['Facial', 'Skincare', 'Massage'],
    },
  })
  const stylist6 = await prisma.stylist.create({
    data: {
      userId: stylistUser6.id,
      salonId: salon3.id,
      bio: 'Massage therapist with a focus on relaxation and deep tissue.',
      experience: 9,
      specialties: ['Massage', 'Deep Tissue', 'Aromatherapy'],
    },
  })

  const services3 = await Promise.all([
    prisma.service.create({
      data: {
        name: 'Classic Facial',
        description: 'Deep cleansing facial treatment',
        category: ServiceCategory.FACIAL,
        duration: 60,
        price: 80,
        salonId: salon3.id,
      },
    }),
    prisma.service.create({
      data: {
        name: 'Relaxing Massage',
        description: 'Full-body relaxing massage',
        category: ServiceCategory.MASSAGE,
        duration: 60,
        price: 90,
        salonId: salon3.id,
      },
    }),
    prisma.service.create({
      data: {
        name: 'Manicure',
        description: 'Classic manicure with polish',
        category: ServiceCategory.MANICURE,
        duration: 45,
        price: 30,
        salonId: salon3.id,
      },
    }),
  ])

  await Promise.all([
    ...services3.map(s => prisma.stylistService.create({ data: { stylistId: stylist5.id, serviceId: s.id } })),
    ...services3.map(s => prisma.stylistService.create({ data: { stylistId: stylist6.id, serviceId: s.id } })),
  ])
  await Promise.all(
    Array.from({ length: 5 }, (_, i) => prisma.stylistSchedule.create({
      data: { dayOfWeek: i + 1, startTime: '10:00', endTime: '18:00', isAvailable: true, stylistId: stylist5.id }
    }))
  )
  await Promise.all(
    Array.from({ length: 5 }, (_, i) => prisma.stylistSchedule.create({
      data: { dayOfWeek: i + 1, startTime: '12:00', endTime: '20:00', isAvailable: true, stylistId: stylist6.id }
    }))
  )

  const booking3 = await prisma.booking.create({
    data: {
      datetime: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
      totalPrice: services3[1].price,
      customerId: customer.id,
      salonId: salon3.id,
      stylistId: stylist6.id,
    }
  })
  await prisma.bookingService.create({ data: { bookingId: booking3.id, serviceId: services3[1].id } })
  await prisma.review.create({
    data: {
      rating: 5,
      comment: 'Incredibly relaxing massage. Will return!',
      customerId: customer.id,
      salonId: salon3.id,
      bookingId: booking3.id,
    }
  })

  console.log('✅ Database seeded successfully!')
  console.log('📧 Test accounts created:')
  console.log('   Customer: customer@example.com / password123')
  console.log('   Salon Owners: owner@example.com, owner2@example.com, owner3@example.com / password123')
  console.log('   Stylists: sarah@example.com, mike@example.com, emily@example.com, jake@example.com, anna@example.com, luis@example.com / password123')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })