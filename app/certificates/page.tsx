import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { getSupabaseAdminClient } from '@/lib/supabase/admin'

const supabaseAdmin = getSupabaseAdminClient()
import { isEligibleForCertificate } from '@/lib/certificates/core'
import CertificatesClient from '@/components/certificate/CertificatesClient'

type EventRow = {
  id: string
  title: string
  event_date: string
}

type AttendanceRow = {
  event_id: string
  status: string
}

type CertificateRow = {
  event_id: string
  certificate_uid: string
}

export default async function CertificatesPage() {
  const supabase = await createSupabaseServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  const [{ data: eventsData }, { data: attendanceData }, { data: certificatesData }] =
    await Promise.all([
      supabaseAdmin
        .from('events')
        .select('id, title, event_date')
        .order('event_date', { ascending: false }),

      supabaseAdmin
        .from('attendance')
        .select('event_id, status')
        .eq('user_id', user.id)
        .in('status', ['checkin', 'checkout']),

      supabaseAdmin
        .from('certificates')
        .select('event_id, certificate_uid')
        .eq('user_id', user.id),
    ])

  const attendanceByEvent = new Map<string, string[]>()

  for (const row of (attendanceData ?? []) as AttendanceRow[]) {
    if (!attendanceByEvent.has(row.event_id)) {
      attendanceByEvent.set(row.event_id, [])
    }

    attendanceByEvent.get(row.event_id)?.push(row.status)
  }

  const certificateByEvent = new Map<string, string>()

  for (const row of (certificatesData ?? []) as CertificateRow[]) {
    certificateByEvent.set(row.event_id, row.certificate_uid)
  }

  const events = ((eventsData ?? []) as EventRow[]).map((event) => ({
    id: event.id,
    title: event.title,
    eventDate: event.event_date,
    eligible: isEligibleForCertificate(
      attendanceByEvent.get(event.id) ?? []
    ),
    certificateUid: certificateByEvent.get(event.id) ?? null,
  }))

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0B1D3A] to-[#132E59] px-4 py-8">
      <div className="mx-auto max-w-6xl">

        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">

          <div>
            <h1 className="text-3xl font-bold text-white">
              My Certificates
            </h1>

            <p className="mt-1 text-slate-300">
              Download certificates for events you've successfully attended.
            </p>
          </div>

          <Link
            href="/dashboard"
            className="rounded-lg border border-slate-700 bg-slate-900/40 px-4 py-2 text-sm text-white transition hover:bg-slate-800"
          >
            Dashboard
          </Link>

        </div>

        {events.length ? (
          <CertificatesClient events={events} />
        ) : (
          <div className="rounded-xl border border-slate-700 bg-slate-900/40 py-16 text-center">
            <h2 className="text-lg font-semibold text-white">
              No certificates available
            </h2>

            <p className="mt-2 text-slate-400">
              Attend events and complete check-in & check-out to earn certificates.
            </p>
          </div>
        )}

      </div>
    </div>
  )
}