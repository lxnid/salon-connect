'use client'

import { useState, useEffect } from 'react'
import { MagnifyingGlassIcon, MapPinIcon } from '@heroicons/react/24/outline'
// Removed Header import because it's now in RootLayout
import { SalonCard } from '@/components/SalonCard'
import { salonAPI } from '@/lib/api'

interface Salon {
  id: string
  name: string
  description?: string
  address: string
  city: string
  images: string[]
  rating: number
  reviewCount: number
  distance?: number
  services: Array<{
    id: string
    name: string
    price: number
  }>
  nextAvailable?: string
}

export default function HomePage() {
  const [salons, setSalons] = useState<Salon[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  const fetchSalons = async (query?: string) => {
    try {
      setLoading(true)
      setError('')
      const response = await salonAPI.getSalons({ 
        query,
        limit: 10 
      })
      const salonsData = (response as any)?.data?.data?.salons ?? (response as any)?.data?.salons ?? []
      setSalons(Array.isArray(salonsData) ? salonsData : [])
    } catch (err) {
      setError('Failed to load salons. Please try again.')
      console.error('Error fetching salons:', err)
      // Fallback to demo data if API fails (ids must match pre-generated static params)
      setSalons([
        {
          id: 'demo-1',
          name: 'Elite Hair Studio (Demo)',
          description: 'Professional hair studio - API connecting...'
,
          address: '123 Main Street',
          city: 'Downtown',
          images: ['https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800'],
          rating: 4.8,
          reviewCount: 124,
          services: [
            { id: 's1', name: "Women's Haircut", price: 65 },
            { id: 's2', name: "Men's Haircut", price: 35 },
          ],
          nextAvailable: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 'demo-2',
          name: 'Urban Barber (Demo)',
          description: 'Modern barbershop - API connecting...'
,
          address: '456 Market Ave',
          city: 'Uptown',
          images: ['https://images.unsplash.com/photo-1556228724-4a3aa6458a27?w=800'],
          rating: 4.5,
          reviewCount: 89,
          services: [
            { id: 's3', name: 'Beard Trim', price: 20 },
            { id: 's4', name: 'Fade Cut', price: 40 },
          ],
          nextAvailable: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString()
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSalons()
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    fetchSalons(searchQuery)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header removed; provided by RootLayout */}

      {/* Hero Section */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-gray-900 mb-4">
              Find Your Perfect Salon
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Discover top-rated salons and barbers near you
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <form onSubmit={handleSearch}>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="block w-full pl-10 pr-3 py-4 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-black focus:border-black text-lg"
                    placeholder="Search services, salons..."
                  />
                  <button
                    type="submit"
                    className="absolute right-2 top-2 bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800"
                  >
                    Search
                  </button>
                </div>
              </form>
              
              {/* Location */}
              <div className="mt-4 flex items-center justify-center text-gray-600">
                <MapPinIcon className="h-5 w-5 mr-2" />
                <span>Global Search • All Locations</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-4">
            <button className="bg-black text-white px-4 py-2 rounded-lg">
              All
            </button>
            <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200">
              Nearby
            </button>
            <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200">
              Top Rated
            </button>
            <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200">
              Available Today
            </button>
            <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 ml-auto">
              Filters
            </button>
          </div>
        </div>
      </div>

      {/* Salon Results */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-600">{error}</p>
            <button 
              onClick={() => fetchSalons()}
              className="mt-2 text-red-700 hover:text-red-900 font-medium"
            >
              Try Again
            </button>
          </div>
        )}

        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {searchQuery ? `Search Results for "${searchQuery}"` : 'Available Salons'}
          </h2>
          {loading ? (
            <div className="flex items-center text-gray-600">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900 mr-2"></div>
              Loading salons...
            </div>
          ) : (
            <p className="text-gray-600">
              {salons.length} result{salons.length !== 1 ? 's' : ''} found
            </p>
          )}
        </div>
        
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-lg shadow-sm border animate-pulse">
                <div className="h-48 bg-gray-200 rounded-t-lg"></div>
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-3 bg-gray-200 rounded w-full"></div>
                </div>
              </div>
            ))}
          </div>
        ) : salons.length > 0 ? (
          <div className="columns-1 md:columns-2 lg:columns-3 gap-x-6">
            {salons.map((salon) => (
              <SalonCard key={salon.id} salon={salon} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-500 mb-4">
              <MagnifyingGlassIcon className="h-12 w-12 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No salons found
              </h3>
              <p className="text-gray-600">
                {searchQuery ? 
                  `No salons found for "${searchQuery}". Try a different search term.` :
                  'No salons are currently available. Check back later!'
                }
              </p>
            </div>
            {searchQuery && (
              <button 
                onClick={() => {
                  setSearchQuery('')
                  fetchSalons()
                }}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Clear search and show all salons
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}