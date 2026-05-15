import { cookies } from 'next/headers'
import { createClient } from '@/lib/supabase/server'
import { isDemoMode } from '@/lib/demo/demoSession'
import { DEMO_USER, DEMO_PROFILE } from '@/lib/demo/mockData'
import DashboardClient from './DashboardClient'
import { DEMO_PROJECTS, DEMO_COMMUNITIES, DEMO_PRIVATE_CHATS } from '@/lib/demo/mockData'

export default async function Dashboard({ searchParams }) {
  const cookieStore = cookies()
  const isDemo = isDemoMode(cookieStore)
  const tab = searchParams?.tab || 'board'

  let projects = [], communities = [], joinedCommunities = [], chats = [], profile = null

  if (isDemo) {
    projects = DEMO_PROJECTS
    communities = DEMO_COMMUNITIES
    joinedCommunities = DEMO_COMMUNITIES.filter(c => c.joined)
    chats = DEMO_PRIVATE_CHATS
    profile = DEMO_PROFILE
  } else {
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      const [{ data: p }, { data: prof }] = await Promise.all([
        supabase.from('projects').select('*').eq('status', 'open').order('created_at', { ascending: false }),
        supabase.from('profiles').select('*').eq('id', user?.id).single(),
      ])
      projects = p ?? []
      profile = prof

      const { data: cm } = await supabase
        .from('community_members').select('community_id').eq('profile_id', user?.id)
      const joinedIds = cm?.map(m => m.community_id) ?? []

      const { data: comms } = await supabase.from('communities').select('*').order('member_count', { ascending: false })
      communities = (comms ?? []).map(c => ({ ...c, joined: joinedIds.includes(c.id) }))
      joinedCommunities = communities.filter(c => c.joined)

      const { data: ch } = await supabase
        .from('private_chats')
        .select('*, messages(content, created_at)')
        .or(`participant1_id.eq.${user?.id},participant2_id.eq.${user?.id}`)
        .order('created_at', { ascending: false })
      chats = ch ?? []
    } catch { /* fallback */ }
  }

  return (
    <DashboardClient
      initialTab={tab}
      projects={projects}
      communities={communities}
      joinedCommunities={joinedCommunities}
      chats={chats}
      currentUserId={isDemo ? DEMO_USER.id : null}
      isDemo={isDemo}
      searchQuery={searchParams?.search || ''}
      categoryFilter={searchParams?.category || ''}
    />
  )
}
