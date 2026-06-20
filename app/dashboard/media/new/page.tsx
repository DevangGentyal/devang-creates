'use client'

import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export default function NewMediaPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [projects, setProjects] = useState<any[]>([])
  const [formData, setFormData] = useState({
    type: 'image',
    url: '',
    title: '',
    project_id: '',
    order_index: 0,
  })
  const supabase = createClient()

  useEffect(() => {
    const fetchProjects = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) return

      const { data } = await supabase
        .from('projects')
        .select('id, title')
        .eq('user_id', user.id)

      if (data) setProjects(data)
    }

    fetchProjects()
  }, [supabase])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'order_index' ? parseInt(value) : value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const submitData = {
        ...formData,
        project_id: formData.project_id || null,
      }

      const { error } = await supabase.from('media').insert(submitData)

      if (error) throw error

      router.push('/dashboard/media')
      router.refresh()
    } catch (error) {
      console.error('[v0] Error creating media:', error)
      alert('Error creating media. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-2xl space-y-8">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold text-foreground">Add Media</h1>
        <p className="text-foreground/60">Upload images, videos, or links</p>
      </div>

      <Card className="p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="type" className="block text-sm font-medium text-foreground">
              Media Type *
            </label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-card border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="image">Image</option>
              <option value="youtube">YouTube Video</option>
              <option value="instagram">Instagram Post</option>
              <option value="drive">Google Drive</option>
            </select>
          </div>

          <div className="space-y-2">
            <label htmlFor="url" className="block text-sm font-medium text-foreground">
              URL *
            </label>
            <input
              type="url"
              id="url"
              name="url"
              value={formData.url}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-card border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder={
                formData.type === 'youtube'
                  ? 'https://youtube.com/watch?v=...'
                  : formData.type === 'instagram'
                    ? 'https://instagram.com/p/...'
                    : 'https://example.com/image.jpg'
              }
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="title" className="block text-sm font-medium text-foreground">
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-card border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Optional title for this media"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="project_id" className="block text-sm font-medium text-foreground">
              Associated Project
            </label>
            <select
              id="project_id"
              name="project_id"
              value={formData.project_id}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-card border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Select a project (optional)</option>
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.title}
                </option>
              ))}
            </select>
          </div>

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

          <Button type="submit" disabled={isLoading} size="lg" className="w-full">
            {isLoading ? 'Saving...' : 'Save Media'}
          </Button>
        </form>
      </Card>
    </div>
  )
}
