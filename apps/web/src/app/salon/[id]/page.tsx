import type { Metadata } from 'next'
import SalonDetailsClient from './SalonDetailsClient'

export async function generateStaticParams() {
  try {
    const rawBase =
      process.env.NEXT_PUBLIC_API_URL ||
      (process.env.NODE_ENV === 'development'
        ? 'http://localhost:5002/api'
        : 'https://salon-connect-api.onrender.com/api')

    const apiBase = /\/api\/?$/.test(rawBase) ? rawBase : `${rawBase.replace(/\/$/, '')}/api`
    const res = await fetch(`${apiBase}/salons?limit=30`, { next: { revalidate: 0 } })
    if (!res.ok) return []
    const json = await res.json()
    const salons = json?.data?.salons ?? json?.salons ?? []
    if (!Array.isArray(salons)) return []
    return salons
      .filter((s: any) => typeof s?.id === 'string')
      .map((s: any) => ({ id: s.id }))
  } catch {
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