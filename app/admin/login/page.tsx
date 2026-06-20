'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

export default function AdminLoginPage() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const correctPassword = 'drax@12345'

    if (password === correctPassword) {
      // Store admin session in localStorage
      localStorage.setItem('admin_session', 'true')
      router.push('/admin')
    } else {
      setError('Invalid password')
      setPassword('')
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="space-y-8">
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold text-foreground">Admin Panel</h1>
            <p className="text-foreground/60">Enter password to access</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 dark:bg-red-950 dark:border-red-800 dark:text-red-200">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-foreground">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-card border border-border rounded-lg text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Enter admin password"
                autoFocus
              />
            </div>

            <Button type="submit" size="lg" disabled={loading} className="w-full">
              {loading ? 'Verifying...' : 'Access Admin Panel'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
