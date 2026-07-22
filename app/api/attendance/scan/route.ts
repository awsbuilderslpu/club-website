export const runtime = 'nodejs'

import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { getSupabaseAdminClient } from '@/lib/supabase/admin'
import { z } from 'zod'

const schema = z.object({
  user_id: z.uuid(),
  status: z.enum(['checkin', 'checkout', 'breakin', 'breakout']),
})

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const parsed = schema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid data' }, { status: 400 })
    }

    const supabase = await createSupabaseServerClient()

    // 🔐 Auth
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // 🔍 Role check
    const { data: me } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (!me || !['admin', 'core'].includes(me.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // 📅 Get today's event
    const supabaseAdmin = getSupabaseAdminClient()

    const { data: event } = await supabaseAdmin
      .from('events')
      .select('id')
      .gte('event_date', new Date().toISOString().split('T')[0])
      .order('event_date', { ascending: true })
      .limit(1)
      .single()

    if (!event) {
      return NextResponse.json({ error: 'No active event today' }, { status: 400 })
    }

    // 🚫 Prevent duplicate
    const { data: existing } = await supabaseAdmin
      .from('attendance')
      .select('id')
      .eq('user_id', parsed.data.user_id)
      .eq('event_id', event.id)
      .eq('status', parsed.data.status)
      .maybeSingle()

    if (existing) {
      return NextResponse.json({ error: 'Already marked' }, { status: 400 })
    }

    // ✅ Insert
    const { error } = await supabaseAdmin
      .from('attendance')
      .insert([
        {
          user_id: parsed.data.user_id,
          event_id: event.id,
          status: parsed.data.status,
        },
      ])

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}