"use client"

import { useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import Link from "next/link"
import { supabaseBrowser } from "@/lib/supabase/client"

export function NavigationBar() {
  const router = useRouter()
  const pathname = usePathname()
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)

  useEffect(() => {
    let isMounted = true

    const syncSession = async () => {
      const { data } = await supabaseBrowser.auth.getSession()

      if (isMounted) {
        setIsAuthenticated(!!data.session)
      }
    }

    syncSession()

    const {
      data: { subscription },
    } = supabaseBrowser.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session)
    })

    return () => {
      isMounted = false
      subscription.unsubscribe()
    }
  }, [])

  const handleSignOut = async () => {
    await supabaseBrowser.auth.signOut()
    router.push("/")
    router.refresh()
  }

  const showAuthLinks = isAuthenticated === false
  const showDashboardLink = isAuthenticated === true

  return (
    <nav className="fixed top-0 left-0 right-0 z-50">
      <div className="absolute inset-0 bg-blue-950/90 opacity-95"></div>
      <div className="absolute inset-0 bg-linear-to-b from-cyan-500/3 to-transparent"></div>
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-cyan-400/40"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="flex items-center gap-3 group relative">
            <div className="relative">
              <img src="/image/logo/aws_student_builder_group.png" alt="AWS Student Builder Group" className="h-12 relative z-10 group-hover:scale-105 transition-transform" />
            </div>
            <div className="hidden md:block border-l-2 border-cyan-400/40 pl-3">
              <div className="text-white font-bold text-base tracking-wider uppercase">AWS Student Builder Group</div>
            </div>
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/" className="text-blue-100 hover:text-cyan-300 transition-colors font-mono text-xs uppercase tracking-widest relative group">
              HOME
              <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-cyan-400 scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
            </Link>
            <Link href="/#about" className="text-blue-100 hover:text-cyan-300 transition-colors font-mono text-xs uppercase tracking-widest relative group hidden sm:block">
              About Us
              <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-cyan-400 scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
            </Link>
            <Link href="/events" className="text-blue-100 hover:text-cyan-300 transition-colors font-mono text-xs uppercase tracking-widest relative group hidden sm:block">
              EVENTS
              <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-cyan-400 scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
            </Link>
            {showDashboardLink ? (
              <>
                <Link href="/dashboard" className={`text-blue-100 hover:text-cyan-300 transition-colors font-mono text-xs uppercase tracking-widest relative group ${pathname?.startsWith('/dashboard') ? 'text-cyan-300' : ''}`}>
                  DASHBOARD
                  <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-cyan-400 scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
                </Link>
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="text-blue-100 hover:text-cyan-300 transition-colors font-mono text-xs uppercase tracking-widest relative group"
                >
                  LOGOUT
                  <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-cyan-400 scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
                </button>
              </>
            ) : null}
            {showAuthLinks ? (
              <>
                <Link href="/auth/login" className={`text-blue-100 hover:text-cyan-300 transition-colors font-mono text-xs uppercase tracking-widest relative group ${pathname === '/auth/login' ? 'text-cyan-300' : ''}`}>
                  LOGIN
                  <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-cyan-400 scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
                </Link>
                <Link href="/auth/register" className={`text-blue-100 hover:text-cyan-300 transition-colors font-mono text-xs uppercase tracking-widest relative group ${pathname === '/auth/register' ? 'text-cyan-300' : ''}`}>
                  REGISTER
                  <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-cyan-400 scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
                </Link>
              </>
            ) : null}
          </div>
        </div>
      </div>
    </nav>
  )
}
