import { cookies } from 'next/headers'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { isDemoMode } from '@/lib/demo/demoSession'
import { DEMO_USER, DEMO_COMMUNITIES, DEMO_COMMUNITY_THREADS, DEMO_COMMUNITY_MESSAGES, DEMO_COMMUNITY_MEMBERS } from '@/lib/demo/mockData'
import CommunityPageClient from './CommunityPageClient'

export default async function CommunityPage({ params }) {
  const cookieStore = cookies()
  const isDemo = isDemoMode(cookieStore)

  let community, threads, initialMessages, members, isJoined, currentUserId

  if (isDemo) {
    community = DEMO_COMMUNITIES.find(c => c.id === params.id) ?? DEMO_COMMUNITIES[0]
    threads = DEMO_COMMUNITY_THREADS.filter(t => t.community_id === community.id)
    initialMessages = DEMO_COMMUNITY_MESSAGES[community.id] ?? []
    members = DEMO_COMMUNITY_MEMBERS[community.id] ?? []
    isJoined = community.joined
    currentUserId = DEMO_USER.id
  } else {
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      currentUserId = user?.id

      const { data } = await supabase.from('communities').select('*').eq('id', params.id).single()
      if (!data) notFound()
      community = data

      const { data: cm } = await supabase.from('community_members').select('profile_id').eq('community_id', params.id)
      const joinedSet = cm?.map(m => m.profile_id) ?? []
      isJoined = joinedSet.includes(user?.id)

      const { data: th } = await supabase
        .from('community_threads').select('*, profiles(name)').eq('community_id', params.id).order('created_at', { ascending: false })
      threads = th ?? []

      const { data: msgs } = await supabase
        .from('messages').select('*, profiles(name)').eq('community_id', params.id).order('created_at', { ascending: true }).limit(50)
      initialMessages = msgs ?? []

      const { data: mems } = await supabase
        .from('community_members').select('profile_id, profiles(name, branch), role').eq('community_id', params.id)
      members = mems ?? []
    } catch {
      notFound()
    }
  }

  return (
    <CommunityPageClient
      community={community}
      threads={threads}
      initialMessages={initialMessages}
      members={members}
      isJoined={isJoined}
      currentUserId={currentUserId}
      isDemo={isDemo}
    />
  )
}
