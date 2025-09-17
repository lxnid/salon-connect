import { prisma, UserRole, ServiceCategory } from '../lib/prisma'
import bcrypt from 'bcryptjs'

async function main() {
  console.log('🌱 Starting database seed...')

  // Check if data already exists
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

  // Create a booking and review for first salon
  const booking1 = await prisma.booking.create({
    data: {
      datetime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      totalPrice: services[0].price,
      customerId: customer.id,
      salonId: salon.id,
      stylistId: stylist1.id,
    }
  })
  await prisma.bookingService.create({
    data: { bookingId: booking1.id, serviceId: services[0].id }
  })
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

  // 4) Chic Nails Lounge (Brooklyn, NY)
  const salonOwner4 = await prisma.user.create({
    data: {
      email: 'owner4@example.com',
      password: hashedPassword,
      role: UserRole.SALON_OWNER,
      firstName: 'Lily',
      lastName: 'Nguyen',
      phone: '+1 (555) 888-1111',
    },
  })
  const stylistUser7 = await prisma.user.create({
    data: {
      email: 'mia@example.com',
      password: hashedPassword,
      role: UserRole.STYLIST,
      firstName: 'Mia',
      lastName: 'Diaz',
      phone: '+1 (555) 888-2222',
    },
  })
  const stylistUser8 = await prisma.user.create({
    data: {
      email: 'zoe@example.com',
      password: hashedPassword,
      role: UserRole.STYLIST,
      firstName: 'Zoe',
      lastName: 'Kim',
      phone: '+1 (555) 888-3333',
    },
  })

  const salon4 = await prisma.salon.create({
    data: {
      name: 'Chic Nails Lounge',
      description: 'Trend-forward nail lounge for manicures, pedicures, and nail art.',
      address: '101 Bedford Ave',
      city: 'Brooklyn',
      state: 'New York',
      zipCode: '11211',
      latitude: 40.7170,
      longitude: -73.9560,
      phone: '+1 (555) 444-1111',
      email: 'contact@chicnailslounge.com',
      images: [
        'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800',
        'https://images.unsplash.com/photo-1519014816548-bf5fe059798b?w=800',
      ],
      ownerId: salonOwner4.id,
    },
  })

  const stylist7 = await prisma.stylist.create({
    data: {
      userId: stylistUser7.id,
      salonId: salon4.id,
      bio: 'Nail artist specializing in gel extensions and minimalist art.',
      experience: 4,
      specialties: ['Manicure', 'Gel Extensions', 'Nail Art'],
    },
  })
  const stylist8 = await prisma.stylist.create({
    data: {
      userId: stylistUser8.id,
      salonId: salon4.id,
      bio: 'Pedicure pro focused on precision and care.',
      experience: 6,
      specialties: ['Pedicure', 'Spa Pedicure', 'French Manicure'],
    },
  })

  const services4 = await Promise.all([
    prisma.service.create({
      data: {
        name: 'Classic Manicure',
        description: 'Shaping, cuticle care, and polish',
        category: ServiceCategory.MANICURE,
        duration: 40,
        price: 28,
        salonId: salon4.id,
      },
    }),
    prisma.service.create({
      data: {
        name: 'Spa Pedicure',
        description: 'Exfoliating scrub, mask, and massage',
        category: ServiceCategory.PEDICURE,
        duration: 55,
        price: 45,
        salonId: salon4.id,
      },
    }),
    prisma.service.create({
      data: {
        name: 'Gel Extensions',
        description: 'Gel overlay with extensions and design options',
        category: ServiceCategory.MANICURE,
        duration: 75,
        price: 70,
        salonId: salon4.id,
      },
    }),
  ])

  await Promise.all([
    ...services4.map(s => prisma.stylistService.create({ data: { stylistId: stylist7.id, serviceId: s.id } })),
    ...services4.map(s => prisma.stylistService.create({ data: { stylistId: stylist8.id, serviceId: s.id } })),
  ])
  await Promise.all(
    Array.from({ length: 5 }, (_, i) => prisma.stylistSchedule.create({
      data: { dayOfWeek: i + 1, startTime: '10:00', endTime: '18:00', isAvailable: true, stylistId: stylist7.id }
    }))
  )
  await Promise.all(
    Array.from({ length: 5 }, (_, i) => prisma.stylistSchedule.create({
      data: { dayOfWeek: i + 1, startTime: '11:00', endTime: '19:00', isAvailable: true, stylistId: stylist8.id }
    }))
  )

  const booking4 = await prisma.booking.create({
    data: {
      datetime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      totalPrice: services4[0].price,
      customerId: customer.id,
      salonId: salon4.id,
      stylistId: stylist7.id,
    }
  })
  await prisma.bookingService.create({ data: { bookingId: booking4.id, serviceId: services4[0].id } })
  await prisma.review.create({
    data: {
      rating: 5,
      comment: 'Beautiful manicure and friendly staff!',
      customerId: customer.id,
      salonId: salon4.id,
      bookingId: booking4.id,
    }
  })

  // 5) Fresh Curls Studio (Queens, NY)
  const salonOwner5 = await prisma.user.create({
    data: {
      email: 'owner5@example.com',
      password: hashedPassword,
      role: UserRole.SALON_OWNER,
      firstName: 'Nina',
      lastName: 'Patel',
      phone: '+1 (555) 999-0000',
    },
  })
  const stylistUser9 = await prisma.user.create({
    data: {
      email: 'ivy@example.com',
      password: hashedPassword,
      role: UserRole.STYLIST,
      firstName: 'Ivy',
      lastName: 'Brooks',
      phone: '+1 (555) 999-1111',
    },
  })
  const stylistUser10 = await prisma.user.create({
    data: {
      email: 'noah@example.com',
      password: hashedPassword,
      role: UserRole.STYLIST,
      firstName: 'Noah',
      lastName: 'Reed',
      phone: '+1 (555) 999-2222',
    },
  })

  const salon5 = await prisma.salon.create({
    data: {
      name: 'Fresh Curls Studio',
      description: 'Specialists in curly cuts, hydration treatments, and silk press styling.',
      address: '22 41st Ave',
      city: 'Queens',
      state: 'New York',
      zipCode: '11101',
      latitude: 40.7506,
      longitude: -73.9407,
      phone: '+1 (555) 555-0101',
      email: 'hello@freshcurlsstudio.com',
      images: [
        'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800',
        'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800',
      ],
      ownerId: salonOwner5.id,
    },
  })

  const stylist9 = await prisma.stylist.create({
    data: {
      userId: stylistUser9.id,
      salonId: salon5.id,
      bio: 'Curl specialist focused on shape, health, and definition.',
      experience: 7,
      specialties: ['Haircut', 'Curly Hair', 'Hair Treatment'],
    },
  })
  const stylist10 = await prisma.stylist.create({
    data: {
      userId: stylistUser10.id,
      salonId: salon5.id,
      bio: 'Stylist experienced with silk press and hydration treatments.',
      experience: 5,
      specialties: ['Silk Press', 'Hydration', 'Styling'],
    },
  })

  const services5 = await Promise.all([
    prisma.service.create({
      data: {
        name: 'Curl Cut',
        description: 'Dry curl-by-curl cut for optimal shape',
        category: ServiceCategory.HAIRCUT,
        duration: 60,
        price: 85,
        salonId: salon5.id,
      },
    }),
    prisma.service.create({
      data: {
        name: 'Hydration Treatment',
        description: 'Deep conditioning and steam hydration',
        category: ServiceCategory.TREATMENT,
        duration: 45,
        price: 55,
        salonId: salon5.id,
      },
    }),
    prisma.service.create({
      data: {
        name: 'Silk Press',
        description: 'Silkening treatment and pressed finish',
        category: ServiceCategory.STYLING,
        duration: 60,
        price: 95,
        salonId: salon5.id,
      },
    }),
  ])

  await Promise.all([
    ...services5.map(s => prisma.stylistService.create({ data: { stylistId: stylist9.id, serviceId: s.id } })),
    ...services5.map(s => prisma.stylistService.create({ data: { stylistId: stylist10.id, serviceId: s.id } })),
  ])
  await Promise.all(
    Array.from({ length: 5 }, (_, i) => prisma.stylistSchedule.create({
      data: { dayOfWeek: i + 1, startTime: '10:00', endTime: '19:00', isAvailable: true, stylistId: stylist9.id }
    }))
  )
  await Promise.all(
    Array.from({ length: 5 }, (_, i) => prisma.stylistSchedule.create({
      data: { dayOfWeek: i + 1, startTime: '12:00', endTime: '20:00', isAvailable: true, stylistId: stylist10.id }
    }))
  )

  const booking5 = await prisma.booking.create({
    data: {
      datetime: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000),
      totalPrice: services5[0].price,
      customerId: customer.id,
      salonId: salon5.id,
      stylistId: stylist9.id,
    }
  })
  await prisma.bookingService.create({ data: { bookingId: booking5.id, serviceId: services5[0].id } })
  await prisma.review.create({
    data: {
      rating: 5,
      comment: 'My curls have never looked better!',
      customerId: customer.id,
      salonId: salon5.id,
      bookingId: booking5.id,
    }
  })

  // 6) The Brow & Lash Bar (Manhattan, NY)
  const salonOwner6 = await prisma.user.create({
    data: {
      email: 'owner6@example.com',
      password: hashedPassword,
      role: UserRole.SALON_OWNER,
      firstName: 'Riley',
      lastName: 'Morgan',
      phone: '+1 (555) 123-7890',
    },
  })
  const stylistUser11 = await prisma.user.create({
    data: {
      email: 'brianna@example.com',
      password: hashedPassword,
      role: UserRole.STYLIST,
      firstName: 'Brianna',
      lastName: 'Gray',
      phone: '+1 (555) 123-4561',
    },
  })
  const stylistUser12 = await prisma.user.create({
    data: {
      email: 'luna@example.com',
      password: hashedPassword,
      role: UserRole.STYLIST,
      firstName: 'Luna',
      lastName: 'Park',
      phone: '+1 (555) 123-4562',
    },
  })

  const salon6 = await prisma.salon.create({
    data: {
      name: 'The Brow & Lash Bar',
      description: 'Expert brow shaping, lamination, and lash extensions.',
      address: '12 W 23rd St',
      city: 'Manhattan',
      state: 'New York',
      zipCode: '10010',
      latitude: 40.7420,
      longitude: -73.9920,
      phone: '+1 (555) 777-2222',
      email: 'book@browandlashbar.com',
      images: [
        'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800',
        'https://images.unsplash.com/photo-1573497499518-0a9c84d5f0b4?w=800',
      ],
      ownerId: salonOwner6.id,
    },
  })

  const stylist11 = await prisma.stylist.create({
    data: {
      userId: stylistUser11.id,
      salonId: salon6.id,
      bio: 'Brow specialist for precise shaping and lamination.',
      experience: 6,
      specialties: ['Brows', 'Lamination', 'Waxing'],
    },
  })
  const stylist12 = await prisma.stylist.create({
    data: {
      userId: stylistUser12.id,
      salonId: salon6.id,
      bio: 'Lash artist focusing on classic and volume sets.',
      experience: 4,
      specialties: ['Lashes', 'Extensions', 'Refill'],
    },
  })

  const services6 = await Promise.all([
    prisma.service.create({
      data: {
        name: 'Brow Shaping',
        description: 'Wax, tweeze, and trim for a tailored brow',
        category: ServiceCategory.TREATMENT,
        duration: 25,
        price: 25,
        salonId: salon6.id,
      },
    }),
    prisma.service.create({
      data: {
        name: 'Lash Extensions',
        description: 'Full application of classic or volume lash extensions',
        category: ServiceCategory.TREATMENT,
        duration: 120,
        price: 160,
        salonId: salon6.id,
      },
    }),
    prisma.service.create({
      data: {
        name: 'Brow Lamination',
        description: 'Brow lamination and tint for a fuller look',
        category: ServiceCategory.TREATMENT,
        duration: 50,
        price: 80,
        salonId: salon6.id,
      },
    }),
  ])

  await Promise.all([
    ...services6.map(s => prisma.stylistService.create({ data: { stylistId: stylist11.id, serviceId: s.id } })),
    ...services6.map(s => prisma.stylistService.create({ data: { stylistId: stylist12.id, serviceId: s.id } })),
  ])
  await Promise.all(
    Array.from({ length: 5 }, (_, i) => prisma.stylistSchedule.create({
      data: { dayOfWeek: i + 1, startTime: '10:00', endTime: '18:00', isAvailable: true, stylistId: stylist11.id }
    }))
  )
  await Promise.all(
    Array.from({ length: 5 }, (_, i) => prisma.stylistSchedule.create({
      data: { dayOfWeek: i + 1, startTime: '11:00', endTime: '19:00', isAvailable: true, stylistId: stylist12.id }
    }))
  )

  const booking6 = await prisma.booking.create({
    data: {
      datetime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      totalPrice: services6[0].price,
      customerId: customer.id,
      salonId: salon6.id,
      stylistId: stylist11.id,
    }
  })
  await prisma.bookingService.create({ data: { bookingId: booking6.id, serviceId: services6[0].id } })
  await prisma.review.create({
    data: {
      rating: 4,
      comment: 'Perfect brow shape, will come again!',
      customerId: customer.id,
      salonId: salon6.id,
      bookingId: booking6.id,
    }
  })

  console.log('✅ Database seeded successfully!')
  console.log('📧 Test accounts created:')
  console.log('   Customer: customer@example.com / password123')
  console.log('   Salon Owners: owner@example.com, owner2@example.com, owner3@example.com, owner4@example.com, owner5@example.com, owner6@example.com / password123')
  console.log('   Stylists: sarah@example.com, mike@example.com, emily@example.com, jake@example.com, anna@example.com, luis@example.com, mia@example.com, zoe@example.com, ivy@example.com, noah@example.com, brianna@example.com, luna@example.com / password123')
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