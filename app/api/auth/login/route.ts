export const runtime = 'nodejs'

import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { loginSchema } from '@/app/schemas/auth.schema'

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const parsed = loginSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const { email, password } = parsed.data

    const supabase = await createSupabaseServerClient()

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 401 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(error)

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}