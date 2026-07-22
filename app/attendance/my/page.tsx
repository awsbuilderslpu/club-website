'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

type AttendanceItem = {
  id: string
  status: 'checkin' | 'checkout' | 'breakin' | 'breakout'
  scanned_at: string
  events?: {
    id: string
    title: string
    event_date: string
    location: string | null
  } | null
}

type Role = 'member' | 'core' | 'admin'

const statusStyles = {
  checkin: 'bg-emerald-500/15 text-emerald-300',
  checkout: 'bg-blue-500/15 text-blue-300',
  breakin: 'bg-yellow-500/15 text-yellow-300',
  breakout: 'bg-red-500/15 text-red-300',
}

export default function MyAttendancePage() {
  const [data, setData] = useState<AttendanceItem[]>([])
  const [role, setRole] = useState<Role>('member')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/attendance/my')
      .then((res) => res.json())
      .then((res) => {
        if (res.error) {
          setError(res.error)
          setLoading(false)
          return
        }

        setData(res.attendance || [])
        setRole(res.role || 'member')
        setLoading(false)
      })
      .catch(() => {
        setError('Unable to load attendance')
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0B1D3A] to-[#132E59] px-4 py-8">
        <div className="mx-auto max-w-5xl">
          <div className="rounded-xl border border-slate-700 bg-slate-900/40 p-8 text-center text-slate-300">
            Loading attendance...
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0B1D3A] to-[#132E59] px-4 py-8">
      <div className="mx-auto max-w-5xl">

        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">

          <div>
            <h1 className="text-3xl font-bold text-white">
              My Attendance
            </h1>

            <p className="mt-1 text-slate-300">
              View your attendance history.
            </p>
          </div>

          <div className="flex gap-3">

            <Link
              href="/dashboard"
              className="rounded-lg border border-slate-700 bg-slate-900/40 px-4 py-2 text-sm text-white transition hover:bg-slate-800"
            >
              Dashboard
            </Link>

            {(role === 'core' || role === 'admin') && (
              <Link
                href="/attendance/scan"
                className="rounded-lg bg-cyan-400 px-4 py-2 text-sm font-medium text-slate-900 transition hover:bg-cyan-300"
              >
                Open Scanner
              </Link>
            )}

          </div>

        </div>

        {error && (
          <div className="mb-6 rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200">
            {error}
          </div>
        )}

        <div className="space-y-4">

          {data.map((item) => (
            <div
              key={item.id}
              className="rounded-xl border border-slate-700 bg-slate-900/40 p-5"
            >

              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

                <div>

                  <h2 className="text-lg font-semibold text-white">
                    {item.events?.title || 'Untitled Event'}
                  </h2>

                  <p className="mt-1 text-sm text-slate-400">
                    {item.events?.location || 'Location TBA'}
                  </p>

                </div>

                <span
                  className={`inline-flex rounded-full px-3 py-1 text-sm font-medium capitalize ${statusStyles[item.status]}`}
                >
                  {item.status}
                </span>

              </div>

              <div className="mt-5 space-y-3">
                <div className="grid gap-3 text-sm">

                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">
                      Event Date
                    </span>

                    <span className="text-white">
                      {item.events?.event_date
                        ? new Date(item.events.event_date).toLocaleString()
                        : '-'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">
                      Scanned At
                    </span>

                    <span className="text-white">
                      {new Date(item.scanned_at).toLocaleString()}
                    </span>
                  </div>

                </div>

              </div>
            </div>
          ))}

          {!data.length && !error && (
            <div className="rounded-xl border border-slate-700 bg-slate-900/40 py-16 text-center">

              <h2 className="text-lg font-semibold text-white">
                No attendance records
              </h2>

              <p className="mt-2 text-slate-400">
                Your attendance history will appear here once you attend an event.
              </p>

            </div>
          )}

        </div>
      </div>
    </div>
  )
}