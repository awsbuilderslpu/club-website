'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { AlertCircle } from 'lucide-react'

type ProfileResponse = {
  profile: {
    id: string
    email: string | null
    role: 'member' | 'core' | 'admin'
    full_name: string
    avatar_url: string
    workspace_uid: string
    workspace_name: string
  }
}

export default function ProfilePage() {
  const router = useRouter()

  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const [accountData, setAccountData] =
    useState<ProfileResponse['profile'] | null>(null)

  const [formData, setFormData] = useState({
    full_name: '',
    avatar_url: '',
    workspace_uid: '',
    workspace_name: '',
  })

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch('/api/profile/update', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })

        const data = (await response.json()) as ProfileResponse & {
          error?: string
        }

        if (!response.ok) {
          setError(data.error || 'Failed to load profile')
          return
        }

        setAccountData(data.profile)

        setFormData({
          full_name: data.profile.full_name || '',
          avatar_url: data.profile.avatar_url || '',
          workspace_uid: data.profile.workspace_uid || '',
          workspace_name: data.profile.workspace_name || '',
        })
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to load profile'
        )
      } finally {
        setIsFetching(false)
      }
    }

    void fetchProfile()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    setError(null)
    setSuccessMessage(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    setIsLoading(true)
    setError(null)
    setSuccessMessage(null)

    try {
      const response = await fetch('/api/profile/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        const detailMessage = data?.details
          ? Object.values(data.details).flat().find(Boolean)
          : null

        setError(
          (detailMessage as string) ||
            data.error ||
            'Failed to update profile'
        )
        return
      }

      setSuccessMessage('Profile updated successfully')

      setAccountData((prev) => {
        if (!prev) return prev

        return {
          ...prev,
          full_name: formData.full_name.trim(),
          avatar_url: formData.avatar_url.trim(),
          workspace_uid: formData.workspace_uid.trim(),
          workspace_name: formData.workspace_name.trim(),
        }
      })

      router.refresh()
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Something went wrong'
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0B1D3A] to-[#132E59] px-4 py-32">
      <div className="mx-auto max-w-5xl">

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">
            Profile
          </h1>

          <p className="mt-2 text-slate-300">
            Manage your account information.
          </p>
        </div>

        {isFetching ? (
          <div className="rounded-xl border border-slate-700 bg-slate-900/40 p-8 text-center text-slate-300">
            Loading profile...
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[280px_1fr]">

            {/* Left Card */}

            <aside className="rounded-xl border border-slate-700 bg-slate-900/40 p-6">

              <div className="flex flex-col items-center text-center">

                <img
                  src={
                    formData.avatar_url ||
                    'https://ui-avatars.com/api/?name=User&background=0f172a&color=fff'
                  }
                  alt="Avatar"
                  className="h-24 w-24 rounded-full border border-slate-700 object-cover"
                />

                <h2 className="mt-4 text-lg font-semibold text-white">
                  {formData.full_name || 'Unnamed User'}
                </h2>

                <span className="mt-2 rounded-full bg-cyan-500/20 px-3 py-1 text-sm capitalize text-cyan-300">
                  {accountData?.role}
                </span>

              </div>

              <div className="mt-8 space-y-5">

                <div>
                  <p className="text-xs text-slate-500">
                    Email
                  </p>

                  <p className="mt-1 break-all text-sm text-white">
                    {accountData?.email}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-500">
                    User ID
                  </p>

                  <p className="mt-1 break-all font-mono text-xs text-slate-300">
                    {accountData?.id}
                  </p>
                </div>

              </div>

            </aside>

            {/* Right Card */}

            <form
              onSubmit={handleSubmit}
              className="rounded-xl border border-slate-700 bg-slate-900/40 p-6"
            >

              {error && (
                <div className="mb-6 flex gap-3 rounded-lg border border-red-500/30 bg-red-500/10 p-4">
                  <AlertCircle
                    size={20}
                    className="mt-0.5 shrink-0 text-red-400"
                  />

                  <p className="text-sm text-red-200">
                    {error}
                  </p>
                </div>
              )}

              {successMessage && (
                <div className="mb-6 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-300">
                  {successMessage}
                </div>
              )}

              <div className="space-y-5">
                                <div>
                  <label
                    htmlFor="full_name"
                    className="mb-2 block text-sm font-medium text-slate-200"
                  >
                    Full Name
                  </label>

                  <input
                    id="full_name"
                    name="full_name"
                    type="text"
                    value={formData.full_name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    required
                    className="w-full rounded-lg border border-slate-700 bg-slate-900/60 px-4 py-3 text-white placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label
                    htmlFor="avatar_url"
                    className="mb-2 block text-sm font-medium text-slate-200"
                  >
                    Avatar URL
                  </label>

                  <input
                    id="avatar_url"
                    name="avatar_url"
                    type="url"
                    value={formData.avatar_url}
                    onChange={handleChange}
                    placeholder="https://example.com/avatar.jpg"
                    className="w-full rounded-lg border border-slate-700 bg-slate-900/60 px-4 py-3 text-white placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none"
                  />
                </div>

                <div className="grid gap-5 md:grid-cols-2">

                  <div>
                    <label
                      htmlFor="workspace_uid"
                      className="mb-2 block text-sm font-medium text-slate-200"
                    >
                      Workspace UID
                    </label>

                    <input
                      id="workspace_uid"
                      name="workspace_uid"
                      type="text"
                      value={formData.workspace_uid}
                      onChange={handleChange}
                      placeholder="12217859"
                      required
                      className="w-full rounded-lg border border-slate-700 bg-slate-900/60 px-4 py-3 text-white placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="workspace_name"
                      className="mb-2 block text-sm font-medium text-slate-200"
                    >
                      Workspace Name
                    </label>

                    <input
                      id="workspace_name"
                      name="workspace_name"
                      type="text"
                      value={formData.workspace_name}
                      onChange={handleChange}
                      placeholder="Lovely Professional University"
                      required
                      className="w-full rounded-lg border border-slate-700 bg-slate-900/60 px-4 py-3 text-white placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none"
                    />
                  </div>

                </div>
              </div>

              <div className="mt-8 flex justify-end">
                <button
                  type="submit"
                  disabled={isLoading || isFetching}
                  className="rounded-lg bg-cyan-400 px-6 py-3 font-medium text-slate-900 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>

            </form>

          </div>
        )}
      </div>
    </div>
  )
}