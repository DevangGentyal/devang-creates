'use client'

import { useEffect, useRef, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Header } from '@/components/header'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

import { ShortFormCard, ModalPlayer } from '@/components/video-components'

// --- Main page ------------------------------------------------------------

export default function ShortFormPage() {
  const [videos, setVideos] = useState<any[]>([])
  const [niches, setNiches] = useState<Set<string>>(new Set())
  const [selectedNiche, setSelectedNiche] = useState<string>('All')
  const [loading, setLoading] = useState(true)
  const [selectedVideo, setSelectedVideo] = useState<any>(null)
  const supabase = createClient()

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const { data } = await supabase
          .from('videos')
          .select('*')
          .eq('type', 'shortform')
          .order('order_index')

        if (data) {
          setVideos(data)
          const nicheSet = new Set(data.map((v: any) => v.niche).filter(Boolean))
          setNiches(nicheSet)
        }
      } catch (error) {
        console.error('[v0] Error fetching videos:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchVideos()
  }, [supabase])

  const filteredVideos = selectedNiche === 'All'
    ? videos
    : videos.filter((v) => v.niche === selectedNiche)

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <p className="text-foreground/60">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-8">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-4">Short-Form Videos</h1>
            <p className="text-foreground/60">Quick, engaging content optimized for social media</p>
          </div>

          {/* Filter by Niche */}
          {niches.size > 0 && (
            <div className="space-y-4">
              <p className="text-sm font-semibold text-foreground/60 uppercase">Filter by niche</p>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedNiche('All')}
                  className={`px-4 py-2 rounded-lg transition-colors text-sm font-medium ${selectedNiche === 'All'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-primary/10 text-primary hover:bg-primary/20'
                    }`}
                >
                  All
                </button>
                {Array.from(niches).map((niche) => (
                  <button
                    key={niche}
                    onClick={() => setSelectedNiche(niche)}
                    className={`px-4 py-2 rounded-lg transition-colors text-sm font-medium ${selectedNiche === niche
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-primary/10 text-primary hover:bg-primary/20'
                      }`}
                  >
                    {niche}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Videos Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVideos.map((video) => (
              <ShortFormCard key={video.id} video={video} onClick={() => setSelectedVideo(video)} />
            ))}
          </div>

          {filteredVideos.length === 0 && (
            <div className="text-center py-12">
              <p className="text-foreground/60">No videos found in this category</p>
            </div>
          )}
        </div>
      </div>

      {/* Video Player Modal */}
      {selectedVideo && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedVideo(null)}
        >
          <div
            className="relative bg-black rounded-xl overflow-hidden aspect-[9/16] w-[min(95vw,calc(85vh*9/16))]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedVideo(null)}
              className="absolute top-3 right-3 z-10 bg-black/60 hover:bg-black/80 text-white w-10 h-10 rounded-full flex items-center justify-center text-2xl leading-none transition-colors"
            >
              ×
            </button>

            <ModalPlayer video={selectedVideo} />
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-border bg-card py-8 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-foreground/60 text-sm">
          <p>© 2024 Devang Creates. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}