import axios from 'axios'

const rawBase = process.env.NEXT_PUBLIC_API_URL || 'https://salon-connect-api.onrender.com/api'
// Normalize to ensure trailing /api is present
const API_BASE_URL = /\/api\/?$/.test(rawBase) ? rawBase : `${rawBase.replace(/\/$/, '')}/api`

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Add auth token from localStorage if present (client-side only)
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers = config.headers || {}
      config.headers.Authorization = `Bearer ${token}`
    }
  }
  return config
})

// Handle common error cases
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Optionally redirect to login on unauthorized
      // window.location.href = '/auth/signin'
    }
    return Promise.reject(error)
  }
)

export const authAPI = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  signup: (data: any) => api.post('/auth/register', data),
  profile: () => api.get('/auth/profile')
}

export const salonAPI = {
  getSalons: (params?: any) => api.get('/salons', { params }),
  getSalon: (id: string) => api.get(`/salons/${id}`)
}