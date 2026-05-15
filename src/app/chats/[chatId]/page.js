import { cookies } from 'next/headers'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { isDemoMode } from '@/lib/demo/demoSession'
import { DEMO_PRIVATE_CHATS, DEMO_PRIVATE_MESSAGES, DEMO_USER } from '@/lib/demo/mockData'
import PrivateChatClient from './PrivateChatClient'

export default async function PrivateChatPage({ params }) {
  const cookieStore = cookies()
  const isDemo = isDemoMode(cookieStore)

  let chat, messages, currentUserId, otherUser

  if (isDemo) {
    chat = DEMO_PRIVATE_CHATS.find(c => c.id === params.chatId) ?? DEMO_PRIVATE_CHATS[0]
    messages = DEMO_PRIVATE_MESSAGES[chat.id] ?? []
    currentUserId = DEMO_USER.id
    otherUser = chat.other_user
  } else {
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      currentUserId = user?.id

      const { data } = await supabase
        .from('private_chats')
        .select(`
          *,
          p1:profiles!private_chats_participant1_id_fkey(id, name, branch),
          p2:profiles!private_chats_participant2_id_fkey(id, name, branch)
        `)
        .eq('id', params.chatId)
        .single()

      if (!data) notFound()
      chat = data
      otherUser = data.participant1_id === user.id ? data.p2 : data.p1

      const { data: msgs } = await supabase
        .from('messages')
        .select('*, profiles(name)')
        .eq('chat_id', params.chatId)
        .order('created_at', { ascending: true })
      messages = msgs ?? []
    } catch {
      notFound()
    }
  }

  return (
    <PrivateChatClient
      chat={chat}
      initialMessages={messages}
      currentUserId={currentUserId}
      otherUser={otherUser}
      isDemo={isDemo}
    />
  )
}
