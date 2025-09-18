import './globals.css'
import type { Metadata } from 'next'
import { SiteHeader } from '../components/layout/SiteHeader'

export const metadata: Metadata = {
  title: 'SalonConnect - Find Your Perfect Salon',
  description: 'Discover top-rated salons and barbers near you',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <SiteHeader />
        {children}
      </body>
    </html>
  )
}