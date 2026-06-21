'use client'

import { useEffect, useRef, useState } from 'react'

export function isDirectVideoUrl(url: string | undefined | null) {
  if (!url) return false
  return /\.(mp4|webm|ogg|mov|m4v)(\?.*)?$/i.test(url)
}

export function getYouTubeVideoId(url: string): string | null {
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

export function getYouTubeThumbnail(url: string | undefined | null): string | null {
  if (!url) return null

  const videoId = getYouTubeVideoId(url)

  if (!videoId) return null

  return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
}

export function normalizeYouTubeUrl(url: string): string {
  const videoId = getYouTubeVideoId(url)

  if (!videoId) return url

  return `https://www.youtube.com/embed/${videoId}`
}

export function getDriveEmbedUrl(url: string): string | null {
  if (!url.includes('drive.google.com')) return null

  let fileId: string | null = null

  const fileMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/)
  if (fileMatch) fileId = fileMatch[1]

  if (!fileId) {
    const idMatch = url.match(/[?&]id=([a-zA-Z0-9_-]+)/)
    if (idMatch) fileId = idMatch[1]
  }

  if (!fileId) return null

  return `https://drive.google.com/file/d/${fileId}/preview?rm=minimal`
}

export function buildYouTubeEmbedUrl(url: string, muted: boolean): string {
  try {
    const u = new URL(normalizeYouTubeUrl(url))
    const vidId = getYouTubeVideoId(url)

    u.searchParams.set('autoplay', '1')
    u.searchParams.set('mute', muted ? '1' : '0')
    u.searchParams.set('controls', '0')
    u.searchParams.set('rel', '0')
    u.searchParams.set('showinfo', '0')
    u.searchParams.set('iv_load_policy', '3')
    u.searchParams.set('modestbranding', '1')
    u.searchParams.set('disablekb', '1')
    u.searchParams.set('fs', '0')
    u.searchParams.set('loop', '1')
    if (vidId) u.searchParams.set('playlist', vidId)
    return u.toString()
  } catch {
    return url
  }
}

export function getCardEmbedUrl(url: string): string {
  const driveUrl = getDriveEmbedUrl(url)
  if (driveUrl) return driveUrl
  return buildYouTubeEmbedUrl(url, true)
}

export function getModalEmbedUrl(url: string): string {
  const driveUrl = getDriveEmbedUrl(url)
  if (driveUrl) return driveUrl

  try {
    const u = new URL(normalizeYouTubeUrl(url))
    u.searchParams.set('autoplay', '1')
    u.searchParams.set('mute', '0')
    u.searchParams.set('rel', '0')
    u.searchParams.set('modestbranding', '1')
    u.searchParams.set('iv_load_policy', '3')
    u.searchParams.delete('controls')
    return u.toString()
  } catch {
    return url
  }
}

export function getShowreelEmbedUrl(url: string): string {
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

export function VideoThumbnail({ video }: { video: any }) {
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

export function IframeCard({
  url,
  ratio,
}: {
  url: string
  ratio: '9/16' | '16/9'
}) {
  const isDrive = url.includes('drive.google.com')
  const scale = isDrive ? 1.18 : 1.0

  return (
    <div
      className="absolute inset-0 overflow-hidden"
      style={{ borderRadius: 'inherit' }}
    >
      <iframe
        src={url}
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
      />
    </div>
  )
}

export function ShortFormCard({ video, onClick }: { video: any; onClick: () => void }) {
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

export function LongFormCard({ video, onClick }: { video: any; onClick: () => void }) {
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

export function ModalPlayer({ video }: { video: any }) {
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
