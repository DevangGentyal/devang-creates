import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await request.json()

    const { client_name, client_handle, metric_title, metric_value, description, niche } = body

    if (!client_name) {
      return NextResponse.json({ error: 'Missing client name' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('experiences')
      .insert([
        {
          client_name,
          client_handle: client_handle || null,
          metric_title: metric_title || null,
          metric_value: metric_value || null,
          description: description || null,
          niche: niche || null,
          order_index: 0,
        },
      ])
      .select()

    if (error) throw error

    return NextResponse.json(data?.[0])
  } catch (error) {
    console.error('[v0] Error creating experience:', error)
    return NextResponse.json({ error: 'Failed to create experience' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await request.json()

    const { id, client_name, client_handle, metric_title, metric_value, description, niche } = body

    if (!id) {
      return NextResponse.json({ error: 'Missing experience ID' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('experiences')
      .update({
        client_name,
        client_handle: client_handle || null,
        metric_title: metric_title || null,
        metric_value: metric_value || null,
        description: description || null,
        niche: niche || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()

    if (error) throw error

    return NextResponse.json(data?.[0])
  } catch (error) {
    console.error('[v0] Error updating experience:', error)
    return NextResponse.json({ error: 'Failed to update experience' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Missing experience ID' }, { status: 400 })
    }

    const { error } = await supabase
      .from('experiences')
      .delete()
      .eq('id', id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[v0] Error deleting experience:', error)
    return NextResponse.json({ error: 'Failed to delete experience' }, { status: 500 })
  }
}
