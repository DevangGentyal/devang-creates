'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Header } from '@/components/header'
import { Button } from '@/components/ui/button'
import { Instagram, Youtube, Twitter, Linkedin } from 'lucide-react'

const PLACEHOLDER_SHOWREEL_URL =
  'https://www.youtube.com/embed/GpIueatow8U?si=tSN0x6ry04H4OHVy'

// --- Helpers -----------------------------------------------------------

function isDirectVideoUrl(url: string | undefined | null) {
  if (!url) return false
  return /\.(mp4|webm|ogg|mov|m4v)(\?.*)?$/i.test(url)
}
function getYouTubeVideoId(url: string): string | null {
  try {
    const u = new URL(url)

    // youtube.com/watch?v=
    const watchId = u.searchParams.get('v')
    if (watchId) return watchId

    // youtube.com/shorts/
    const shortsMatch = u.pathname.match(/\/shorts\/([a-zA-Z0-9_-]{11})/)
    if (shortsMatch) return shortsMatch[1]

    // youtube.com/embed/
    const embedMatch = u.pathname.match(/\/embed\/([a-zA-Z0-9_-]{11})/)
    if (embedMatch) return embedMatch[1]

    // youtu.be/
    const shortMatch = u.pathname.match(/^\/([a-zA-Z0-9_-]{11})/)
    if (shortMatch) return shortMatch[1]

    return null
  } catch {
    return null
  }
}
function getYouTubeThumbnail(url: string | undefined | null): string | null {
  if (!url) return null

  const videoId = getYouTubeVideoId(url)

  if (!videoId) return null

  return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
}

function normalizeYouTubeUrl(url: string): string {
  const videoId = getYouTubeVideoId(url)

  if (!videoId) return url

  return `https://www.youtube.com/embed/${videoId}`
}
/**
 * Converts any Google Drive share/view URL into an embeddable preview URL.
 * Appends ?rm=minimal to hide Drive's UI chrome inside the preview player.
 */
function getDriveEmbedUrl(url: string): string | null {
  if (!url.includes('drive.google.com')) return null

  let fileId: string | null = null

  const fileMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/)
  if (fileMatch) fileId = fileMatch[1]

  if (!fileId) {
    const idMatch = url.match(/[?&]id=([a-zA-Z0-9_-]+)/)
    if (idMatch) fileId = idMatch[1]
  }

  if (!fileId) return null

  // rm=minimal hides Drive toolbar; embedded=true signals embed context
  return `https://drive.google.com/file/d/${fileId}/preview?rm=minimal`
}

/**
 * Builds a clean YouTube embed URL with:
 * - autoplay=1, mute per caller
 * - controls=0 to hide the bottom bar
 * - rel=0, showinfo=0, iv_load_policy=3, modestbranding=1 to strip overlays
 * - loop=1 + playlist=VIDEO_ID for looping without controls
 */
function buildYouTubeEmbedUrl(url: string, muted: boolean): string {
  try {
    const u = new URL(normalizeYouTubeUrl(url))
    // Extract video id for loop playlist trick
    const vidId = getYouTubeVideoId(url)

    u.searchParams.set('autoplay', '1')
    u.searchParams.set('mute', muted ? '1' : '0')
    u.searchParams.set('controls', '0')         // hide control bar
    u.searchParams.set('rel', '0')              // no related videos
    u.searchParams.set('showinfo', '0')         // legacy but still helps
    u.searchParams.set('iv_load_policy', '3')   // hide annotations
    u.searchParams.set('modestbranding', '1')   // minimal branding
    u.searchParams.set('disablekb', '1')        // disable keyboard shortcuts
    u.searchParams.set('fs', '0')               // hide fullscreen button (cards only)
    u.searchParams.set('loop', '1')
    if (vidId) u.searchParams.set('playlist', vidId) // required for loop
    return u.toString()
  } catch {
    return url
  }
}

/**
 * Returns the correct embed URL for any video source used in CARDS (muted preview).
 * Drive → /preview?rm=minimal
 * YouTube → clean embed with all overlays stripped
 */
