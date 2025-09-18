import type { Metadata } from 'next'
import SalonDetailsClient from './SalonDetailsClient'

// In static export, only the params returned here will be generated.
// Setting dynamicParams to false ensures any other param is treated as 404 (no fallback),
// which is required for `output: 'export'`.
export const dynamicParams = false

export async function generateStaticParams() {
  try {
    const rawBase =
      process.env.NEXT_PUBLIC_API_URL ||
      (process.env.NODE_ENV === 'development'
        ? 'http://localhost:5002/api'
        : 'https://salon-connect-api.onrender.com/api')

    const apiBase = /\/api\/?$/.test(rawBase) ? rawBase : `${rawBase.replace(/\/$/, '')}/api`
    // Use default caching at build time; avoid no-store which can force dynamic behavior
    const res = await fetch(`${apiBase}/salons?limit=30`)
    if (!res.ok) return []
    const json = await res.json()
    const salons = json?.data?.salons ?? json?.salons ?? []
    if (!Array.isArray(salons)) return []
    return salons
      .filter((s: any) => typeof s?.id === 'string')
      .map((s: any) => ({ id: s.id }))
  } catch {
    // If API is unreachable during CI, return no paths; with dynamicParams=false this is OK
    return []
  }
}

export const metadata: Metadata = {
  title: 'Salon Details',
  description: 'View services, stylists, reviews, and book appointments.'
}

export default function Page({ params }: { params: { id: string } }) {
  return <SalonDetailsClient id={params.id} />
}