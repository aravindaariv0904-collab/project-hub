import { cookies } from 'next/headers'
import Link from 'next/link'
import { Users, Search } from 'lucide-react'
import CommunitiesClient from './CommunitiesClient'
import { createClient } from '@/lib/supabase/server'
import { isDemoMode } from '@/lib/demo/demoSession'
import { DEMO_COMMUNITIES, DEMO_USER } from '@/lib/demo/mockData'

const COMMUNITY_CATEGORIES = ['All', 'Technology', 'Design', 'Events', 'Business', 'Hardware', 'Entertainment']

export default async function CommunitiesPage() {
  const cookieStore = cookies()
  const isDemo = isDemoMode(cookieStore)

  let communities = [], joinedIds = [], currentUserId = null

  if (isDemo) {
    communities = DEMO_COMMUNITIES
    joinedIds = DEMO_COMMUNITIES.filter(c => c.joined).map(c => c.id)
    currentUserId = DEMO_USER.id
  } else {
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      currentUserId = user?.id

      const { data: cm } = await supabase.from('community_members').select('community_id').eq('profile_id', user?.id)
      joinedIds = cm?.map(m => m.community_id) ?? []

      const { data } = await supabase.from('communities').select('*').order('member_count', { ascending: false })
      communities = (data ?? []).map(c => ({ ...c, joined: joinedIds.includes(c.id) }))
    } catch { /* fallback */ }
  }

  return (
    <div className="max-w-7xl mx-auto animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="page-title flex items-center gap-3">
            <span className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md">
              <Users size={20} />
            </span>
            Communities
          </h1>
          <p className="text-gray-500 mt-1">Join communities to connect with like-minded students.</p>
        </div>
      </div>
      <CommunitiesClient communities={communities} joinedIds={joinedIds} currentUserId={currentUserId} isDemo={isDemo} />
    </div>
  )
}
