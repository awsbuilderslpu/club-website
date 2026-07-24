import Link from 'next/link'
import { redirect } from 'next/navigation'
import { CalendarDays, PencilLine, PlusCircle, ShieldCheck } from 'lucide-react'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { getSupabaseAdminClient } from '@/lib/supabase/admin'


export default async function AdminEventsPage() {
  const supabase = await createSupabaseServerClient()
  const supabaseAdmin = getSupabaseAdminClient()
  
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

  const { data: events } = await supabaseAdmin
    .from('events')
    .select('id, title, location, event_date')
    .order('event_date', { ascending: true })

  return (
    <div className="relative min-h-screen overflow-hidden px-4 pb-12 pt-28 text-white sm:px-6 lg:px-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(0,229,255,0.12),transparent_28%),radial-gradient(circle_at_top_right,rgba(255,165,0,0.12),transparent_24%),linear-gradient(135deg,#071225_0%,#0B1D3A_45%,#132E59_100%)]" />
      <div className="absolute inset-0 opacity-40 bg-[linear-gradient(0deg,transparent_24%,rgba(14,165,233,0.08)_25%,rgba(14,165,233,0.08)_26%,transparent_27%,transparent_74%,rgba(14,165,233,0.08)_75%,rgba(14,165,233,0.08)_76%,transparent_77%,transparent),linear-gradient(90deg,transparent_24%,rgba(14,165,233,0.08)_25%,rgba(14,165,233,0.08)_26%,transparent_27%,transparent_74%,rgba(14,165,233,0.08)_75%,rgba(14,165,233,0.08)_76%,transparent_77%,transparent)] bg-size-[56px_56px]" />

      <div className="relative mx-auto max-w-6xl">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-blue-950/55 px-4 py-2 text-xs font-mono uppercase tracking-[0.28em] text-cyan-200">
              <ShieldCheck size={14} />
              Admin event tools
            </div>
            <h1 className="mt-4 text-4xl font-bold text-white sm:text-5xl">Event Management</h1>
            <p className="mt-3 max-w-3xl text-blue-100/80">Create and edit all published events from one place.</p>
          </div>

          <div className="flex gap-3">
            <Link
              href="/admin"
              className="inline-flex h-11 items-center rounded-xl border border-cyan-400/25 bg-blue-950/60 px-4 text-sm font-semibold text-cyan-200 transition hover:border-cyan-300"
            >
              Back to Hub
            </Link>
            <Link
              href="/admin/events/create"
              className="inline-flex h-11 items-center gap-2 rounded-xl bg-linear-to-r from-cyan-400 to-sky-300 px-4 text-sm font-semibold text-[#08192F] transition hover:brightness-110"
            >
              <PlusCircle size={16} />
              Create Event
            </Link>
          </div>
        </div>

        <div className="overflow-hidden rounded-3xl border border-cyan-400/20 bg-[#08192F]/85 shadow-[0_24px_80px_rgba(2,10,24,0.5)] backdrop-blur-xl">
          <div className="divide-y divide-cyan-400/10">
            {(events ?? []).map((event) => (
              <div key={event.id} className="grid gap-3 px-6 py-4 sm:grid-cols-[1fr_auto] sm:items-center">
                <div>
                  <p className="text-xl font-semibold text-white">{event.title}</p>
                  <p className="mt-1 text-sm text-blue-100/75">{event.location || 'Location TBA'}</p>
                  <p className="mt-1 inline-flex items-center gap-2 text-xs text-cyan-200/85">
                    <CalendarDays size={14} />
                    {new Date(event.event_date).toLocaleString()}
                  </p>
                </div>

                <Link
                  href={`/admin/events/${event.id}/edit`}
                  className="inline-flex h-10 items-center gap-2 rounded-xl border border-cyan-400/25 bg-blue-950/60 px-4 text-sm font-semibold text-cyan-200 transition hover:border-cyan-300"
                >
                  <PencilLine size={14} />
                  Edit
                </Link>
              </div>
            ))}

            {!events?.length && (
              <div className="px-6 py-8 text-sm text-blue-100/75">No events yet. Create your first event.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