function getCardEmbedUrl(url: string): string {
  const driveUrl = getDriveEmbedUrl(url)
  if (driveUrl) return driveUrl
  return buildYouTubeEmbedUrl(url, true)
}

/**
 * Returns the embed URL for the MODAL (unmuted, with controls).
 * Drive → /preview (can't force unmute; Drive handles its own audio)
 * YouTube → autoplay, unmuted, with controls
 */
function getModalEmbedUrl(url: string): string {
  const driveUrl = getDriveEmbedUrl(url)
  if (driveUrl) return driveUrl

  try {
    const u = new URL(normalizeYouTubeUrl(url))
    u.searchParams.set('autoplay', '1')
    u.searchParams.set('mute', '0')
    u.searchParams.set('rel', '0')
    u.searchParams.set('modestbranding', '1')
    u.searchParams.set('iv_load_policy', '3')
    // Keep controls=1 in modal so user can seek/pause
    u.searchParams.delete('controls')
    return u.toString()
  } catch {
    return url
  }
}

/**
 * Showreel embed: autoplay, unmuted, with full controls.
 * For YouTube we allow the title bar since it's the hero player.
 */
function getShowreelEmbedUrl(url: string): string {
  if (isDirectVideoUrl(url)) return url
  const driveUrl = getDriveEmbedUrl(url)
  if (driveUrl) return driveUrl

  try {
    const u = new URL(normalizeYouTubeUrl(url))
    u.searchParams.set('autoplay', '1')
    u.searchParams.set('mute', '0')
    u.searchParams.set('rel', '0')
    u.searchParams.set('iv_load_policy', '3')
    u.searchParams.set('modestbranding', '1')
    return u.toString()
  } catch {
    return url
  }
}

// --- Thumbnail (for static thumbnails only, not used in live cards) ----

function VideoThumbnail({ video }: { video: any }) {
  const [thumbnail, setThumbnail] = useState<string | null>(video.thumbnail || null)
  const [failed, setFailed] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  const needsGeneratedThumb =
    !video.thumbnail && !failed && isDirectVideoUrl(video.url)

  useEffect(() => {
    if (video.thumbnail) { setThumbnail(video.thumbnail); return }
    const ytThumb = getYouTubeThumbnail(video.url)
    if (ytThumb) { setThumbnail(ytThumb); return }
    if (!isDirectVideoUrl(video.url)) { setThumbnail(null); return }

    const videoEl = videoRef.current
    if (!videoEl) return

    const handleLoadedData = () => {
      try {
        const duration = videoEl.duration
        const seekTime = duration && isFinite(duration) ? Math.min(1, duration / 2) : 0.1
        videoEl.currentTime = seekTime
      } catch (e) {
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
        setFailed(true)
      }
    }
    const handleError = () => setFailed(true)

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
        <img src={thumbnail || '/placeholder.svg'} alt={video.title} loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-primary/30 to-accent/30" />
      )}
      {needsGeneratedThumb && (
        <video ref={videoRef} src={video.url} crossOrigin="anonymous"
          muted playsInline preload="metadata" className="hidden" />
      )}
    </>
  )
}

// --- Card components ------------------------------------------------------

/**
 * For iframe cards we scale the iframe to 150% and translate it back so the
 * Drive/YouTube player UI chrome (which lives outside the video area) is
 * clipped by the parent's overflow:hidden. This is the only reliable
 * cross-origin way to hide Drive's player controls without JS access.
 */
function IframeCard({
  url,
  ratio,
}: {
  url: string
  ratio: '9/16' | '16/9'
}) {
  const isDrive = url.includes('drive.google.com')
  // Drive needs more zoom to hide its internal chrome bar (~40px top/bottom)
  const scale = isDrive ? 1.18 : 1.0

  return (
    <div
      className="absolute inset-0 overflow-hidden"
      // Extra isolation so the scaled iframe doesn't bleed
      style={{ borderRadius: 'inherit' }}
    >
      <iframe
        src={url}
        // Scale up then pull back to center so chrome is clipped
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: `${100 * scale}%`,
          height: `${100 * scale}%`,
          transform: `translate(-50%, -50%) scale(1)`,
          border: 'none',
          pointerEvents: 'none',
        }}
        allow="autoplay; encrypted-media"
      // No allowFullScreen on cards — prevents the YT fullscreen overlay button
      />
    </div>
  )
}

