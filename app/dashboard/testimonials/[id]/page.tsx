'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export default function EditTestimonialPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string
  const [testimonial, setTestimonial] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    author_name: '',
    author_title: '',
    author_image: '',
    content: '',
    featured: false,
    order_index: 0,
  })
  const supabase = createClient()

  useEffect(() => {
    const fetchTestimonial = async () => {
      try {
        const { data } = await supabase
          .from('testimonials')
          .select('*')
          .eq('id', id)
          .single()

        if (data) {
          setTestimonial(data)
          setFormData({
            author_name: data.author_name || '',
            author_title: data.author_title || '',
            author_image: data.author_image || '',
            content: data.content || '',
            featured: data.featured || false,
            order_index: data.order_index || 0,
          })
        }
      } catch (error) {
        console.error('[v0] Error fetching testimonial:', error)
      } finally {
        setLoading(false)
      }
    }

    if (id) fetchTestimonial()
  }, [id, supabase])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as any
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? !prev[name] : value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const { error } = await supabase
        .from('testimonials')
        .update(formData)
        .eq('id', id)

      if (error) throw error

      router.push('/dashboard/testimonials')
      router.refresh()
    } catch (error) {
      console.error('[v0] Error updating testimonial:', error)
      alert('Error updating testimonial. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-foreground/60">Loading testimonial...</p>
      </div>
    )
  }

  if (!testimonial) {
    return (
      <div className="text-center py-12">
        <p className="text-foreground/60">Testimonial not found</p>
      </div>
    )
  }

  return (
    <div className="max-w-2xl space-y-8">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold text-foreground">Edit Testimonial</h1>
        <p className="text-foreground/60">Update testimonial from {testimonial.author_name}</p>
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

          <Button type="submit" disabled={isSubmitting} size="lg" className="w-full">
            {isSubmitting ? 'Saving...' : 'Save Testimonial'}
          </Button>
        </form>
      </Card>
    </div>
  )
}
