import Link from 'next/link'
import { redirect } from 'next/navigation'
import { BarChart3, Download, FileSpreadsheet, ShieldCheck, Users } from 'lucide-react'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { getSupabaseAdminClient } from '@/lib/supabase/admin'

const supabaseAdmin = getSupabaseAdminClient()

type AttendanceRow = {
  user_id: string
  status: 'checkin' | 'checkout' | 'breakin' | 'breakout'
  scanned_at: string
  event_id: string
  events: {
    id: string
    title: string
    event_date: string
    location: string | null
  } | null
}

export default async function AdminAttendanceAnalyticsPage() {
  const supabase = await createSupabaseServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  const { data: me } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (me?.role !== 'admin') {
    redirect('/dashboard')
  }

  const { data } = await supabaseAdmin
    .from('attendance')
    .select(
      `
      user_id,
      status,
      scanned_at,
      event_id,
      events (
        id,
        title,
        event_date,
        location
      )
    `
    )
    .order('scanned_at', { ascending: false })

  const { data: allEvents } = await supabaseAdmin
    .from('events')
    .select('id, title, event_date')
    .order('event_date', { ascending: true })

  const rows = (data ?? []) as unknown as AttendanceRow[]

  const totals = {
    scans: rows.length,
    attendees: new Set(rows.map((r) => r.user_id)).size,
    checkin: rows.filter((r) => r.status === 'checkin').length,
    checkout: rows.filter((r) => r.status === 'checkout').length,
    breakin: rows.filter((r) => r.status === 'breakin').length,
    breakout: rows.filter((r) => r.status === 'breakout').length,
  }

  const eventMap = new Map<string, {
    title: string
    event_date: string
    location: string | null
    scans: number
    attendees: Set<string>
    checkin: number
    checkout: number
    breakin: number
    breakout: number
  }>()

  rows.forEach((row) => {
    if (!row.events) {
      return
    }

    const key = row.events.id
    const current = eventMap.get(key) ?? {
      title: row.events.title,
      event_date: row.events.event_date,
      location: row.events.location,
      scans: 0,
      attendees: new Set<string>(),
      checkin: 0,
      checkout: 0,
      breakin: 0,
      breakout: 0,
    }

    current.scans += 1
    current.attendees.add(row.user_id)
    current[row.status] += 1

    eventMap.set(key, current)
  })

  const eventStats = Array.from(eventMap.entries())
    .map(([eventId, stat]) => ({
      eventId,
      ...stat,
      attendeeCount: stat.attendees.size,
    }))
    .sort((a, b) => new Date(b.event_date).getTime() - new Date(a.event_date).getTime())

  const eventOptions = (allEvents ?? []).map((event) => ({
    id: event.id,
    label: `${event.title} (${new Date(event.event_date).toLocaleDateString()})`,
  }))

  return (
    <div className="relative min-h-screen overflow-hidden px-4 pb-12 pt-28 text-white sm:px-6 lg:px-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(0,229,255,0.12),transparent_28%),radial-gradient(circle_at_top_right,rgba(255,165,0,0.12),transparent_24%),linear-gradient(135deg,#071225_0%,#0B1D3A_45%,#132E59_100%)]" />
      <div className="absolute inset-0 opacity-40 bg-[linear-gradient(0deg,transparent_24%,rgba(14,165,233,0.08)_25%,rgba(14,165,233,0.08)_26%,transparent_27%,transparent_74%,rgba(14,165,233,0.08)_75%,rgba(14,165,233,0.08)_76%,transparent_77%,transparent),linear-gradient(90deg,transparent_24%,rgba(14,165,233,0.08)_25%,rgba(14,165,233,0.08)_26%,transparent_27%,transparent_74%,rgba(14,165,233,0.08)_75%,rgba(14,165,233,0.08)_76%,transparent_77%,transparent)] bg-size-[56px_56px]" />

      <div className="relative mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-blue-950/55 px-4 py-2 text-xs font-mono uppercase tracking-[0.28em] text-cyan-200">
              <ShieldCheck size={14} />
              Admin analytics
            </div>
            <h1 className="mt-4 text-4xl font-bold text-white sm:text-5xl">Attendance Analytics</h1>
            <p className="mt-3 max-w-3xl text-blue-100/80">
              Event-wise attendance insights and export controls from a single dashboard.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/admin"
              className="inline-flex h-11 items-center rounded-xl border border-cyan-400/25 bg-blue-950/60 px-4 text-sm font-semibold text-cyan-200 transition hover:border-cyan-300"
            >
              Back to Hub
            </Link>
          </div>
        </div>

        <div className="mb-6 rounded-2xl border border-cyan-400/20 bg-[#08192F]/85 p-5">
          <div className="mb-4 flex items-center gap-2 text-cyan-300">
            <FileSpreadsheet size={16} />
            <p className="text-sm font-mono uppercase tracking-[0.22em]">Export filters</p>
          </div>

          <form method="GET" action="/api/attendance/export" className="grid gap-3 lg:grid-cols-[1fr_auto_auto_auto] lg:items-end">
            <div>
              <label className="mb-1 block text-xs text-blue-100/70">Event</label>
              <select
                name="eventId"
                defaultValue=""
                className="h-11 w-full rounded-xl border border-cyan-400/20 bg-blue-950/70 px-3 text-sm text-cyan-100 outline-none focus:border-cyan-300"
              >
                <option value="">All events</option>
                {eventOptions.map((event) => (
                  <option key={event.id} value={event.id}>{event.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-xs text-blue-100/70">Start date</label>
              <input
                type="date"
                name="startDate"
                className="h-11 rounded-xl border border-cyan-400/20 bg-blue-950/70 px-3 text-sm text-cyan-100 outline-none focus:border-cyan-300"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs text-blue-100/70">End date</label>
              <input
                type="date"
                name="endDate"
                className="h-11 rounded-xl border border-cyan-400/20 bg-blue-950/70 px-3 text-sm text-cyan-100 outline-none focus:border-cyan-300"
              />
            </div>

            <button
              type="submit"
              className="inline-flex h-11 items-center gap-2 rounded-xl bg-linear-to-r from-cyan-400 to-sky-300 px-4 text-sm font-semibold text-[#08192F] transition hover:brightness-110"
            >
              <Download size={14} />
              Export CSV
            </button>
          </form>
        </div>

        <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-2xl border border-cyan-400/20 bg-[#08192F]/85 p-5">
            <p className="text-xs font-mono uppercase tracking-[0.22em] text-cyan-300/75">Total scans</p>
            <p className="mt-2 text-3xl font-bold text-white">{totals.scans}</p>
          </div>
          <div className="rounded-2xl border border-cyan-400/20 bg-[#08192F]/85 p-5">
            <p className="text-xs font-mono uppercase tracking-[0.22em] text-cyan-300/75">Unique attendees</p>
            <p className="mt-2 text-3xl font-bold text-white">{totals.attendees}</p>
          </div>
          <div className="rounded-2xl border border-cyan-400/20 bg-[#08192F]/85 p-5">
            <p className="text-xs font-mono uppercase tracking-[0.22em] text-cyan-300/75">Status split</p>
            <p className="mt-2 text-sm text-blue-100/80">
              In {totals.checkin} | Out {totals.checkout} | Break In {totals.breakin} | Break Out {totals.breakout}
            </p>
          </div>
        </div>

        <div className="overflow-hidden rounded-3xl border border-cyan-400/20 bg-[#08192F]/85 shadow-[0_24px_80px_rgba(2,10,24,0.5)] backdrop-blur-xl">
          <div className="flex items-center gap-2 border-b border-cyan-400/15 px-6 py-4 text-cyan-300">
            <BarChart3 size={18} />
            <p className="text-sm font-mono uppercase tracking-[0.24em]">Event analytics</p>
          </div>

          <div className="divide-y divide-cyan-400/10">
            {eventStats.map((event) => (
              <div key={event.eventId} className="grid gap-4 px-6 py-5 lg:grid-cols-[1fr_auto] lg:items-center">
                <div>
                  <p className="text-2xl font-semibold text-white">{event.title}</p>
                  <p className="mt-1 text-sm text-blue-100/75">
                    {event.location || 'Location TBA'} | {new Date(event.event_date).toLocaleString()}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2 text-xs">
                    <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-2 py-1 text-cyan-200">
                      <Users size={12} className="mr-1 inline" />
                      Attendees: {event.attendeeCount}
                    </span>
                    <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-2 py-1 text-cyan-200">Scans: {event.scans}</span>
                    <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-2 py-1 text-cyan-200">In: {event.checkin}</span>
                    <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-2 py-1 text-cyan-200">Out: {event.checkout}</span>
                    <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-2 py-1 text-cyan-200">Break In: {event.breakin}</span>
                    <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-2 py-1 text-cyan-200">Break Out: {event.breakout}</span>
                  </div>
                </div>

                <Link
                  href={`/api/attendance/export?eventId=${event.eventId}`}
                  className="inline-flex h-10 items-center gap-2 rounded-xl border border-cyan-400/25 bg-blue-950/60 px-4 text-sm font-semibold text-cyan-200 transition hover:border-cyan-300"
                >
                  <Download size={14} />
                  Export CSV
                </Link>
              </div>
            ))}

            {!eventStats.length && (
              <div className="px-6 py-8 text-sm text-blue-100/75">No attendance data available yet.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
