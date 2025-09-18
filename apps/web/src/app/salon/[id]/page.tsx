import type { Metadata } from 'next'
import SalonDetailsClient from './SalonDetailsClient'

// In static export, only the params returned here will be generated.
// Setting dynamicParams to false ensures any other param is treated as 404 (no fallback),
// which is required for `output: 'export'`.
export const dynamicParams = false

export async function generateStaticParams() {
  // Try to fetch salon ids at build time so the details pages exist for the ones shown on home
  const rawBase =
    process.env.NEXT_PUBLIC_API_URL ||
    (process.env.NODE_ENV === 'development'
      ? 'http://localhost:5002/api'
      : 'https://salon-connect-api.onrender.com/api')
  const base = /\/api\/?$/.test(rawBase) ? rawBase : `${rawBase.replace(/\/$/, '')}/api`
  try {
    const res = await fetch(`${base}/salons?limit=50`)
    const json = await res.json()
    const salons = json?.data?.salons ?? json?.salons ?? []
    const ids = (Array.isArray(salons) ? salons : [])
      .map((s: any) => (s && s.id ? String(s.id) : ''))
      .filter(Boolean)
    const unique = Array.from(new Set(ids)).map((id) => ({ id }))
    if (unique.length > 0) return unique
  } catch (e) {
    // swallow and fall back to demo ids
  }
  // Fallback to demo ids to avoid 404 in demo mode
  return [{ id: 'demo-1' }, { id: 'demo-2' }]
}

export const metadata: Metadata = {
  title: 'Salon Details',
  description: 'View services, stylists, reviews, and book appointments.'
}

export default function Page({ params }: { params: { id: string } }) {
  return <SalonDetailsClient id={params.id} />
}