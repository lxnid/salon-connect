'use client'

import { MagnifyingGlassIcon, MapPinIcon } from '@heroicons/react/24/outline'
import { Header } from '@/components/layout/Header'
import { SalonCard } from '@/components/SalonCard'

const mockSalons = [
  {
    id: '1',
    name: 'Elite Hair Studio',
    description: 'Professional hair studio offering premium cuts, coloring, and styling services.',
    address: '123 Main Street',
    city: 'Downtown',
    images: ['https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800'],
    rating: 4.8,
    reviewCount: 124,
    distance: 0.5,
    services: [
      { name: "Women's Haircut", price: 65 },
      { name: "Men's Haircut", price: 35 },
    ],
    nextAvailable: '2025-01-25T14:30:00Z'
  },
  {
    id: '2',
    name: 'Barber & Co.',
    description: 'Traditional barbershop with modern flair.',
    address: '456 Oak Avenue',
    city: 'Uptown',
    images: ['https://images.unsplash.com/photo-1562322140-8baeececf3df?w=800'],
    rating: 4.6,
    reviewCount: 89,
    distance: 1.2,
    services: [
      { name: "Beard Trim", price: 25 },
      { name: "Classic Cut", price: 30 },
    ],
    nextAvailable: '2025-01-25T10:00:00Z'
  },
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

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
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-4 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-black focus:border-black text-lg"
                  placeholder="Search services, salons..."
                />
              </div>
              
              {/* Location */}
              <div className="mt-4 flex items-center justify-center text-gray-600">
                <MapPinIcon className="h-5 w-5 mr-2" />
                <span>Downtown, New York • 2.3 km radius</span>
                <button className="ml-2 text-black font-medium">
                  Change
                </button>
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
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Available Salons
          </h2>
          <p className="text-gray-600">
            {mockSalons.length} results found
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockSalons.map((salon) => (
            <SalonCard key={salon.id} salon={salon} />
          ))}
        </div>
      </div>
    </div>
  )
}