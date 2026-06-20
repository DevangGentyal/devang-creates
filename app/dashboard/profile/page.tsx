'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export default function ProfilePage() {
  const [profile, setProfile] = useState<any>(null)
  const [formData, setFormData] = useState({
    full_name: '',
    bio: '',
    avatar_url: '',
    resume_url: '',
    email: '',
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const supabase = createClient()

  useEffect(() => {
    const fetchProfile = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) return

      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (data) {
        setProfile(data)
        setFormData({
          full_name: data.full_name || '',
          bio: data.bio || '',
          avatar_url: data.avatar_url || '',
          resume_url: data.resume_url || '',
          email: data.email || '',
        })
      }

      setLoading(false)
    }

    fetchProfile()
  }, [supabase])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSave = async () => {
    setSaving(true)
    setMessage('')

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) return

      const { error } = await supabase
        .from('profiles')
        .update(formData)
        .eq('id', user.id)

      if (error) throw error

      setMessage('Profile updated successfully!')
      setTimeout(() => setMessage(''), 3000)
    } catch (error) {
      console.error('[v0] Error updating profile:', error)
      setMessage('Error updating profile. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-foreground/60">Loading...</p>
      </div>
    )
  }

  return (
    <div className="max-w-2xl space-y-8">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold text-foreground">Profile Settings</h1>
        <p className="text-foreground/60">Update your public profile information</p>
      </div>

      <Card className="p-8 space-y-6">
        {message && (
          <div className={`p-4 rounded-lg ${message.includes('success') ? 'bg-green-50 text-green-800 dark:bg-green-950 dark:text-green-200' : 'bg-red-50 text-red-800 dark:bg-red-950 dark:text-red-200'}`}>
            {message}
          </div>
        )}

        <div className="space-y-2">
          <label htmlFor="full_name" className="block text-sm font-medium text-foreground">
            Full Name
          </label>
          <input
            type="text"
            id="full_name"
            name="full_name"
            value={formData.full_name}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-card border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="email" className="block text-sm font-medium text-foreground">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-card border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="bio" className="block text-sm font-medium text-foreground">
            Bio
          </label>
          <textarea
            id="bio"
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            rows={4}
            className="w-full px-4 py-2 bg-card border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            placeholder="Tell visitors about yourself..."
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="avatar_url" className="block text-sm font-medium text-foreground">
            Avatar URL
          </label>
          <input
            type="url"
            id="avatar_url"
            name="avatar_url"
            value={formData.avatar_url}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-card border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="https://example.com/avatar.jpg"
          />
          {formData.avatar_url && (
            <img
              src={formData.avatar_url}
              alt="Avatar preview"
              className="mt-2 w-24 h-24 rounded-lg object-cover"
            />
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="resume_url" className="block text-sm font-medium text-foreground">
            Resume URL
          </label>
          <input
            type="url"
            id="resume_url"
            name="resume_url"
            value={formData.resume_url}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-card border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="https://example.com/resume.pdf"
          />
        </div>

        <Button onClick={handleSave} disabled={saving} size="lg" className="w-full">
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </Card>
    </div>
  )
}
