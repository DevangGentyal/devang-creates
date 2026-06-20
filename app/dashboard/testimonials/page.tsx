'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Edit, Trash2 } from 'lucide-react'

export default function TestimonialsDashboardPage() {
  const [testimonials, setTestimonials] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)
  const supabase = createClient()

  useEffect(() => {
    fetchTestimonials()
  }, [supabase])

  const fetchTestimonials = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) return

      const { data } = await supabase
        .from('testimonials')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (data) setTestimonials(data)
    } catch (error) {
      console.error('[v0] Error fetching testimonials:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this testimonial?')) return

    setDeleting(id)
    try {
      const { error } = await supabase.from('testimonials').delete().eq('id', id)

      if (error) throw error

      setTestimonials(testimonials.filter((t) => t.id !== id))
    } catch (error) {
      console.error('[v0] Error deleting testimonial:', error)
      alert('Error deleting testimonial')
    } finally {
      setDeleting(null)
    }
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-foreground/60">Loading testimonials...</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-foreground">Testimonials</h1>
          <p className="text-foreground/60">Manage your testimonials and feedback</p>
        </div>
        <Link href="/dashboard/testimonials/new">
          <Button>New Testimonial</Button>
        </Link>
      </div>

      {testimonials.length > 0 ? (
        <div className="space-y-4">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-bold text-foreground">{testimonial.author_name}</h3>
                    {testimonial.featured && (
                      <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full whitespace-nowrap">
                        Featured
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-foreground/60 mb-2">{testimonial.author_title}</p>
                  <p className="text-foreground/70 line-clamp-2 italic">{testimonial.content}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Link href={`/dashboard/testimonials/${testimonial.id}`}>
                    <Button variant="outline" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                  </Link>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(testimonial.id)}
                    disabled={deleting === testimonial.id}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-12 text-center space-y-4">
          <p className="text-foreground/60 text-lg">No testimonials yet</p>
          <Link href="/dashboard/testimonials/new">
            <Button>Add Your First Testimonial</Button>
          </Link>
        </Card>
      )}
    </div>
  )
}
