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
  const imageUrl = salon.images?.[0] || '/placeholder.jpg'

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      {/* Image */}
      <div className="relative h-48">
        <Image
          src={imageUrl}
          alt={`${salon.name} image`}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover"
          priority={false}
        />
      </div>

      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{salon.name}</h3>
            {salon.description && (
              <p className="mt-1 text-sm text-gray-600 line-clamp-2">{salon.description}</p>
            )}

            <div className="mt-2 flex items-center text-sm text-gray-600">
              <MapPinIcon className="h-4 w-4 mr-1" />
              <span>
                {salon.address}, {salon.city}
              </span>
            </div>
          </div>

          <div className="text-right">
            <div className="flex items-center justify-end">
              <StarIcon className="h-5 w-5 text-yellow-500 mr-1" />
              <span className="font-medium">{salon.rating.toFixed(1)}</span>
            </div>
            <p className="text-sm text-gray-600">{salon.reviewCount} reviews</p>
          </div>
        </div>

        {/* Services */}
        {salon.services?.length > 0 && (
          <div className="mt-3 grid grid-cols-2 gap-2">
            {salon.services.slice(0, 4).map((service, index) => (
              <div key={index} className="text-sm text-gray-700">
                <span className="truncate">{service.name}</span>
                <span className="ml-2 text-gray-500">${service.price.toFixed(2)}</span>
              </div>
            ))}
          </div>
        )}

        {/* Availability and actions */}
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center text-sm text-gray-600">
            <ClockIcon className="h-4 w-4 mr-1" />
            <span>
              {salon.nextAvailable ? `Next available: ${salon.nextAvailable}` : 'Availability varies'}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <Link href={`/salon/${salon.id}`}>
              <Button size="sm">View Details</Button>
            </Link>
            <Button size="sm" variant="secondary" disabled>
              Book Now
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}