'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Edit, Trash2, Image as ImageIcon, Youtube, Instagram } from 'lucide-react'

export default function MediaDashboardPage() {
  const [mediaItems, setMediaItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)
  const supabase = createClient()

  useEffect(() => {
    fetchMedia()
  }, [supabase])

  const fetchMedia = async () => {
    try {
      const { data } = await supabase
        .from('media')
        .select('*')
        .order('created_at', { ascending: false })

      if (data) setMediaItems(data)
    } catch (error) {
      console.error('[v0] Error fetching media:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this media?')) return

    setDeleting(id)
    try {
      const { error } = await supabase.from('media').delete().eq('id', id)

      if (error) throw error

      setMediaItems(mediaItems.filter((m) => m.id !== id))
    } catch (error) {
      console.error('[v0] Error deleting media:', error)
      alert('Error deleting media')
    } finally {
      setDeleting(null)
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'image':
        return <ImageIcon className="w-5 h-5" />
      case 'youtube':
        return <Youtube className="w-5 h-5" />
      case 'instagram':
        return <Instagram className="w-5 h-5" />
      default:
        return <ImageIcon className="w-5 h-5" />
    }
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-foreground/60">Loading media...</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-foreground">Media</h1>
          <p className="text-foreground/60">Manage your project media (images, videos, etc.)</p>
        </div>
        <Link href="/dashboard/media/new">
          <Button>Add Media</Button>
        </Link>
      </div>

      {mediaItems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mediaItems.map((media) => (
            <Card key={media.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-video bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center relative">
                {media.type === 'image' && media.url && (
                  <img src={media.url} alt={media.title} className="w-full h-full object-cover" />
                )}
                <div className="absolute top-2 right-2 p-2 bg-background/80 rounded-lg">
                  {getTypeIcon(media.type)}
                </div>
              </div>
              <div className="p-4 space-y-3">
                <div>
                  <h3 className="font-bold text-foreground">{media.title || 'Untitled Media'}</h3>
                  <p className="text-xs text-foreground/60">{media.type}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Link href={`/dashboard/media/${media.id}`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full">
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                  </Link>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(media.id)}
                    disabled={deleting === media.id}
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
          <p className="text-foreground/60 text-lg">No media yet</p>
          <Link href="/dashboard/media/new">
            <Button>Upload Your First Media</Button>
          </Link>
        </Card>
      )}
    </div>
  )
}
