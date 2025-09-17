'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { salonAPI } from '@/lib/api'

interface Service {
  id: string
  name: string
  duration: number
  price: number
  description?: string
}

interface StylistUser {
  firstName?: string
  lastName?: string
  avatar?: string
}

interface Stylist {
  id: string
  user?: StylistUser
  experience?: number
  specialties?: string[]
}

interface SalonDetails {
  id: string
  name: string
  address: string
  phone?: string
  services: Service[]
  stylists: Stylist[]
}

type Step = 1 | 2 | 3 | 4

export default function BookingWizardPage() {
  const router = useRouter()
  const params = useSearchParams()
  const salonId = params.get('salonId') || ''

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [salon, setSalon] = useState<SalonDetails | null>(null)

  const [step, setStep] = useState<Step>(1)
  const [selectedServiceIds, setSelectedServiceIds] = useState<string[]>([])
  const [selectedStylistId, setSelectedStylistId] = useState<string>('')
  const [datetime, setDatetime] = useState<string>('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    const fetchSalon = async () => {
      if (!salonId) {
        setError('Missing salonId in the URL')
        setLoading(false)
        return
      }
      try {
        setLoading(true)
        const res = await salonAPI.getSalon(salonId)
        const data = (res as any)?.data?.data ?? (res as any)?.data
        setSalon(data as SalonDetails)
      } catch (e) {
        console.error('Failed to load salon', e)
        setError('Failed to load salon. Please try again.')
      } finally {
        setLoading(false)
      }
    }
    fetchSalon()
  }, [salonId])

  const canProceed = useMemo(() => {
    if (step === 1) return selectedServiceIds.length > 0
    if (step === 2) return !!selectedStylistId
    if (step === 3) return !!datetime
    return true
  }, [step, selectedServiceIds, selectedStylistId, datetime])

  const totalPrice = useMemo(() => {
    if (!salon) return 0
    const map = new Map(salon.services.map(s => [s.id, s.price]))
    return selectedServiceIds.reduce((sum, id) => sum + (map.get(id) || 0), 0)
  }, [salon, selectedServiceIds])

  const onToggleService = (id: string) => {
    setSelectedServiceIds(prev => prev.includes(id) ? prev.filter(sid => sid !== id) : [...prev, id])
  }

  const onConfirm = async () => {
    setSubmitting(true)
    try {
      // Placeholder submit; backend integration to be implemented
      await new Promise(res => setTimeout(res, 600))
      setSubmitted(true)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Book an appointment</h1>
          <Link href={salon ? `/salon/${salon.id}` : '/'} className="text-blue-600 hover:text-blue-800">Back to salon</Link>
        </div>

        {loading && (
          <div className="text-gray-600">Loading salon info...</div>
        )}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">{error}</div>
        )}

        {!loading && !error && salon && (
          <div className="space-y-6">
            {/* Progress */}
            <div className="flex items-center justify-between text-sm">
              {[1,2,3,4].map((s) => (
                <div key={s} className={`flex-1 flex items-center ${s < 4 ? 'pr-2' : ''}`}>
                  <div className={`flex items-center justify-center h-8 w-8 rounded-full border ${step >= (s as Step) ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-300'}`}>{s}</div>
                  {s < 4 && <div className={`flex-1 h-0.5 mx-2 ${step > (s as Step) ? 'bg-blue-600' : 'bg-gray-200'}`}></div>}
                </div>
              ))}
            </div>

            {/* Step content */}
            {step === 1 && (
              <Card>
                <CardHeader>
                  <CardTitle>Select services</CardTitle>
                </CardHeader>
                <CardContent>
                  {salon.services && salon.services.length ? (
                    <div className="divide-y divide-gray-100">
                      {salon.services.map((svc) => (
                        <label key={svc.id} className="flex items-center gap-4 py-3 cursor-pointer">
                          <input
                            type="checkbox"
                            className="h-4 w-4"
                            checked={selectedServiceIds.includes(svc.id)}
                            onChange={() => onToggleService(svc.id)}
                          />
                          <div className="flex-1">
                            <div className="font-medium text-gray-900">{svc.name}</div>
                            <div className="text-sm text-gray-600">{svc.duration} min</div>
                          </div>
                          <div className="text-gray-900 font-medium">${'{'}svc.price.toFixed(2){'}'}</div>
                        </label>
                      ))}
                    </div>
                  ) : (
                    <div className="text-gray-600">No services available.</div>
                  )}
                </CardContent>
              </Card>
            )}

            {step === 2 && (
              <Card>
                <CardHeader>
                  <CardTitle>Choose a stylist</CardTitle>
                </CardHeader>
                <CardContent>
                  {salon.stylists && salon.stylists.length ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {salon.stylists.map((sty) => {
                        const name = [sty.user?.firstName, sty.user?.lastName].filter(Boolean).join(' ') || 'Stylist'
                        return (
                          <label key={sty.id} className={`border rounded-lg p-4 cursor-pointer ${selectedStylistId === sty.id ? 'border-blue-600 ring-1 ring-blue-600' : 'border-gray-200 hover:border-gray-300'}`}>
                            <input
                              type="radio"
                              name="stylist"
                              className="sr-only"
                              checked={selectedStylistId === sty.id}
                              onChange={() => setSelectedStylistId(sty.id)}
                            />
                            <div className="font-medium text-gray-900">{name}</div>
                            {sty.specialties && sty.specialties.length > 0 && (
                              <div className="mt-1 text-sm text-gray-600">{sty.specialties.join(', ')}</div>
                            )}
                          </label>
                        )
                      })}
                    </div>
                  ) : (
                    <div className="text-gray-600">No stylists listed. Please go back and pick another salon.</div>
                  )}
                </CardContent>
              </Card>
            )}

            {step === 3 && (
              <Card>
                <CardHeader>
                  <CardTitle>Pick date & time</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">When would you like to come?</label>
                    <input
                      type="datetime-local"
                      value={datetime}
                      onChange={(e) => setDatetime(e.target.value)}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                      min={new Date(Date.now() + 15 * 60 * 1000).toISOString().slice(0,16)}
                      required
                    />
                    <p className="text-xs text-gray-500">We will validate availability during confirmation.</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {step === 4 && (
              <Card>
                <CardHeader>
                  <CardTitle>Review & confirm</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="text-gray-700"><span className="font-medium">Salon:</span> {salon.name}</div>
                    <div className="text-gray-700">
                      <div className="font-medium">Services:</div>
                      <ul className="list-disc ml-5 text-gray-700">
                        {selectedServiceIds.map(id => {
                          const svc = salon.services.find(s => s.id === id)
                          if (!svc) return null
                          return <li key={id}>{svc.name} — ${'{'}svc.price.toFixed(2){'}'}</li>
                        })}
                      </ul>
                    </div>
                    <div className="text-gray-700">
                      <span className="font-medium">Stylist:</span>{' '}
                      {(() => {
                        const sty = salon.stylists.find(s => s.id === selectedStylistId)
                        const name = [sty?.user?.firstName, sty?.user?.lastName].filter(Boolean).join(' ') || 'Stylist'
                        return name
                      })()}
                    </div>
                    <div className="text-gray-700"><span className="font-medium">Date & time:</span> {datetime ? new Date(datetime).toLocaleString() : ''}</div>
                    <div className="text-gray-900 font-semibold">Total: ${'{'}totalPrice.toFixed(2){'}'}</div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Navigation */}
            <div className="flex items-center justify-between">
              <Button
                variant="secondary"
                onClick={() => setStep(prev => (prev > 1 ? ((prev - 1) as Step) : prev))}
                disabled={step === 1 || submitting}
              >
                Back
              </Button>
              {step < 4 ? (
                <Button
                  onClick={() => setStep(prev => (prev < 4 ? ((prev + 1) as Step) : prev))}
                  disabled={!canProceed}
                >
                  Next
                </Button>
              ) : (
                <Button onClick={onConfirm} loading={submitting}>
                  Confirm Booking
                </Button>
              )}
            </div>

            {submitted && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-green-800">
                Booking data captured. Submission to backend will be wired up next.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}