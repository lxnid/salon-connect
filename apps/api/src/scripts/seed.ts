import { prisma, UserRole, ServiceCategory } from '../lib/prisma'
import bcrypt from 'bcryptjs'

async function main() {
  console.log('🌱 Starting database seed...')

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

  console.log('✅ Database seeded successfully!')
  console.log('📧 Test accounts created:')
  console.log('   Customer: customer@example.com / password123')
  console.log('   Salon Owner: owner@example.com / password123')
  console.log('   Stylists: sarah@example.com, mike@example.com / password123')
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