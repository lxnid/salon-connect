'use client'

import Link from 'next/link'
import { Button } from '../ui/Button'

export function Header() {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <div className="bg-black text-white w-8 h-8 rounded flex items-center justify-center font-bold">
                S
              </div>
              <span className="ml-2 text-xl font-semibold text-gray-900">
                SalonConnect
              </span>
            </Link>
          </div>
          
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/salons" className="text-gray-600 hover:text-gray-900">
              Find Salons
            </Link>
            <Link href="/how-it-works" className="text-gray-600 hover:text-gray-900">
              How it Works
            </Link>
            <Link href="/for-business" className="text-gray-600 hover:text-gray-900">
              For Business
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            <Button variant="ghost">
              Sign In
            </Button>
            <Button>
              Sign Up
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}