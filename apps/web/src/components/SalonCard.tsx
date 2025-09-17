'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
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
  const router = useRouter()
  const imageUrl = salon.images?.[0] || '/placeholder.jpg'

  const prices = Array.isArray(salon.services) && salon.services.length > 0
    ? salon.services.map((s) => s.price).filter((p) => typeof p === 'number')
    : []
  const minPrice = prices.length ? Math.min(...prices) : undefined
  const maxPrice = prices.length ? Math.max(...prices) : undefined

  const next = salon.nextAvailable ? new Date(salon.nextAvailable) : null
  const now = new Date()
  const isSameDay = next &&
    next.getFullYear() === now.getFullYear() &&
    next.getMonth() === now.getMonth() &&
    next.getDate() === now.getDate()

  const nextSlotText = next
    ? next.toLocaleString(undefined, {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit'
      })
    : 'Check details'

  return (
    <Card
      className="group overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 cursor-pointer"
      onClick={() => router.push(`/salon/${salon.id}`)}
      role="link"
      aria-label={`View details for ${salon.name}`}
    >
      {/* Image */}
      <div className="relative h-48">
        <Image
          src={imageUrl}
          alt={`${salon.name} image`
}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
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

        {/* Availability status (compact) */}
        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center text-sm">
            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${isSameDay ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-700'}`}>
              <ClockIcon className="h-3.5 w-3.5 mr-1" />
              {isSameDay ? 'Available today' : 'See availability'}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <Link href={`/salon/${salon.id}`} onClick={(e) => e.stopPropagation()}>
              <Button size="sm">View Details</Button>
            </Link>
          </div>
        </div>

        {/* Hover-reveal: pricing summary + next slot */}
        <div className="transition-all duration-300 overflow-hidden max-h-0 group-hover:max-h-40">
          <div className="mt-3 p-3 rounded-lg border bg-gray-50">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <p className="text-xs uppercase tracking-wide text-gray-500">Price range</p>
                <p className="text-sm text-gray-800 mt-0.5">
                  {minPrice !== undefined && maxPrice !== undefined
                    ? `$${minPrice.toFixed(0)} - $${maxPrice.toFixed(0)}`
                    : 'See services'}
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-gray-500">Next slot</p>
                <p className="text-sm text-gray-800 mt-0.5">{nextSlotText}</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}