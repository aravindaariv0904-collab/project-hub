'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Search } from 'lucide-react'

const COMMUNITY_CATEGORIES = ['All', 'Technology', 'Design', 'Events', 'Business', 'Hardware', 'Entertainment']

export default function CommunitiesClient({ communities, joinedIds: initialJoinedIds, currentUserId, isDemo }) {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [joinedIds, setJoinedIds] = useState(new Set(initialJoinedIds))

  const filtered = communities.filter(c => {
    const matchCat = category === 'All' || c.category === category
    const matchSearch = !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.description?.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  const handleJoin = async (communityId) => {
    if (isDemo) {
      setJoinedIds(prev => {
        const next = new Set(prev)
        if (next.has(communityId)) next.delete(communityId)
        else next.add(communityId)
        return next
      })
      return
    }
    const { createClient } = await import('@/lib/supabase/client')
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (joinedIds.has(communityId)) {
      await supabase.from('community_members').delete().match({ community_id: communityId, profile_id: user.id })
      setJoinedIds(prev => { const n = new Set(prev); n.delete(communityId); return n })
    } else {
      await supabase.from('community_members').insert({ community_id: communityId, profile_id: user.id })
      setJoinedIds(prev => new Set([...prev, communityId]))
    }
  }

  return (
    <div className="space-y-6">
      {/* Search + category filter */}
      <div className="glass rounded-2xl p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search communities…"
            className="input-field pl-11 bg-white/80"
          />
        </div>
      </div>

      {/* Category pills */}
      <div className="flex flex-wrap gap-2">
        {COMMUNITY_CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${
              category === cat ? 'bg-blue-600 text-white shadow' : 'bg-white/60 text-gray-600 hover:bg-blue-50 border border-gray-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {filtered.map((c, i) => {
          const isJoined = joinedIds.has(c.id)
          return (
            <div key={c.id} className="glass-card p-6 card-hover animate-fade-in-up flex flex-col" style={{ animationDelay: `${i * 0.04}s` }}>
              <div className="flex items-start gap-3 mb-3">
                <span className="text-3xl">{c.icon}</span>
                <div className="flex-1 min-w-0">
                  <Link href={`/community/${c.id}`} className="font-bold text-gray-900 hover:text-blue-600 transition-colors block truncate">
                    {c.name}
                  </Link>
                  <p className="text-xs text-gray-400">{c.member_count} members · {c.category}</p>
                </div>
              </div>
              <p className="text-gray-500 text-sm leading-relaxed flex-1 mb-4 line-clamp-2">{c.description}</p>
              <div className="flex items-center gap-2">
                <Link href={`/community/${c.id}`} className="btn-secondary text-sm py-2 flex-1 justify-center">
                  View
                </Link>
                <button
                  onClick={() => handleJoin(c.id)}
                  className={`text-sm py-2 px-4 rounded-xl font-semibold transition-all shrink-0 ${
                    isJoined
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200'
                      : 'btn-primary'
                  }`}
                >
                  {isJoined ? 'Joined ✓' : 'Join'}
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
