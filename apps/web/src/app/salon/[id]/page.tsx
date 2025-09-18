import type { Metadata } from 'next'
import SalonDetailsClient from './SalonDetailsClient'

// In static export, only the params returned here will be generated.
// Setting dynamicParams to false ensures any other param is treated as 404 (no fallback),
// which is required for `output: 'export'`.
export const dynamicParams = false

export async function generateStaticParams() {
  // Minimal deterministic list to satisfy static export; avoids any network calls during build
  return [{ id: '1' }]
}

export const metadata: Metadata = {
  title: 'Salon Details',
  description: 'View services, stylists, reviews, and book appointments.'
}

export default function Page({ params }: { params: { id: string } }) {
  return <SalonDetailsClient id={params.id} />
}