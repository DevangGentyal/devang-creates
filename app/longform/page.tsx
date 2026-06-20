'use client'

import { useEffect, useRef, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Header } from '@/components/header'
import { Card } from '@/components/ui/card'

// --- Helpers -----------------------------------------------------------

// Check if a URL points directly to a playable video file
function isDirectVideoUrl(url: string | undefined | null) {
  if (!url) return false
  return /\.(mp4|webm|ogg|mov|m4v)(\?.*)?$/i.test(url)
}

// Try to pull a YouTube thumbnail from a YouTube URL
function getYouTubeThumbnail(url: string | undefined | null): string | null {
  if (!url) return null
  const patterns = [
    /youtu\.be\/([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/(?:watch\?v=|embed\/|v\/)([a-zA-Z0-9_-]{11})/,
  ]
  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match) return `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg`
  }
  return null
}

// --- Thumbnail component ------------------------------------------------

function VideoThumbnail({ video }: { video: any }) {
  const [thumbnail, setThumbnail] = useState<string | null>(video.thumbnail || null)
  const [failed, setFailed] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  const needsGeneratedThumb =
    !video.thumbnail && !failed && isDirectVideoUrl(video.url)

  useEffect(() => {
    if (video.thumbnail) {
      setThumbnail(video.thumbnail)
      return
    }

    const ytThumb = getYouTubeThumbnail(video.url)
    if (ytThumb) {
      setThumbnail(ytThumb)
      return
    }

    if (!isDirectVideoUrl(video.url)) {
      setThumbnail(null)
      return
    }

    const videoEl = videoRef.current
    if (!videoEl) return

    const handleLoadedData = () => {
      try {
        const duration = videoEl.duration
        const seekTime = duration && isFinite(duration) ? Math.min(1, duration / 2) : 0.1
        videoEl.currentTime = seekTime
      } catch (e) {
        console.error('[v0] Error seeking video for thumbnail:', e)
        setFailed(true)
      }
    }

    const handleSeeked = () => {
      try {
        const canvas = document.createElement('canvas')
        canvas.width = videoEl.videoWidth
        canvas.height = videoEl.videoHeight
        const ctx = canvas.getContext('2d')
        if (ctx && canvas.width > 0 && canvas.height > 0) {
          ctx.drawImage(videoEl, 0, 0, canvas.width, canvas.height)
          setThumbnail(canvas.toDataURL('image/jpeg', 0.8))
        }
      } catch (e) {
        console.error('[v0] Error generating thumbnail:', e)
        setFailed(true)
      }
    }

    const handleError = () => {
      setFailed(true)
    }

    videoEl.addEventListener('loadeddata', handleLoadedData)
    videoEl.addEventListener('seeked', handleSeeked)
    videoEl.addEventListener('error', handleError)

    return () => {
      videoEl.removeEventListener('loadeddata', handleLoadedData)
      videoEl.removeEventListener('seeked', handleSeeked)
      videoEl.removeEventListener('error', handleError)
    }
  }, [video])

  return (
    <>
      {thumbnail ? (
        <img
          src={thumbnail || "/placeholder.svg"}
          alt={video.title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-primary/30 to-accent/30" />
      )}

      {/* Hidden video used only to capture a frame for the thumbnail */}
      {needsGeneratedThumb && (
        <video
          ref={videoRef}
          src={video.url}
          crossOrigin="anonymous"
          muted
          playsInline
          preload="metadata"
          className="hidden"
        />
      )}
    </>
  )
}

// --- Main page ------------------------------------------------------------

export default function LongFormPage() {
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
          .eq('type', 'longform')
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
            <h1 className="text-4xl font-bold text-foreground mb-4">Long-Form Videos</h1>
            <p className="text-foreground/60">In-depth content for deeper engagement</p>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredVideos.map((video) => (
              <Card
                key={video.id}
                className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group"
                onClick={() => setSelectedVideo(video)}
              >
                <div
                  className="relative overflow-hidden"
                  style={{ aspectRatio: '16 / 9' }}
                >
                  {/* Thumbnail / preview */}
                  <VideoThumbnail video={video} />

                  {/* Play button overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100 transition-all">
                      <div className="w-0 h-0 border-y-[9px] border-y-transparent border-l-[14px] border-l-black/80 ml-1" />
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-foreground">{video.title}</h3>
                  {video.niche && <p className="text-sm text-foreground/60 mt-1">{video.niche}</p>}
                </div>
              </Card>
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
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedVideo(null)}
        >
          <div
            className="bg-background rounded-lg overflow-hidden flex flex-col w-[min(95vw,calc(80vh*16/9))] max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h2 className="text-xl font-semibold text-foreground truncate">{selectedVideo.title}</h2>
              <button
                onClick={() => setSelectedVideo(null)}
                className="text-foreground/60 hover:text-foreground transition-colors text-2xl leading-none ml-4 flex-shrink-0"
              >
                ×
              </button>
            </div>

            {/* Video Player */}
            <div className="relative w-full aspect-[16/9] bg-black">
              {isDirectVideoUrl(selectedVideo.url) ? (
                <video
                  src={selectedVideo.url}
                  className="w-full h-full object-contain"
                  controls
                  autoPlay
                  playsInline
                />
              ) : (
                <iframe
                  src={selectedVideo.url}
                  className="w-full h-full"
                  allow="autoplay; fullscreen; picture-in-picture"
                  allowFullScreen
                  title={selectedVideo.title}
                />
              )}
            </div>
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