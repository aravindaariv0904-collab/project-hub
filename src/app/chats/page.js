import { cookies } from 'next/headers'
import Link from 'next/link'
import { MessageSquare, Clock } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { isDemoMode } from '@/lib/demo/demoSession'
import { DEMO_PRIVATE_CHATS, DEMO_USER } from '@/lib/demo/mockData'
import { formatDistanceToNow } from 'date-fns'

export default async function ChatsPage() {
  const cookieStore = cookies()
  const isDemo = isDemoMode(cookieStore)

  let chats = [], currentUserId

  if (isDemo) {
    chats = DEMO_PRIVATE_CHATS
    currentUserId = DEMO_USER.id
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
        .or(`participant1_id.eq.${user.id},participant2_id.eq.${user.id}`)
        .order('created_at', { ascending: false })

      chats = (data ?? []).map(c => ({
        ...c,
        other_user: c.participant1_id === user.id ? c.p2 : c.p1,
      }))
    } catch { /* fallback */ }
  }

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="page-title flex items-center gap-3">
            <span className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md">
              <MessageSquare size={20} />
            </span>
            Messages
          </h1>
          <p className="text-gray-500 mt-1 text-sm">{chats.length} conversation{chats.length !== 1 ? 's' : ''}</p>
        </div>
      </div>

      {chats.length === 0 ? (
        <div className="glass-card p-12 text-center space-y-4">
          <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center text-blue-200 mx-auto">
            <MessageSquare size={32} />
          </div>
          <div>
            <h3 className="section-title mb-2">No conversations yet</h3>
            <p className="text-gray-400 text-sm">Visit someone's profile to start a private conversation.</p>
          </div>
          <Link href="/dashboard" className="btn-primary inline-flex mt-2">Browse Projects</Link>
        </div>
      ) : (
        <div className="space-y-2">
          {chats.map(chat => (
            <Link key={chat.id} href={`/chats/${chat.id}`} className="block group">
              <div className="glass-card p-4 flex items-center gap-4 group-hover:ring-2 group-hover:ring-blue-300/40 transition-all">
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-blue-100 to-indigo-100 text-blue-700 font-bold flex items-center justify-center text-lg shrink-0">
                  {chat.other_user?.name?.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {chat.other_user?.name}
                      </p>
                      <p className="text-xs text-gray-400">{chat.other_user?.branch}</p>
                    </div>
                    <span className="text-xs text-gray-400 shrink-0 ml-2 flex items-center gap-1">
                      <Clock size={11} />
                      {formatDistanceToNow(new Date(chat.last_message_at ?? chat.created_at), { addSuffix: true })}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400 truncate mt-1">{chat.last_message ?? 'No messages yet'}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
