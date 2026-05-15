import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import { DEMO_COOKIE, DEMO_COOKIE_VALUE } from '@/lib/demo/demoSession'
import { DEMO_USER } from '@/lib/demo/mockData'

const inter = Inter({ subsets: ['latin'], display: 'swap' })

export const metadata = {
  title: 'ProjectHub for Students | Find Your Project Team',
  description: 'The ultimate collaboration platform for college students. Find project teammates, build amazing projects, and earn peer endorsements.',
  keywords: 'student projects, collaboration, hackathon, team finder, college',
}

export default async function RootLayout({ children }) {
  let user = null

  try {
    const cookieStore = cookies()
    const isDemo = cookieStore.get(DEMO_COOKIE)?.value === DEMO_COOKIE_VALUE

    if (isDemo) {
      user = DEMO_USER
    } else {
      const supabase = createClient()
      const { data } = await supabase.auth.getUser()
      user = data?.user ?? null
    }
  } catch {
    // fallback — no crash
  }

  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        {/* Background ambient orbs */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
          <div className="orb orb-blue w-[600px] h-[600px] -top-40 -right-20 opacity-40" />
          <div className="orb orb-indigo w-[400px] h-[400px] top-1/2 -left-32 opacity-30" style={{ animationDelay: '3s' }} />
          <div className="orb orb-purple w-[300px] h-[300px] bottom-20 right-1/3 opacity-25" style={{ animationDelay: '6s' }} />
        </div>

        <div className="relative z-10 flex flex-col min-h-screen">
          <Navbar user={user} />
          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {children}
          </main>

          <footer className="border-t border-gray-100 bg-white/50 backdrop-blur-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row justify-between items-center gap-3 text-sm text-gray-400">
              <span>© 2025 <strong className="text-gray-600">ProjectHub</strong> · Kalasalingam University</span>
              <span className="flex items-center gap-2">
                Built for students, by students 🚀
              </span>
            </div>
          </footer>
        </div>
      </body>
    </html>
  )
}
