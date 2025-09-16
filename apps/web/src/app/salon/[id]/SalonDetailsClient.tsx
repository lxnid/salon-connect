'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { salonAPI } from '@/lib/api'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { ArrowLeftIcon, MapPinIcon, PhoneIcon, StarIcon, ClockIcon } from '@heroicons/react/24/solid'

interface Service {
  id: string
  name: string
  description?: string
  duration: number
  price: number
  category?: string
}

interface Stylist {
  id: string
  bio?: string
  experience?: number
  specialties?: string[]
  user?: {
    firstName?: string
    lastName?: string
    avatar?: string
  }
  schedules?: Array<{
    dayOfWeek: number
    startTime: string
    endTime: string
    isAvailable: boolean
  }>
}

interface Review {
  rating: number
  comment?: string | null
  createdAt?: string
  customer?: {
    firstName?: string
    lastName?: string
    avatar?: string
  }
}

interface SalonDetails {
  id: string
  name: string
  description?: string
  address: string
  city?: string
  state?: string
  phone?: string
  images: string[]
  latitude?: number | null
  longitude?: number | null
  rating?: number
  reviewCount?: number
  services: Service[]
  stylists: Stylist[]
  reviews: Review[]
}

function Rating({ value = 0, size = 18 }: { value?: number; size?: number }) {
  const fullStars = Math.floor(value)
  const half = value - fullStars >= 0.5
  const empty = 5 - fullStars - (half ? 1 : 0)
  return (
    <div className="flex items-center">
      {Array.from({ length: fullStars }).map((_, i) => (
        <StarIcon key={`f-${i}`} className="text-yellow-400" style={{ width: size, height: size }} />
      ))}
      {half && (
        <StarIcon key="half" className="text-yellow-300 opacity-70" style={{ width: size, height: size }} />
      )}
      {Array.from({ length: empty }).map((_, i) => (
        <StarIcon key={`e-${i}`} className="text-gray-300" style={{ width: size, height: size }} />
      ))}
    </div>
  )
}

