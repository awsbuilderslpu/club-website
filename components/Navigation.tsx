"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { supabaseBrowser } from "@/lib/supabase/client"

function NavItem({
  href,
  children,
  active = false,
}: {
  href: string
  children: React.ReactNode
  active?: boolean
}) {
  return (
    <Link
      href={href}
      className={`rounded-full px-5 py-2 text-sm font-medium transition-all duration-200 ${
        active
          ? "bg-cyan-400 text-[#08192F] shadow-lg shadow-cyan-400/20"
          : "text-blue-100 hover:bg-cyan-400/10 hover:text-cyan-300"
      }`}
    >
      {children}
    </Link>
  )
}

export function NavigationBar() {
  const router = useRouter()
  const pathname = usePathname()

  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)

  useEffect(() => {
    const loadSession = async () => {
      const {
        data: { session },
      } = await supabaseBrowser.auth.getSession()

      setIsAuthenticated(!!session)
    }

    loadSession()

    const {
      data: { subscription },
    } = supabaseBrowser.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleSignOut = async () => {
    await supabaseBrowser.auth.signOut()

    router.push("/")
    router.refresh()
  }

  return (
    <header className="fixed inset-x-0 top-5 z-50 flex justify-center px-4">
      <nav className="flex w-full max-w-7xl items-center justify-between rounded-full border border-cyan-400/15 bg-[#071525]/75 px-4 py-3 shadow-2xl backdrop-blur-2xl">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-3 rounded-full px-2 py-1 transition hover:bg-cyan-400/10"
        >
          <img
            src="/image/logo/aws_student_builder_group.png"
            alt="AWS Student Builder Group"
            className="h-11 w-11"
          />

          <div className="hidden lg:block leading-tight">
            <p className="font-semibold text-white">
              AWS Student Builder Group
            </p>
            <p className="text-xs text-cyan-300/70">
              Lovely Professional University
            </p>
          </div>
        </Link>

        <div className="hidden items-center rounded-full border border-cyan-400/10 bg-white/5 p-1 md:flex">
          <NavItem href="/" active={pathname === "/"}>
            Home
          </NavItem>

          <NavItem href="/events" active={pathname === "/events"}>
            Events
          </NavItem>

          <NavItem href="/about" active={pathname === "/about"}>
            About
          </NavItem>

          <NavItem href="/team" active={pathname === "/team"}>
            Team
          </NavItem>

          {isAuthenticated && (
            <NavItem
              href="/dashboard"
              active={pathname.startsWith("/dashboard")}
            >
              Dashboard
            </NavItem>
          )}
        </div>

        <div className="flex items-center gap-2">
          {isAuthenticated === null && (
            <div className="h-10 w-24 animate-pulse rounded-full bg-cyan-400/10" />
          )}

          {isAuthenticated === false && (
            <>
              <Link
                href="/auth/login"
                className="rounded-full px-5 py-2 text-sm font-medium text-blue-100 transition hover:bg-cyan-400/10 hover:text-cyan-300"
              >
                Login
              </Link>

              <Link
                href="/auth/register"
                className="rounded-full bg-gradient-to-r from-cyan-400 to-sky-400 px-5 py-2 text-sm font-semibold text-[#071525] transition hover:scale-105 hover:shadow-lg hover:shadow-cyan-400/25"
              >
                Register
              </Link>
            </>
          )}

          {isAuthenticated === true && (
            <button
              onClick={handleSignOut}
              className="rounded-full border border-red-400/20 bg-red-500/10 px-5 py-2 text-sm font-medium text-red-300 transition hover:bg-red-500/20"
            >
              Logout
            </button>
          )}
        </div>
      </nav>
    </header>
  )
}