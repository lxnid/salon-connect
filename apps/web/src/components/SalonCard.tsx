'use client'

import Link from 'next/link'
import Image from 'next/image'
import { StarIcon, MapPinIcon, ClockIcon } from '@heroicons/react/24/solid'
import { Card, CardContent } from './ui/Card'
import { Button } from './ui/Button'

interface SalonCardProps {
  salon: {
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
      name: string
      price: number
    }>
    nextAvailable?: string
  }
}

export function SalonCard({ salon }: SalonCardProps) {
  const displayImage = salon.images[0] || 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&h=300&fit=crop'
  const minPrice = Math.min(...salon.services.map(s => s.price))
  
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative h-48">
        <Image
          src={displayImage}
          alt={salon.name}
          fill
          className="object-cover"
        />
        {salon.distance && (
          <div className="absolute top-3 left-3 bg-white px-2 py-1 rounded-full text-sm font-medium">
            {salon.distance} km
          </div>
        )}
      </div>
      
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-lg text-gray-900 line-clamp-1">
            {salon.name}
          </h3>
          <div className="flex items-center text-yellow-500 ml-2">
            <StarIcon className="h-4 w-4" />
            <span className="ml-1 text-sm font-medium text-gray-900">
              {salon.rating.toFixed(1)}
            </span>
            <span className="text-gray-500 text-sm ml-1">
              ({salon.reviewCount})
            </span>
          </div>
        </div>
        
        <div className="flex items-center text-gray-600 text-sm mb-2">
          <MapPinIcon className="h-4 w-4 mr-1" />
          <span className="line-clamp-1">{salon.address}, {salon.city}</span>
        </div>
        
        {salon.description && (
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {salon.description}
          </p>
        )}
        
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm text-gray-600">
            Starting from <span className="font-semibold text-gray-900">${minPrice}</span>
          </div>
          {salon.nextAvailable && (
            <div className="flex items-center text-green-600 text-sm">
              <ClockIcon className="h-4 w-4 mr-1" />
              <span>Next: Today 2:30 PM</span>
            </div>
          )}
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" className="flex-1" disabled>
            View Details
          </Button>
          <Button className="flex-1" disabled>
            Book Now
          </Button>
        </div>
        <p className="text-xs text-gray-500 mt-2 text-center">
          Booking functionality coming soon!
        </p>
      </CardContent>
    </Card>
  )
}