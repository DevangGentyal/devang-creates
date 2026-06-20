// Videos API Route
// Handles video CRUD operations with YouTube and Google Drive support

import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { getEmbedUrl } from '@/lib/video-utils'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await request.json()

    const { title, url, type, niche, show_on_homepage, video_source } = body

    if (!title || !url || !type) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Convert URL to proper embed format
    const embedUrl = getEmbedUrl(url, video_source || 'youtube')

    const { data, error } = await supabase
      .from('videos')
      .insert([
        {
          title,
          url: embedUrl,
          type,
          niche: niche || null,
          show_on_homepage: show_on_homepage || false,
          video_source: video_source || 'youtube',
          order_index: 0,
        },
      ])
      .select()

    if (error) {
      console.error('[v0] Supabase error:', error)
      throw error
    }

    return NextResponse.json(data?.[0])
  } catch (error) {
    console.error('[v0] Error creating video:', error)
    return NextResponse.json({ error: 'Failed to create video', details: String(error) }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await request.json()

    const { id, title, url, type, niche, show_on_homepage, video_source } = body

    if (!id) {
      return NextResponse.json({ error: 'Missing video ID' }, { status: 400 })
    }

    // Convert URL to proper embed format
    const embedUrl = getEmbedUrl(url, video_source || 'youtube')

    const { data, error } = await supabase
      .from('videos')
      .update({
        title,
        url: embedUrl,
        type,
        niche: niche || null,
        show_on_homepage,
        video_source: video_source || 'youtube',
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()

    if (error) {
      console.error('[v0] Supabase error:', error)
      throw error
    }

    return NextResponse.json(data?.[0])
  } catch (error) {
    console.error('[v0] Error updating video:', error)
    return NextResponse.json({ error: 'Failed to update video', details: String(error) }, { status: 500 })
  }
}

// Get all videos
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('videos')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('[v0] Supabase error:', error)
      throw error
    }

    return NextResponse.json(data || [])
  } catch (error) {
    console.error('[v0] Error fetching videos:', error)
    return NextResponse.json({ error: 'Failed to fetch videos', details: String(error) }, { status: 500 })
  }
}
