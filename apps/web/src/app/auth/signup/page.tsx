'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { authAPI } from '@/lib/api'

export default function SignUpPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phone: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // Trim and sanitize optional fields to avoid failing validators with empty strings
      const payload = {
        email: formData.email.trim(),
        password: formData.password,
        firstName: formData.firstName.trim() || undefined,
        lastName: formData.lastName.trim() || undefined,
        phone: formData.phone.trim() || undefined
      }

      const response = await authAPI.signup(payload)

      const data = (response as any)?.data?.data || (response as any)?.data || {}
      const token = data.token
      const user = data.user

      if (token && user) {
        localStorage.setItem('token', token)
        localStorage.setItem('user', JSON.stringify(user))
        router.push('/')
      } else {
        throw new Error('Unexpected response format from server')
      }
    } catch (err: any) {
      // Prefer first validation error message if available
      const validationMessage = err?.response?.data?.errors?.[0]?.msg
      const apiError = validationMessage || err?.response?.data?.error || err?.message || 'Registration failed. Please try again.'
      setError(apiError)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-md mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <Card>
          <CardHeader>
            <CardTitle>Create your account</CardTitle>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="mb-4 p-3 rounded bg-red-50 text-red-700 text-sm">{error}</div>
            )}

            {/* SSO options */}
            <div className="space-y-3">
              <button type="button" className="w-full inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium hover:bg-gray-50">
                <svg className="h-5 w-5 mr-2" viewBox="0 0 48 48">
                  <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12 s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C33.238,6.053,28.884,4,24,4C12.955,4,4,12.955,4,24 s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/>
                  <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,16.108,18.961,13,24,13c3.059,0,5.842,1.154,7.961,3.039 l5.657-5.657C33.238,6.053,28.884,4,24,4C16.318,4,9.754,8.337,6.306,14.691z"/>
                  <path fill="#4CAF50" d="M24,44c5.176,0,9.86-1.977,13.409-5.197l-6.191-5.238C29.211,35.091,26.715,36,24,36 c-5.202,0-9.619-3.317-11.283-7.946l-6.543,5.036C9.568,39.556,16.227,44,24,44z"/>
                  <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.095,5.565 c0.001-0.001,0.002-0.001,0.003-0.002l6.191,5.238C36.972,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"/>
                </svg>
                Continue with Google (coming soon)
              </button>
              <button type="button" className="w-full inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium hover:bg-gray-50">
                <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="currentColor"><path d="M16.365 1.43c-.986.058-2.16.687-2.858 1.497-.62.724-1.184 1.84-1.01 2.92 1.1.035 2.235-.627 2.9-1.45.63-.77 1.153-1.88.968-2.967zM20.325 22.57c-1.062 2.45-3.92 2.06-5.087.84-1.082-1.13-2.02-2.77-3.705-2.74-1.64.03-2.165 1.35-4.235 1.39-2.07.04-3.01-1.28-4.08-2.97 2.27-1.1 3.46-3.07 4.28-4.36.96-1.5 1.695-3.31 1.45-5.2-.25-1.93-1.72-3.28-3.71-3.36-.92-.04-1.42.19-2.12.49.46-1.33 1.28-2.58 2.3-3.48 1.24-1.07 2.83-1.91 4.5-1.86 1.03.03 2.01.35 2.8 1 1.16.94 1.39 2.11 1.46 2.64.11.83.02 1.73-.07 2.18-.17.85-.47 1.66-.86 2.43-.5.98-1.1 1.9-1.22 2.09-.06.1-1.68 2.5-1.02 5.23.08.33.36 1.45 1.3 2.34.78.75 1.72.81 1.94.82.85.07 1.58-.35 2.04-.65.56-.38.9-.78 1.16-1.09.73-.86 1.03-1.62 1.24-2.1.16-.37.44-1.1.9-1.9.47-.83 1.09-1.7 1.95-2.6.18-.19.83-.86 1.79-1.38-.05.16-1.05 3.33-2.12 5.53-.9 1.86-1.36 2.81-1.61 3.36z"/></svg>
                Continue with Apple (coming soon)
              </button>
            </div>

            {/* Divider */}
            <div className="my-6 flex items-center">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="px-3 text-xs uppercase tracking-wide text-gray-500">Or sign up with email</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <Input
                  label="First Name"
                  required
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  placeholder="Your first name"
                />

                <Input
                  label="Last Name"
                  required
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  placeholder="Your last name"
                />

                <Input
                  label="Email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="you@example.com"
                />

                <Input
                  label="Phone (optional)"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+1 555-555-5555"
                />

                <Input
                  label="Password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Choose a strong password"
                />
              </div>

              <Button type="submit" loading={loading} className="w-full">
                Create Account
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <Link href="/auth/signin" className="font-medium text-blue-600 hover:text-blue-500">
                  Sign in
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}