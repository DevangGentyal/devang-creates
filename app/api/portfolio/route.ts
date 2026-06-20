import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Get all portfolio data
    const [profileResult, videosResult, experiencesResult] = await Promise.all([
      supabase.from('profiles').select('*').order('created_at', { ascending: false }).limit(1),
      supabase.from('videos').select('*').order('order_index'),
      supabase.from('experiences').select('*').order('order_index'),
    ])

    return NextResponse.json({
      profile: profileResult.data?.[0] || null,
      videos: videosResult.data || [],
      experiences: experiencesResult.data || [],
    })
  } catch (error) {
    console.error('[v0] API error:', error)
    return NextResponse.json({ error: 'Failed to fetch portfolio data' }, { status: 500 })
  }
}
