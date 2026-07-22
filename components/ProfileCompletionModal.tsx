'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

type ProfileCompletionModalProps = {
  isOpen: boolean
}

export default function ProfileCompletionModal({
  isOpen,
}: ProfileCompletionModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-xl bg-white shadow-lg">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-slate-900">
            Complete your profile
          </h2>

          <p className="mt-2 text-sm text-slate-600">
            Before continuing, please complete your workspace details.
          </p>

          <div className="mt-6 rounded-lg border p-4 space-y-4">
            <div>
              <p className="font-medium">Workspace UID</p>
              <p className="text-sm text-slate-500">
                Your unique workspace identifier.
              </p>
            </div>

            <div>
              <p className="font-medium">Workspace Name</p>
              <p className="text-sm text-slate-500">
                Your workspace display name.
              </p>
            </div>
          </div>

          <Link
            href="/profile"
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-white hover:bg-slate-800"
          >
            Complete Profile
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  )
}