export default function SalonDetailsClient({ id }: { id: string }) {
  const router = useRouter()

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>("")
  const [salon, setSalon] = useState<SalonDetails | null>(null)

  useEffect(() => {
    const fetchSalon = async () => {
      if (!id) return
      try {
        setLoading(true)
        setError("")
        const res = await salonAPI.getSalon(id)
        const salonData = (res as any)?.data?.data ?? (res as any)?.data
        setSalon(salonData as SalonDetails)
      } catch (err: any) {
        console.error("Failed to fetch salon:", err)
        setError("Failed to load salon details. Please try again.")
      } finally {
        setLoading(false)
      }
    }
    fetchSalon()
  }, [id])

  const title = useMemo(() => (salon?.name ? `${salon.name} • Salon` : "Salon Details"), [salon?.name])

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Back */}
        <button onClick={() => router.back()} className="inline-flex items-center text-gray-700 hover:text-gray-900">
          <ArrowLeftIcon className="h-5 w-5 mr-2" /> Back
        </button>

        {/* Heading */}
        <div className="mt-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
          {salon?.id && (
            <Link href={`/bookings?salonId=${salon.id}`}>
              <Button>Book Now</Button>
            </Link>
          )}
        </div>

        {/* Error */}
        {error && (
          <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">{error}</div>
        )}

        {/* Content */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Gallery + About + Services */}
          <div className="lg:col-span-2 space-y-6">
            {/* Gallery */}
            <Card>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {(salon?.images?.length ? salon.images : [
                    "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=1470&auto=format&fit=crop",
                    "https://images.unsplash.com/photo-1582092728068-9f5250c8d7bf?q=80&w=1469&auto=format&fit=crop"
                  ]).slice(0, 4).map((src, idx) => (
                    <div key={idx} className="relative w-full h-56 rounded-lg overflow-hidden bg-gray-100">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={src} alt={`Salon image ${idx + 1}`} className="object-cover w-full h-full" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* About */}
            <Card>
              <CardContent>
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-2xl font-semibold text-gray-900">{salon?.name ?? "Loading..."}</h2>
                    <div className="mt-2 flex items-center text-gray-600">
                      <Rating value={salon?.rating ?? 0} />
                      <span className="ml-2 text-sm">{salon?.rating ?? 0} ({salon?.reviewCount ?? 0} reviews)</span>
                    </div>
                    <div className="mt-3 flex items-center text-gray-700">
                      <MapPinIcon className="h-5 w-5 mr-2" />
                      <span>{salon?.address}{salon?.city ? `, ${salon.city}` : ""}{salon?.state ? `, ${salon.state}` : ""}</span>
                    </div>
                    {salon?.phone && (
                      <div className="mt-2 flex items-center text-gray-700">
                        <PhoneIcon className="h-5 w-5 mr-2" />
                        <span>{salon.phone}</span>
                      </div>
                    )}
                  </div>
                </div>
                {salon?.description && (
                  <p className="mt-4 text-gray-700 leading-relaxed">{salon.description}</p>
                )}
              </CardContent>
            </Card>

            {/* Services */}
            <Card>
              <CardContent>
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-gray-900">Services</h3>
                  {salon?.id && (
                    <Link href={`/bookings?salonId=${salon.id}`}>
                      <Button size="sm">Start Booking</Button>
                    </Link>
                  )}
                </div>
                {loading ? (
                  <div className="mt-4 text-gray-600">Loading services...</div>
                ) : (
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    {salon?.services?.length ? (
                      salon.services.map((svc) => (
                        <div key={svc.id} className="p-4 border rounded-lg bg-white">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-medium text-gray-900">{svc.name}</div>
                              {svc.description && (
                                <div className="text-sm text-gray-600 mt-1 line-clamp-2">{svc.description}</div>
                              )}
                              {typeof svc.duration === "number" && (
                                <div className="mt-1 text-xs text-gray-500 flex items-center">
                                  <ClockIcon className="h-4 w-4 mr-1" /> {svc.duration} min
                                </div>
                              )}
                            </div>
                            <div className="text-right">
                              <div className="text-blue-600 font-semibold">${svc.price.toFixed(2)}</div>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-gray-600">No services listed.</div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Reviews */}
            <Card>
              <CardContent>
                <h3 className="text-xl font-semibold text-gray-900">Recent Reviews</h3>
                {loading ? (
                  <div className="mt-4 text-gray-600">Loading reviews...</div>
                ) : salon?.reviews?.length ? (
                  <div className="mt-4 space-y-4">
                    {salon.reviews.map((rev, idx) => (
                      <div key={idx} className="border rounded-lg p-4 bg-white">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="h-10 w-10 rounded-full bg-gray-200 overflow-hidden mr-3">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={rev.customer?.avatar || "https://api.dicebear.com/7.x/initials/svg?seed=User"}
                                alt="avatar"
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">
                                {rev.customer?.firstName || "Anonymous"} {rev.customer?.lastName || ""}
                              </div>
                              <div className="text-xs text-gray-500">{rev.createdAt ? new Date(rev.createdAt).toLocaleDateString() : ""}</div>
                            </div>
                          </div>
                          <Rating value={rev.rating} />
                        </div>
                        {rev.comment && <p className="mt-3 text-gray-700">{rev.comment}</p>}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="mt-4 text-gray-600">No reviews yet.</div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right: Stylists & Info */}
          <div className="space-y-6">
            <Card>
              <CardContent>
                <h3 className="text-xl font-semibold text-gray-900">Stylists</h3>
                {loading ? (
                  <div className="mt-4 text-gray-600">Loading stylists...</div>
                ) : salon?.stylists?.length ? (
                  <div className="mt-4 space-y-4">
                    {salon.stylists.map((sty) => (
                      <div key={sty.id} className="flex items-start space-x-3 p-3 border rounded-lg bg-white">
                        <div className="h-12 w-12 rounded-full bg-gray-200 overflow-hidden">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={sty.user?.avatar || "https://api.dicebear.com/7.x/initials/svg?seed=Stylist"}
                            alt="avatar"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">
                            {sty.user?.firstName} {sty.user?.lastName}
                          </div>
                          {sty.specialties?.length ? (
                            <div className="text-sm text-gray-600 mt-1">Specialties: {sty.specialties.join(", ")}</div>
                          ) : null}
                          {typeof sty.experience === "number" && (
                            <div className="text-sm text-gray-500">{sty.experience} yrs experience</div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="mt-4 text-gray-600">No stylists listed.</div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <h3 className="text-xl font-semibold text-gray-900">Location</h3>
                <div className="mt-3 text-gray-700 flex items-start">
                  <MapPinIcon className="h-5 w-5 mr-2 mt-0.5" />
                  <div>
                    <div>{salon?.address}</div>
                    {(salon?.city || salon?.state) && (
                      <div className="text-sm text-gray-600">{[salon?.city, salon?.state].filter(Boolean).join(", ")}</div>
                    )}
                  </div>
                </div>
                {/* Map placeholder */}
                <div className="mt-4 h-40 bg-gray-200 rounded-md flex items-center justify-center text-gray-600 text-sm">
                  Map preview coming soon
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}