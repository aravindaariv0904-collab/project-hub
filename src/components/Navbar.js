'use client'

import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { useState } from 'react'
import {
  LayoutDashboard, PlusCircle, LogOut,
  User as UserIcon, Menu, X, Layers,
  Users, MessageSquare
} from 'lucide-react'
import { DEMO_USER } from '@/lib/demo/mockData'
import { DEMO_COOKIE } from '@/lib/demo/demoSession'

export default function Navbar({ user }) {
  const router = useRouter()
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  const isDemo = user?.id === DEMO_USER.id

  const handleLogout = async () => {
    if (isDemo) {
      document.cookie = `${DEMO_COOKIE}=; path=/; max-age=0`
      router.push('/auth/verify')
      router.refresh()
      return
    }
    const { createClient } = await import('@/lib/supabase/client')
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/auth/verify')
    router.refresh()
  }

  const navLinks = user
    ? [
        { href: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={17} /> },
        { href: '/communities', label: 'Communities', icon: <Users size={17} /> },
        { href: '/chats', label: 'Chats', icon: <MessageSquare size={17} /> },
        { href: '/project/create', label: 'Post Project', icon: <PlusCircle size={17} /> },
        { href: `/profile/${user.id}`, label: 'Profile', icon: <UserIcon size={17} /> },
      ]
    : []

  const isActive = (href) => pathname === href || pathname.startsWith(href + '/')

  return (
    <nav className="sticky top-0 z-50 w-full glass border-b border-white/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href={user ? '/dashboard' : '/'} className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 shadow-md flex items-center justify-center text-white group-hover:shadow-glow transition-all">
              <Layers size={18} />
            </div>
            <div className="hidden sm:block">
              <span className="font-extrabold text-lg text-gradient leading-none">ProjectHub</span>
              <span className="text-xs text-gray-400 block leading-none">for Students</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  isActive(link.href)
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-gray-600 hover:bg-blue-50 hover:text-blue-700'
                }`}
              >
                {link.icon}
                {link.label}
              </Link>
            ))}

            {user ? (
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-gray-500 hover:bg-red-50 hover:text-red-600 transition-all ml-2"
              >
                <LogOut size={18} />
                Logout
              </button>
            ) : (
              <Link href="/auth/verify" className="btn-primary ml-4">
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden p-2 rounded-xl hover:bg-gray-100 transition-colors text-gray-600"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden pb-4 pt-2 border-t border-gray-100 mt-2 space-y-1 animate-fade-in">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                  isActive(link.href) ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-blue-50'
                }`}
              >
                {link.icon}
                {link.label}
              </Link>
            ))}
            {user ? (
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-red-600 hover:bg-red-50 transition-all"
              >
                <LogOut size={18} /> Logout
              </button>
            ) : (
              <Link href="/auth/verify" onClick={() => setMobileOpen(false)} className="btn-primary w-full">
                Sign In
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}
