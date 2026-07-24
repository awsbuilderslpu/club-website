import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { PencilLine, ShieldCheck } from 'lucide-react'
import EditEventForm from '@/components/admin/EditEventForm'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { getSupabaseAdminClient } from '@/lib/supabase/admin'


export default async function EditEventPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
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

  const { data: event } = await supabaseAdmin
    .from('events')
    .select('id, title, description, location, event_date')
    .eq('id', id)
    .single()

  if (!event) {
    notFound()
  }

  return (
    <div className="relative min-h-screen overflow-hidden px-4 pb-12 pt-28 text-white sm:px-6 lg:px-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(0,229,255,0.12),transparent_28%),radial-gradient(circle_at_top_right,rgba(255,165,0,0.12),transparent_24%),linear-gradient(135deg,#071225_0%,#0B1D3A_45%,#132E59_100%)]" />
      <div className="absolute inset-0 opacity-40 bg-[linear-gradient(0deg,transparent_24%,rgba(14,165,233,0.08)_25%,rgba(14,165,233,0.08)_26%,transparent_27%,transparent_74%,rgba(14,165,233,0.08)_75%,rgba(14,165,233,0.08)_76%,transparent_77%,transparent),linear-gradient(90deg,transparent_24%,rgba(14,165,233,0.08)_25%,rgba(14,165,233,0.08)_26%,transparent_27%,transparent_74%,rgba(14,165,233,0.08)_75%,rgba(14,165,233,0.08)_76%,transparent_77%,transparent)] bg-size-[56px_56px]" />

      <div className="relative mx-auto max-w-3xl">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-blue-950/55 px-4 py-2 text-xs font-mono uppercase tracking-[0.28em] text-cyan-200">
              <ShieldCheck size={14} />
              Admin event tools
            </div>
            <h1 className="mt-4 text-4xl font-bold text-white sm:text-5xl">Edit Event</h1>
            <p className="mt-3 text-blue-100/80">Update event details and publish changes instantly.</p>
          </div>
          <Link
            href="/admin/events"
            className="inline-flex h-11 items-center rounded-xl border border-cyan-400/25 bg-blue-950/60 px-4 text-sm font-semibold text-cyan-200 transition hover:border-cyan-300"
          >
            Back to Events
          </Link>
        </div>

        <div className="rounded-3xl border border-cyan-400/20 bg-[#08192F]/85 p-6 shadow-[0_24px_80px_rgba(2,10,24,0.5)] backdrop-blur-xl sm:p-8">
          <div className="mb-6 flex items-center gap-2 text-cyan-300">
            <PencilLine size={18} />
            <p className="text-sm font-mono uppercase tracking-[0.24em]">Edit form</p>
          </div>
          <EditEventForm event={event} />
        </div>
      </div>
    </div>
  )
}