function ShortFormCard({ video, onClick }: { video: any; onClick: () => void }) {
  return (
    <div
      className="group relative bg-black rounded-lg overflow-hidden cursor-pointer hover:shadow-lg transition-all"
      style={{ aspectRatio: '9 / 16' }}
      onClick={onClick}
    >
      {isDirectVideoUrl(video.url) ? (
        <video src={video.url} autoPlay muted loop playsInline preload="metadata"
          className="absolute inset-0 w-full h-full object-cover" />
      ) : (
        <IframeCard url={getCardEmbedUrl(video.url)} ratio="9/16" />
      )}

      {/* Hover overlay — NO play icon per request */}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors" />

      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
        <p className="text-white font-semibold text-xs line-clamp-2">{video.title}</p>
      </div>
    </div>
  )
}

function LongFormCard({ video, onClick }: { video: any; onClick: () => void }) {
  return (
    <div
      className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group rounded-lg bg-card border border-border"
      onClick={onClick}
    >
      <div className="relative overflow-hidden" style={{ aspectRatio: '16 / 9' }}>
        {isDirectVideoUrl(video.url) ? (
          <video src={video.url} autoPlay muted loop playsInline preload="metadata"
            className="absolute inset-0 w-full h-full object-cover" />
        ) : (
          <IframeCard url={getCardEmbedUrl(video.url)} ratio="16/9" />
        )}

        {/* Hover overlay — NO play icon per request */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors" />
      </div>

      <div className="px-3 py-2">
        <h3 className="font-bold text-foreground text-sm line-clamp-1">{video.title}</h3>
        {video.niche && <p className="text-xs text-foreground/60 mt-0.5">{video.niche}</p>}
      </div>
    </div>
  )
}

// --- Carousel ---------------------------------------------------------

function VideoCarousel({
  videos,
  type,
  onSelect,
}: {
  videos: any[]
  type: 'shortform' | 'longform'
  onSelect: (video: any) => void
}) {
  const scrollRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: 'left' | 'right') => {
    const container = scrollRef.current
    if (!container) return
    const amount = type === 'shortform' ? 200 : 360
    container.scrollBy({ left: direction === 'left' ? -amount : amount, behavior: 'smooth' })
  }

  return (
    <div className="relative">
      <div ref={scrollRef}
        className="flex gap-4 overflow-x-auto pb-2 scroll-smooth snap-x snap-mandatory scrollbar-hide">
        {videos.map((video, index) => (
          <div key={video.id} className="flex-shrink-0 snap-start carousel-item-animate"
            style={{ width: type === 'shortform' ? '180px' : '340px', animationDelay: `${index * 90}ms` }}>
            {type === 'shortform' ? (
              <ShortFormCard video={video} onClick={() => onSelect(video)} />
            ) : (
              <LongFormCard video={video} onClick={() => onSelect(video)} />
            )}
          </div>
        ))}
      </div>

      {videos.length > 2 && (
        <>
          <button onClick={() => scroll('left')} aria-label="Scroll left"
            className="hidden sm:flex absolute -left-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-background border border-border shadow-md items-center justify-center hover:bg-primary/10 transition-colors z-10">
            ‹
          </button>
          <button onClick={() => scroll('right')} aria-label="Scroll right"
            className="hidden sm:flex absolute -right-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-background border border-border shadow-md items-center justify-center hover:bg-primary/10 transition-colors z-10">
            ›
          </button>
        </>
      )}
    </div>
  )
}

// --- Modal player -----------------------------------------------

function ModalPlayer({ video }: { video: any }) {
  if (isDirectVideoUrl(video.url)) {
    return (
      <video src={video.url} className="w-full h-full object-contain"
        controls autoPlay playsInline />
    )
  }

  return (
    <iframe
      src={getModalEmbedUrl(video.url)}
      className="w-full h-full"
      allow="autoplay; fullscreen; picture-in-picture"
      allowFullScreen
      title={video.title}
    />
  )
}

