'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  User,
  Calendar,
  Ticket,
  Shield,
  ArrowRight,
} from 'lucide-react'
import ProfileCompletionModal from '@/components/ProfileCompletionModal'

type DashboardClientProps = {
  displayName: string
  email: string
  role: string
  isProfileIncomplete: boolean
  workspaceUid: string
  workspaceName: string
  upcomingEvent: {
    id: string
    title: string
    eventDate: string
    location: string | null
  } | null
}

export default function DashboardClient({
  displayName,
  email,
  role,
  isProfileIncomplete,
  upcomingEvent,
}: DashboardClientProps) {
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    if (isProfileIncomplete) {
      setShowModal(true)
    }
  }, [isProfileIncomplete])

  const actions = [
    {
      title: 'Profile',
      href: '/profile',
      icon: User,
    },
    {
      title: 'Certificates',
      href: '/certificates',
      icon: Ticket,
    },
    {
      title: 'Attendance',
      href: '/attendance/my',
      icon: Calendar,
    },
  ]

  return (
    <>
      <div className="min-h-screen bg-[#09090B] pt-28 pb-12 text-white">
        <div className="mx-auto max-w-5xl px-6">

          <div className="mb-10">
            <p className="text-sm text-zinc-500">
              Dashboard
            </p>

            <h1 className="mt-2 text-4xl font-semibold tracking-tight">
              Welcome back,
              <span className="text-cyan-400"> {displayName}</span>
            </h1>

            <p className="mt-2 text-zinc-400">
              {role === 'admin' ? 'Administrator' : 'Member'} • {email}
            </p>
          </div>

          <div className="mb-8 rounded-2xl border border-white/10 bg-[#111113] p-6 transition hover:border-cyan-400/30">
            <div className="flex items-start justify-between gap-6">

              <div>
                <p className="text-sm text-zinc-500">
                  Upcoming Event
                </p>

                {upcomingEvent ? (
                  <>
                    <h2 className="mt-2 text-2xl font-semibold">
                      {upcomingEvent.title}
                    </h2>

                    <p className="mt-2 text-zinc-400">
                      {new Date(
                        upcomingEvent.eventDate
                      ).toLocaleDateString()}
                      {upcomingEvent.location &&
                        ` • ${upcomingEvent.location}`}
                    </p>
                  </>
                ) : (
                  <>
                    <h2 className="mt-2 text-xl font-semibold">
                      No upcoming events
                    </h2>

                    <p className="mt-2 text-zinc-400">
                      You'll see your next registered event here.
                    </p>
                  </>
                )}
              </div>

              {upcomingEvent && (
                <Link
                  href={`/attendance/ticket?eventId=${upcomingEvent.id}`}
                  className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-medium text-black transition hover:bg-zinc-200"
                >
                  View Ticket
                  <ArrowRight size={16} />
                </Link>
              )}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

            {actions.map((action) => {
              const Icon = action.icon

              return (
                <Link
                  key={action.title}
                  href={action.href}
                  className="group rounded-2xl border border-white/10 bg-[#111113] p-5 transition-all duration-200 hover:-translate-y-1 hover:border-cyan-400/30"
                >
                  <Icon
                    size={22}
                    className="text-cyan-400"
                  />

                  <h3 className="mt-4 font-medium">
                    {action.title}
                  </h3>

                  <p className="mt-1 text-sm text-zinc-500">
                    Open {action.title.toLowerCase()}
                  </p>
                </Link>
              )
            })}

            {role === 'admin' && (
              <Link
                href="/admin"
                className="group rounded-2xl border border-cyan-500/20 bg-cyan-500/10 p-5 transition-all duration-200 hover:-translate-y-1 hover:border-cyan-400"
              >
                <Shield
                  size={22}
                  className="text-cyan-400"
                />

                <h3 className="mt-4 font-medium">
                  Admin Panel
                </h3>

                <p className="mt-1 text-sm text-zinc-400">
                  Manage members & events
                </p>
              </Link>
            )}
          </div>
        </div>
      </div>

      <ProfileCompletionModal
        isOpen={showModal}
      />
    </>
  )
}