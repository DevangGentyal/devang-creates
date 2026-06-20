'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

interface ProjectFormProps {
  initialData?: any
  onSubmit: (data: any) => Promise<void>
  isLoading?: boolean
}

export function ProjectForm({ initialData, onSubmit, isLoading = false }: ProjectFormProps) {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    slug: initialData?.slug || '',
    description: initialData?.description || '',
    problem: initialData?.problem || '',
    solution: initialData?.solution || '',
    architecture: initialData?.architecture || '',
    thumbnail: initialData?.thumbnail || '',
    github_url: initialData?.github_url || '',
    live_url: initialData?.live_url || '',
    category: initialData?.category || '',
    technologies: initialData?.technologies?.join(', ') || '',
    featured: initialData?.featured || false,
    order_index: initialData?.order_index || 0,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as any
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? !prev[name] : value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const submitData = {
      ...formData,
      technologies: formData.technologies
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
    }
    await onSubmit(submitData)
  }

  return (
    <Card className="p-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label htmlFor="title" className="block text-sm font-medium text-foreground">
              Project Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-card border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="slug" className="block text-sm font-medium text-foreground">
              URL Slug *
            </label>
            <input
              type="text"
              id="slug"
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-card border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="my-project"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="description" className="block text-sm font-medium text-foreground">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            className="w-full px-4 py-2 bg-card border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label htmlFor="category" className="block text-sm font-medium text-foreground">
              Category
            </label>
            <input
              type="text"
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-card border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="e.g., Web App, Design"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="technologies" className="block text-sm font-medium text-foreground">
              Technologies (comma-separated)
            </label>
            <input
              type="text"
              id="technologies"
              name="technologies"
              value={formData.technologies}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-card border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="React, Next.js, Tailwind CSS"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="problem" className="block text-sm font-medium text-foreground">
            Problem
          </label>
          <textarea
            id="problem"
            name="problem"
            value={formData.problem}
            onChange={handleChange}
            rows={3}
            className="w-full px-4 py-2 bg-card border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="solution" className="block text-sm font-medium text-foreground">
            Solution
          </label>
          <textarea
            id="solution"
            name="solution"
            value={formData.solution}
            onChange={handleChange}
            rows={3}
            className="w-full px-4 py-2 bg-card border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="architecture" className="block text-sm font-medium text-foreground">
            Architecture & Implementation
          </label>
          <textarea
            id="architecture"
            name="architecture"
            value={formData.architecture}
            onChange={handleChange}
            rows={3}
            className="w-full px-4 py-2 bg-card border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label htmlFor="thumbnail" className="block text-sm font-medium text-foreground">
              Thumbnail URL
            </label>
            <input
              type="url"
              id="thumbnail"
              name="thumbnail"
              value={formData.thumbnail}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-card border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="github_url" className="block text-sm font-medium text-foreground">
              GitHub URL
            </label>
            <input
              type="url"
              id="github_url"
              name="github_url"
              value={formData.github_url}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-card border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="live_url" className="block text-sm font-medium text-foreground">
            Live Project URL
          </label>
          <input
            type="url"
            id="live_url"
            name="live_url"
            value={formData.live_url}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-card border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
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
              <span className="text-sm font-medium text-foreground">Featured Project</span>
            </label>
          </div>
        </div>

        <Button type="submit" disabled={isLoading} size="lg" className="w-full">
          {isLoading ? 'Saving...' : 'Save Project'}
        </Button>
      </form>
    </Card>
  )
}