// --- Main page ------------------------------------------------------------

export default function HomePage() {
  const [profile, setProfile] = useState<any>(null)
  const [shortFormVideos, setShortFormVideos] = useState<any[]>([])
  const [longFormVideos, setLongFormVideos] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedVideo, setSelectedVideo] = useState<any>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/portfolio')
        const data = await res.json()

        if (data.profile) {
          setProfile(data.profile)
        } else {
          setProfile({ full_name: 'Devang Gentyal', bio: 'Professional Video Editor | Content Creator' })
        }

        if (data.videos) {
          const shortForm = data.videos.filter((v: any) => v.type === 'shortform').slice(0, 5)
          const longForm = data.videos.filter((v: any) => v.type === 'longform').slice(0, 5)
          setShortFormVideos(shortForm)
          setLongFormVideos(longForm)
        }
      } catch (error) {
        console.log('[v0] Using default data')
        setProfile({ full_name: 'Devang Gentyal', bio: 'Professional Video Editor | Content Creator' })
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="h-12 w-12 bg-primary/20 rounded-lg mx-auto mb-4 animate-pulse" />
            <p className="text-foreground/60">Loading...</p>
          </div>
        </div>
      </div>
    )
  }

  const showreelUrl = profile?.showreel_url || PLACEHOLDER_SHOWREEL_URL
  const showreelEmbedUrl = getShowreelEmbedUrl(showreelUrl)

  return (
    <div className="min-h-screen bg-background">
      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { scrollbar-width: none; -ms-overflow-style: none; }
        @keyframes carouselSlideIn {
          from { opacity: 0; transform: translateX(60px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        .carousel-item-animate {
          animation: carouselSlideIn 0.6s ease-out forwards;
          opacity: 0;
        }
      `}</style>

      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">

          {/* Sidebar */}
          <aside className="lg:col-span-1 mr-18">
            <div className="sticky top-24 space-y-6">
              <div className="mb-6">
                <div className="w-full aspect-square bg-gradient-to-br from-primary/20 to-accent/20 rounded-xl overflow-hidden">
                  <Image
                    src={profile?.avatar_url || '/devang-pfp.webp'}
                    alt={profile?.full_name || 'Profile'}
                    width={400} height={400}
                    className="w-full h-full object-cover"
                    priority
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h1 className="text-2xl font-bold text-foreground">{profile?.full_name || 'Devang Gentyal'}</h1>

                <p className="text-sm text-foreground/70 leading-relaxed">
                  {profile?.bio || 'Professional Video Editor | Content Creator | Helping creators build their presence'}
                </p>

                <div className="space-y-2 pt-4 border-t border-border">
                  <p className="text-sm text-foreground/60">✅ Available for work</p>
                </div>

                <div className="space-y-2 pt-4 border-t border-border">
                  <p className="text-xs font-bold text-foreground/60 uppercase">Editing Niches</p>
                  <div className="flex flex-wrap gap-2">
                    {['Talking Head', 'Ad Reels', 'Documentary', 'StoryTelling', 'AI Editing'].map(n => (
                      <span key={n} className="px-2 py-1 bg-primary/10 text-primary text-xs rounded">{n}</span>
                    ))}
                  </div>
                </div>

                <div className="space-y-2 pt-4 border-t border-border">
                  <p className="text-xs font-bold text-foreground/60 uppercase">Languages</p>
                  <p className="text-sm text-foreground/70">English, Hindi</p>
                </div>

                <div className="pt-4 border-t border-border">
                  <Link href="/contact">
                    <Button className="w-full">Like my work? Contact me!</Button>
                  </Link>
                </div>

                <div className="flex items-center gap-3 pt-4 justify-center">
                  <a href="https://www.instagram.com/devang_gentyal/" target="_blank" rel="noopener noreferrer"
                    className="p-2 hover:bg-primary/10 rounded-lg transition-colors">
                    <Instagram className="w-5 h-5 text-foreground/60 hover:text-primary" />
                  </a>
                  <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"
                    className="p-2 hover:bg-primary/10 rounded-lg transition-colors">
                    <Twitter className="w-5 h-5 text-foreground/60 hover:text-primary" />
                  </a>
                  <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"
                    className="p-2 hover:bg-primary/10 rounded-lg transition-colors">
                    <Linkedin className="w-5 h-5 text-foreground/60 hover:text-primary" />
                  </a>
                  <a href="https://www.youtube.com/@devangcreates" target="_blank" rel="noopener noreferrer"
                    className="p-2 hover:bg-primary/10 rounded-lg transition-colors">
                    <Youtube className="w-5 h-5 text-foreground/60 hover:text-primary" />
                  </a>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-3 space-y-16">

            {/* ShowReel */}
            <section className="space-y-6">
              <h2 className="text-3xl font-bold text-foreground">ShowReel</h2>
              <div className="w-full bg-black rounded-lg overflow-hidden shadow-xl">
                <div className="relative w-full" style={{ aspectRatio: '16 / 9' }}>
                  {isDirectVideoUrl(showreelUrl) ? (
                    <video src={showreelUrl} className="w-full h-full object-cover"
                      autoPlay loop playsInline controls />
                  ) : (
                    <iframe
                      src={showreelEmbedUrl}
                      className="absolute inset-0 w-full h-full"
                      allow="autoplay; fullscreen; picture-in-picture"
                      allowFullScreen
                      title="ShowReel"
                    />
                  )}
                </div>
              </div>
            </section>

            {/* ShortForm */}
            {shortFormVideos.length > 0 && (
              <section className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-3xl font-bold text-foreground">Short-Form</h2>
                  <p className="text-sm text-foreground/60">{shortFormVideos.length} videos</p>
                </div>
                <VideoCarousel videos={shortFormVideos} type="shortform" onSelect={setSelectedVideo} />
                <Link href="/shortform">
                  <Button variant="outline" className="w-full">View All Short-Form Videos</Button>
                </Link>
              </section>
            )}

            {/* LongForm */}
            {longFormVideos.length > 0 && (
              <section className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-3xl font-bold text-foreground">Long-Form</h2>
                  <p className="text-sm text-foreground/60">{longFormVideos.length} videos</p>
                </div>
                <VideoCarousel videos={longFormVideos} type="longform" onSelect={setSelectedVideo} />
                <Link href="/longform">
                  <Button variant="outline" className="w-full">View All Long-Form Videos</Button>
                </Link>
              </section>
            )}

            {!loading && shortFormVideos.length === 0 && longFormVideos.length === 0 && (
              <div className="text-center py-12">
                <p className="text-foreground/60">Start adding videos from the admin panel to display them here</p>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Video Player Modal */}
      {selectedVideo && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedVideo(null)}
        >
          {selectedVideo.type === 'shortform' ? (
            <div
              className="relative bg-black rounded-xl overflow-hidden aspect-[9/16] w-[min(95vw,calc(85vh*9/16))]"
              onClick={(e) => e.stopPropagation()}
            >
              <button onClick={() => setSelectedVideo(null)}
                className="absolute top-3 right-3 z-10 bg-black/60 hover:bg-black/80 text-white w-10 h-10 rounded-full flex items-center justify-center text-2xl leading-none transition-colors">
                ×
              </button>
              <ModalPlayer video={selectedVideo} />
            </div>
          ) : (
            <div
              className="bg-background rounded-lg overflow-hidden flex flex-col w-[min(95vw,calc(80vh*16/9))] max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-4 border-b border-border">
                <h2 className="text-xl font-semibold text-foreground truncate">{selectedVideo.title}</h2>
                <button onClick={() => setSelectedVideo(null)}
                  className="text-foreground/60 hover:text-foreground transition-colors text-2xl leading-none ml-4 flex-shrink-0">
                  ×
                </button>
              </div>
              <div className="relative w-full aspect-[16/9] bg-black">
                <ModalPlayer video={selectedVideo} />
              </div>
            </div>
          )}
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