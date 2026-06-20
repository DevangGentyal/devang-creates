import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1)

    if (error) throw error

    return NextResponse.json(data?.[0] || null)
  } catch (error) {
    console.error('[v0] Error fetching profile:', error)
    return NextResponse.json(null)
  }
}

export async function PUT(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await request.json()

    const { id, full_name, email, bio, avatar_url } = body

    let result

    if (id) {
      // Update existing profile
      const { data, error } = await supabase
        .from('profiles')
        .update({
          full_name,
          email: email || null,
          bio: bio || null,
          avatar_url: avatar_url || null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()

      if (error) throw error
      result = data?.[0]
    } else {
      // Create new profile
      const { data, error } = await supabase
        .from('profiles')
        .insert([
          {
            full_name,
            email: email || null,
            bio: bio || null,
            avatar_url: avatar_url || '/devang-pfp.webp',
          },
        ])
        .select()

      if (error) throw error
      result = data?.[0]
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('[v0] Error saving profile:', error)
    return NextResponse.json({ error: 'Failed to save profile' }, { status: 500 })
  }
}
