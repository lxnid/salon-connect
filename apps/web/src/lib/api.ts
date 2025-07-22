import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || process.env.API_URL || 'https://salon-connect-api.onrender.com/api'

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('token')
      window.location.href = '/auth/signin'
    }
    return Promise.reject(error)
  }
)

// Auth API functions
export const authAPI = {
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password })
    return response.data
  },
  
  register: async (userData: {
    email: string
    password: string
    firstName?: string
    lastName?: string
    role: string
    phone?: string
  }) => {
    const response = await api.post('/auth/register', userData)
    return response.data
  },
  
  getProfile: async () => {
    const response = await api.get('/auth/profile')
    return response.data
  },
}

// Salon API functions
export const salonAPI = {
  searchSalons: async (params: {
    query?: string
    latitude?: number
    longitude?: number
    radius?: number
    category?: string
    minPrice?: number
    maxPrice?: number
    minRating?: number
    sortBy?: string
    page?: number
    limit?: number
  }) => {
    const response = await api.get('/salons', { params })
    return response.data
  },
  
  getSalonById: async (id: string) => {
    const response = await api.get(`/salons/${id}`)
    return response.data
  },
}