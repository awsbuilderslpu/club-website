import Link from 'next/link'
import { redirect } from 'next/navigation'
import { CalendarDays, MapPin, Ticket, TriangleAlert } from 'lucide-react'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { getSupabaseAdminClient } from '@/lib/supabase/admin'

const supabaseAdmin = getSupabaseAdminClient()
import TicketActions from '@/components/attendance/TicketActions'

type TicketPageProps = {
  searchParams: Promise<{ eventId?: string }>
}

export default async function TicketPage({ searchParams }: TicketPageProps) {
  const params = await searchParams
  const supabase = await createSupabaseServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, workspace_uid, workspace_name')
    .eq('id', user.id)
    .single()

  const now = new Date()
  const windowStart = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString()
  const windowEnd = new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString()

  let event: { id: string; title: string; event_date: string; location: string | null } | null = null

  if (params.eventId) {
    const { data } = await supabaseAdmin
      .from('events')
      .select('id, title, event_date, location')
      .eq('id', params.eventId)
      .single()

    event = data
  } else {
    const { data } = await supabaseAdmin
      .from('events')
      .select('id, title, event_date, location')
      .gte('event_date', windowStart)
      .lte('event_date', windowEnd)
      .order('event_date', { ascending: true })
      .limit(10)

    event =
      data && data.length
        ? data.reduce((closest, current) => {
            const closestDelta = Math.abs(new Date(closest.event_date).getTime() - now.getTime())
            const currentDelta = Math.abs(new Date(current.event_date).getTime() - now.getTime())
            return currentDelta < closestDelta ? current : closest
          })
        : null
  }

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <TriangleAlert className="mx-auto text-amber-500" size={40} />
          <h1 className="text-2xl font-bold">No Active Event</h1>
          <p className="text-slate-500">
            No event is available within the ticket window.
          </p>

          <Link
            href="/events"
            className="inline-block rounded-lg bg-black px-5 py-2 text-white"
          >
            Browse Events
          </Link>
        </div>
      </div>
    )
  }

  const qrData = JSON.stringify({
    user_id: user.id,
    event_id: event.id,
  })

  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=${encodeURIComponent(qrData)}`

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-3xl rounded-xl bg-white shadow border">
        <div className="grid md:grid-cols-[1fr_250px] gap-8 p-8">
          <div className="space-y-5">
            <div>
              <h1 className="text-3xl font-bold">{event.title}</h1>

              <div className="mt-4 space-y-2 text-slate-600">
                <div className="flex items-center gap-2">
                  <CalendarDays size={18} />
                  {new Date(event.event_date).toLocaleString()}
                </div>

                <div className="flex items-center gap-2">
                  <MapPin size={18} />
                  {event.location || 'Location TBA'}
                </div>
              </div>
            </div>

            <div className="border-t pt-5 space-y-3">
              <div>
                <p className="text-xs text-slate-500">Attendee</p>
                <p className="font-medium">{profile?.full_name || user.email}</p>
              </div>

              <div>
                <p className="text-xs text-slate-500">Workspace</p>
                <p>{profile?.workspace_name || '-'}</p>
              </div>

              <div>
                <p className="text-xs text-slate-500">UID</p>
                <p>{profile?.workspace_uid || '-'}</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center">
            <img
              src={qrUrl}
              alt="QR Code"
              className="w-52 border rounded-lg p-2 bg-white"
            />

            <p className="mt-4 text-center text-sm text-slate-500">
              Show this QR during check-in
            </p>
          </div>
        </div>

        <div className="border-t px-8 py-4 flex justify-between items-center">
          <p className="text-sm text-slate-500">
            Download this ticket before arriving.
          </p>

          <TicketActions backHref="/dashboard" />
        </div>
      </div>
    </div>
  )
  }
