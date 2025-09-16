'use client'

import { useEffect, useState } from 'react'
import { salonAPI } from '@/lib/api'
import { SalonCard } from '@/components/SalonCard'
// Header removed; provided by RootLayout

export default function TestPage() {
  const [salons, setSalons] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchSalons = async () => {
      try {
        setLoading(true)
        const response = await salonAPI.searchSalons({})
        const salonsData = (response as any)?.data?.data?.salons ?? (response as any)?.data?.salons ?? []
        setSalons(Array.isArray(salonsData) ? salonsData : [])
      } catch (err) {
        setError('Failed to fetch salons')
        console.error('Error fetching salons:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchSalons()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header removed; provided by RootLayout */}
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            API Integration Test
          </h1>
          <p className="text-gray-600">
            This page tests the integration between frontend and backend API.
          </p>
        </div>

        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading salons...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {!loading && !error && (
          <>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Salons from API
              </h2>
              <p className="text-gray-600">
                {salons.length} salon(s) loaded from the backend
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {salons.map((salon: any) => (
                <SalonCard key={salon.id} salon={salon} />
              ))}
            </div>
          </>
        )}

        {!loading && salons.length === 0 && !error && (
          <div className="text-center py-12">
            <p className="text-gray-600">No salons found.</p>
          </div>
        )}
      </div>
    </div>
  )
}