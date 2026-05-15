'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, MessageCircle, FileText, Users, Send, PlusCircle, LogOut } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

export default function CommunityPageClient({
  community, threads, initialMessages, members,
  isJoined: initJoined, currentUserId, isDemo
}) {
  const [activeTab, setActiveTab] = useState('chat')
  const [messages, setMessages] = useState(initialMessages)
  const [newMessage, setNewMessage] = useState('')
  const [joined, setJoined] = useState(initJoined)
  const [threadList, setThreadList] = useState(threads)
  const [newThreadTitle, setNewThreadTitle] = useState('')
  const [newThreadContent, setNewThreadContent] = useState('')
  const [showNewThread, setShowNewThread] = useState(false)
  const [sending, setSending] = useState(false)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Supabase Realtime subscription (production only)
  useEffect(() => {
    if (isDemo) return
    let channel
    const setup = async () => {
      const { createClient } = await import('@/lib/supabase/client')
      const supabase = createClient()
      channel = supabase
        .channel(`community-${community.id}`)
        .on('postgres_changes', {
          event: 'INSERT', schema: 'public', table: 'messages',
          filter: `community_id=eq.${community.id}`
        }, async (payload) => {
          const { data } = await supabase
            .from('messages').select('*, profiles(name)').eq('id', payload.new.id).single()
          if (data) setMessages(prev => [...prev, data])
        })
        .subscribe()
    }
    setup()
    return () => channel?.unsubscribe()
  }, [community.id, isDemo])

  const handleJoin = async () => {
    if (isDemo) { setJoined(!joined); return }
    const { createClient } = await import('@/lib/supabase/client')
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (joined) {
      await supabase.from('community_members').delete().match({ community_id: community.id, profile_id: user.id })
    } else {
      await supabase.from('community_members').insert({ community_id: community.id, profile_id: user.id })
    }
    setJoined(!joined)
  }

  const sendMessage = async (e) => {
    e.preventDefault()
    if (!newMessage.trim() || sending) return
    setSending(true)

    const tempMsg = {
      id: `temp-${Date.now()}`,
      content: newMessage.trim(),
      sender_id: currentUserId,
      created_at: new Date().toISOString(),
      profiles: { name: 'You' },
    }
    setMessages(prev => [...prev, tempMsg])
    setNewMessage('')

    if (!isDemo) {
      const { createClient } = await import('@/lib/supabase/client')
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      await supabase.from('messages').insert({
        community_id: community.id,
        sender_id: user.id,
        content: tempMsg.content,
      })
    }
    setSending(false)
  }

  const postThread = async (e) => {
    e.preventDefault()
    if (!newThreadTitle.trim()) return
    const thread = {
      id: `thread-${Date.now()}`,
      community_id: community.id,
      title: newThreadTitle,
      content: newThreadContent,
      created_by: currentUserId,
      created_at: new Date().toISOString(),
      profiles: { name: 'You' },
      reply_count: 0,
    }
    setThreadList(prev => [thread, ...prev])
    setNewThreadTitle('')
    setNewThreadContent('')
    setShowNewThread(false)

    if (!isDemo) {
      const { createClient } = await import('@/lib/supabase/client')
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      await supabase.from('community_threads').insert({
        community_id: community.id,
        title: newThreadTitle,
        content: newThreadContent,
        created_by: user.id,
      })
    }
  }

  const isMine = (msg) => msg.sender_id === currentUserId

  return (
    <div className="max-w-7xl mx-auto animate-fade-in">
      <Link href="/communities" className="inline-flex items-center gap-2 text-gray-500 hover:text-blue-600 mb-6 transition-colors text-sm font-medium">
        <ArrowLeft size={18} /> Back to Communities
      </Link>

      {/* Header */}
      <div className="glass-card p-6 mb-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <span className="text-4xl">{community.icon}</span>
        <div className="flex-1">
          <h1 className="text-2xl font-extrabold text-gray-900">{community.name}</h1>
          <p className="text-gray-500 text-sm mt-1">{community.description}</p>
          <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
            <span>{community.member_count} members</span>
            <span>·</span>
            <span>{community.category}</span>
          </div>
        </div>
        <button
          onClick={handleJoin}
          className={`shrink-0 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all flex items-center gap-2 ${
            joined
              ? 'bg-red-50 text-red-600 border border-red-200 hover:bg-red-100'
              : 'btn-primary'
          }`}
        >
          {joined ? <><LogOut size={16} /> Leave</> : 'Join Community'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main area */}
        <div className="lg:col-span-3 space-y-4">
          {/* Sub-tabs */}
          <div className="flex gap-1 bg-white/60 backdrop-blur p-1 rounded-2xl border border-white/50 w-fit">
            {[{ id: 'chat', label: 'Live Chat', icon: <MessageCircle size={16} /> },
              { id: 'discussions', label: 'Discussions', icon: <FileText size={16} /> }].map(t => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                  activeTab === t.id ? 'bg-blue-600 text-white shadow' : 'text-gray-600 hover:bg-blue-50'
                }`}
              >
                {t.icon} {t.label}
              </button>
            ))}
          </div>

          {/* Chat Tab */}
          {activeTab === 'chat' && (
            <div className="glass-card flex flex-col" style={{ height: '520px' }}>
              <div className="flex-1 overflow-y-auto p-5 space-y-3">
                {messages.length === 0 && (
                  <div className="text-center text-gray-400 text-sm py-10">No messages yet. Start the conversation!</div>
                )}
                {messages.map(msg => (
                  <div key={msg.id} className={`flex ${isMine(msg) ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[75%] ${isMine(msg) ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
                      {!isMine(msg) && (
                        <span className="text-xs font-semibold text-gray-500 pl-1">{msg.profiles?.name}</span>
                      )}
                      <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                        isMine(msg)
                          ? 'bg-blue-600 text-white rounded-br-sm'
                          : 'bg-white border border-gray-100 text-gray-800 rounded-bl-sm shadow-sm'
                      }`}>
                        {msg.content}
                      </div>
                      <span className="text-xs text-gray-300 px-1">
                        {formatDistanceToNow(new Date(msg.created_at), { addSuffix: true })}
                      </span>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              <form onSubmit={sendMessage} className="border-t border-gray-100 p-4 flex gap-3">
                <input
                  value={newMessage}
                  onChange={e => setNewMessage(e.target.value)}
                  placeholder={joined ? 'Type a message…' : 'Join the community to chat'}
                  className="input-field flex-1 bg-white/80"
                  disabled={!joined}
                />
                <button
                  type="submit"
                  disabled={!newMessage.trim() || !joined || sending}
                  className="btn-primary shrink-0 px-4"
                >
                  <Send size={18} />
                </button>
              </form>
            </div>
          )}

          {/* Discussions Tab */}
          {activeTab === 'discussions' && (
            <div className="space-y-4">
              {joined && (
                <div>
                  {!showNewThread ? (
                    <button onClick={() => setShowNewThread(true)} className="btn-primary">
                      <PlusCircle size={18} /> New Thread
                    </button>
                  ) : (
                    <form onSubmit={postThread} className="glass-card p-5 space-y-3">
                      <h4 className="font-bold text-gray-900">Start a new discussion</h4>
                      <input
                        value={newThreadTitle}
                        onChange={e => setNewThreadTitle(e.target.value)}
                        placeholder="Thread title"
                        className="input-field bg-white/80"
                        required
                      />
                      <textarea
                        value={newThreadContent}
                        onChange={e => setNewThreadContent(e.target.value)}
                        placeholder="Share your thoughts…"
                        className="input-field min-h-[80px] bg-white/80"
                      />
                      <div className="flex gap-2">
                        <button type="submit" className="btn-primary">Post</button>
                        <button type="button" onClick={() => setShowNewThread(false)} className="btn-secondary">Cancel</button>
                      </div>
                    </form>
                  )}
                </div>
              )}

              {threadList.length === 0 ? (
                <div className="glass-card p-8 text-center text-gray-400 text-sm">No discussions yet. Start one!</div>
              ) : (
                threadList.map(t => (
                  <div key={t.id} className="glass-card p-5 hover:ring-2 hover:ring-blue-300/40 transition-all cursor-pointer">
                    <h4 className="font-bold text-gray-900 mb-1">{t.title}</h4>
                    {t.content && <p className="text-gray-500 text-sm mb-3 line-clamp-2">{t.content}</p>}
                    <div className="flex items-center gap-4 text-xs text-gray-400">
                      <span>by <strong className="text-gray-600">{t.profiles?.name}</strong></span>
                      <span>·</span>
                      <span>{formatDistanceToNow(new Date(t.created_at), { addSuffix: true })}</span>
                      <span className="ml-auto">{t.reply_count ?? 0} replies</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Members sidebar */}
        <div className="lg:col-span-1">
          <div className="glass-card p-5 sticky top-24">
            <h3 className="section-title flex items-center gap-2 mb-4">
              <Users size={16} className="text-blue-600" /> Members
              <span className="ml-auto text-xs text-gray-400 font-normal">{members.length}</span>
            </h3>
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {members.map(m => (
                <Link key={m.profile_id} href={`/profile/${m.profile_id}`}
                  className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-blue-50 transition-colors group"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-100 to-indigo-100 text-blue-700 font-bold flex items-center justify-center text-sm shrink-0">
                    {m.profiles?.name?.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors truncate">{m.profiles?.name}</p>
                    {m.role === 'admin' && <span className="text-xs text-indigo-500 font-medium">Admin</span>}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
