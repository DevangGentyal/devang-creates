'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export default function NewTestimonialPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    author_name: '',
    author_title: '',
    author_image: '',
    content: '',
    featured: false,
    order_index: 0,
  })
  const supabase = createClient()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as any
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? !prev[name] : value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) throw new Error('Not authenticated')

      const { error } = await supabase.from('testimonials').insert({
        ...formData,
        user_id: user.id,
      })

      if (error) throw error

      router.push('/dashboard/testimonials')
      router.refresh()
    } catch (error) {
      console.error('[v0] Error creating testimonial:', error)
      alert('Error creating testimonial. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-2xl space-y-8">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold text-foreground">Add Testimonial</h1>
        <p className="text-foreground/60">Share feedback from a client or collaborator</p>
      </div>

      <Card className="p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="author_name" className="block text-sm font-medium text-foreground">
              Author Name *
            </label>
            <input
              type="text"
              id="author_name"
              name="author_name"
              value={formData.author_name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-card border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="author_title" className="block text-sm font-medium text-foreground">
              Author Title/Company
            </label>
            <input
              type="text"
              id="author_title"
              name="author_title"
              value={formData.author_title}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-card border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="e.g., CEO at Company"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="author_image" className="block text-sm font-medium text-foreground">
              Author Image URL
            </label>
            <input
              type="url"
              id="author_image"
              name="author_image"
              value={formData.author_image}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-card border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="https://example.com/image.jpg"
            />
            {formData.author_image && (
              <img
                src={formData.author_image}
                alt="Author preview"
                className="mt-2 w-16 h-16 rounded-full object-cover"
              />
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="content" className="block text-sm font-medium text-foreground">
              Testimonial *
            </label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              required
              rows={5}
              className="w-full px-4 py-2 bg-card border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              placeholder="What would you like to say?"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="order_index" className="block text-sm font-medium text-foreground">
                Display Order
              </label>
              <input
                type="number"
                id="order_index"
                name="order_index"
                value={formData.order_index}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-card border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="flex items-end">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleChange}
                  className="w-4 h-4 rounded border-border"
                />
                <span className="text-sm font-medium text-foreground">Featured</span>
              </label>
            </div>
          </div>

          <Button type="submit" disabled={isLoading} size="lg" className="w-full">
            {isLoading ? 'Saving...' : 'Save Testimonial'}
          </Button>
        </form>
      </Card>
    </div>
  )
}
