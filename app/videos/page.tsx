'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Header } from '@/components/header'
import { Card } from '@/components/ui/card'

export default function VideosPage() {
  const [videos, setVideos] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const { data: mediaData } = await supabase
          .from('media')
          .select('*')
          .eq('type', 'youtube')
          .order('created_at', { ascending: false })

        if (mediaData) setVideos(mediaData)
      } catch (error) {
        console.error('[v0] Error fetching videos:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchVideos()
  }, [supabase])

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <p className="text-foreground/60">Loading videos...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="space-y-12">
          <div className="space-y-4">
            <h1 className="text-5xl font-bold text-foreground">Video Portfolio</h1>
            <p className="text-lg text-foreground/60">Tutorials, case studies, and project walkthroughs</p>
          </div>

          {videos.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {videos.map((video) => (
                <Card key={video.id} className="overflow-hidden group cursor-pointer hover:shadow-lg transition-shadow">
                  <div className="aspect-video bg-gradient-to-br from-primary/20 to-accent/20 overflow-hidden">
                    <iframe
                      src={`https://www.youtube.com/embed/${video.url.includes('v=') ? video.url.split('v=')[1] : video.url}`}
                      className="w-full h-full"
                      allowFullScreen
                    />
                  </div>
                  {video.title && (
                    <div className="p-4">
                      <h3 className="font-bold text-foreground">{video.title}</h3>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-foreground/60 text-lg">No videos yet</p>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-12 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-foreground/60 text-sm">
          <p>© 2024 Portfolio. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
