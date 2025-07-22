export * from '@prisma/client'

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// Auth Types
export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  email: string
  password: string
  firstName?: string
  lastName?: string
  role: 'CUSTOMER' | 'SALON_OWNER' | 'STYLIST'
  phone?: string
}

export interface AuthResponse {
  user: {
    id: string
    email: string
    role: string
    firstName?: string
    lastName?: string
  }
  token: string
}

// Search Types
export interface SalonSearchParams {
  query?: string
  latitude?: number
  longitude?: number
  radius?: number // in km
  category?: string
  minPrice?: number
  maxPrice?: number
  minRating?: number
  sortBy?: 'distance' | 'rating' | 'price' | 'name'
  page?: number
  limit?: number
}

export interface SalonWithDetails {
  id: string
  name: string
  description?: string
  address: string
  city: string
  state: string
  latitude?: number
  longitude?: number
  phone?: string
  images: string[]
  rating: number
  reviewCount: number
  distance?: number
  services: {
    id: string
    name: string
    category: string
    duration: number
    price: number
  }[]
  stylists: {
    id: string
    user: {
      firstName?: string
      lastName?: string
      avatar?: string
    }
    bio?: string
    experience?: number
    specialties: string[]
  }[]
  nextAvailable?: string
}

// Booking Types
export interface CreateBookingRequest {
  salonId: string
  stylistId: string
  serviceIds: string[]
  datetime: string
  notes?: string
}

export interface BookingWithDetails {
  id: string
  datetime: string
  totalPrice: number
  status: string
  notes?: string
  salon: {
    id: string
    name: string
    address: string
    phone?: string
  }
  stylist: {
    id: string
    user: {
      firstName?: string
      lastName?: string
    }
  }
  services: {
    id: string
    name: string
    duration: number
    price: number
  }[]
  createdAt: string
}

// Review Types
export interface CreateReviewRequest {
  bookingId: string
  rating: number
  comment?: string
}

// AI Assistant Types
export interface AISearchRequest {
  query: string
  location?: {
    latitude: number
    longitude: number
  }
  preferences?: {
    priceRange?: [number, number]
    preferredTime?: string
    serviceType?: string
  }
}

export interface AISearchResponse {
  recommendations: SalonWithDetails[]
  explanation: string
  suggestedServices?: string[]
}