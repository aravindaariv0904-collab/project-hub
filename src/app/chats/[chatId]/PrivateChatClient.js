'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Send, User } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

export default function PrivateChatClient({ chat, initialMessages, currentUserId, otherUser, isDemo }) {
  const [messages, setMessages] = useState(initialMessages)
  const [newMessage, setNewMessage] = useState('')
  const [sending, setSending] = useState(false)
  const endRef = useRef(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Supabase Realtime subscription (production only)
  useEffect(() => {
    if (isDemo) return
    let channel
    const setup = async () => {
      const { createClient } = await import('@/lib/supabase/client')
      const supabase = createClient()
      channel = supabase
        .channel(`chat-${chat.id}`)
        .on('postgres_changes', {
          event: 'INSERT', schema: 'public', table: 'messages',
          filter: `chat_id=eq.${chat.id}`
        }, async (payload) => {
          if (payload.new.sender_id === currentUserId) return // already shown optimistically
          const { data } = await supabase
            .from('messages').select('*, profiles(name)').eq('id', payload.new.id).single()
          if (data) setMessages(prev => [...prev, data])
        })
        .subscribe()
    }
    setup()
    return () => channel?.unsubscribe()
  }, [chat.id, currentUserId, isDemo])

  const sendMessage = async (e) => {
    e.preventDefault()
    if (!newMessage.trim() || sending) return
    setSending(true)

    const tempMsg = {
      id: `temp-${Date.now()}`,
      chat_id: chat.id,
      sender_id: currentUserId,
      content: newMessage.trim(),
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
        chat_id: chat.id,
        sender_id: user.id,
        content: tempMsg.content,
      })
    }
    setSending(false)
  }

  const isMine = (msg) => msg.sender_id === currentUserId

  return (
    <div className="max-w-2xl mx-auto animate-fade-in flex flex-col" style={{ height: 'calc(100vh - 160px)' }}>
      {/* Header */}
      <div className="glass-card p-4 mb-4 flex items-center gap-4 shrink-0">
        <Link href="/chats" className="text-gray-400 hover:text-blue-600 transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-100 to-indigo-100 text-blue-700 font-bold flex items-center justify-center text-base shrink-0">
          {otherUser?.name?.charAt(0)}
        </div>
        <div className="flex-1">
          <Link href={`/profile/${otherUser?.id}`} className="font-bold text-gray-900 hover:text-blue-600 transition-colors block">
            {otherUser?.name}
          </Link>
          <p className="text-xs text-gray-400">{otherUser?.branch}</p>
        </div>
        <Link href={`/profile/${otherUser?.id}`} className="btn-secondary text-xs px-3 py-1.5 flex items-center gap-1.5">
          <User size={13} /> Profile
        </Link>
      </div>

      {/* Messages */}
      <div className="glass-card flex-1 overflow-y-auto p-5 space-y-3 mb-4">
        {messages.length === 0 && (
          <div className="text-center text-gray-400 text-sm py-10">Start your conversation!</div>
        )}
        {messages.map(msg => (
          <div key={msg.id} className={`flex ${isMine(msg) ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[75%] flex flex-col gap-1 ${isMine(msg) ? 'items-end' : 'items-start'}`}>
              {!isMine(msg) && (
                <span className="text-xs font-semibold text-gray-500 pl-1">{otherUser?.name}</span>
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
        <div ref={endRef} />
      </div>

      {/* Input */}
      <form onSubmit={sendMessage} className="flex gap-3 shrink-0">
        <input
          value={newMessage}
          onChange={e => setNewMessage(e.target.value)}
          placeholder="Type a message…"
          className="input-field flex-1 bg-white"
          autoFocus
        />
        <button
          type="submit"
          disabled={!newMessage.trim() || sending}
          className="btn-primary shrink-0 px-5"
        >
          <Send size={18} />
        </button>
      </form>
    </div>
  )
}
