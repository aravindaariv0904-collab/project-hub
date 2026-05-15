'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import {
  LayoutGrid, Users, MessageSquare, PlusCircle,
  Search, Filter, Folder, ArrowRight, Inbox,
  MessageCircle, Clock, ChevronRight
} from 'lucide-react'
import ProjectCard from '@/components/ProjectCard'
import SkillBadges from '@/components/SkillBadges'

const CATEGORIES = ['Hackathon', 'Startup', 'Final Year Project', 'Research', 'Open Source', 'Competition']

const TABS = [
  { id: 'board', label: 'Requirement Board', icon: <LayoutGrid size={18} /> },
  { id: 'communities', label: 'My Communities', icon: <Users size={18} /> },
  { id: 'chats', label: 'Chats', icon: <MessageSquare size={18} /> },
]

export default function DashboardClient({
  initialTab, projects, communities, joinedCommunities,
  chats, currentUserId, isDemo, searchQuery, categoryFilter
}) {
  const [activeTab, setActiveTab] = useState(initialTab || 'board')
  const [search, setSearch] = useState(searchQuery)
  const [category, setCategory] = useState(categoryFilter)

  const filtered = useMemo(() => {
    return projects.filter(p => {
      const matchCat = !category || p.category === category
      const s = search.toLowerCase()
      const matchSearch = !search || (
        p.title.toLowerCase().includes(s) ||
        p.description.toLowerCase().includes(s) ||
        p.required_skills?.some(sk => sk.toLowerCase().includes(s))
      )
      return matchCat && matchSearch
    })
  }, [projects, search, category])

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="text-gray-500 mt-1 text-sm">Your collaboration hub</p>
        </div>
        {activeTab === 'board' && (
          <Link href="/project/create" className="btn-primary shrink-0">
            <PlusCircle size={18} /> Post Project
          </Link>
        )}
        {activeTab === 'communities' && (
          <Link href="/communities" className="btn-secondary shrink-0">
            <Users size={18} /> Browse All Communities
          </Link>
        )}
        {activeTab === 'chats' && (
          <Link href="/chats" className="btn-secondary shrink-0">
            <MessageSquare size={18} /> All Chats
          </Link>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-white/60 backdrop-blur p-1 rounded-2xl border border-white/50 w-fit">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
              activeTab === tab.id
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-gray-600 hover:bg-blue-50 hover:text-blue-700'
            }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* ── Tab: Requirement Board ──────────────────────── */}
      {activeTab === 'board' && (
        <div className="space-y-5">
          {/* Search + Filter */}
          <div className="glass rounded-2xl p-4 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search by skill, title, keyword…"
                className="input-field pl-11 bg-white/80"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="input-field pl-11 bg-white/80 appearance-none min-w-[180px] cursor-pointer"
              >
                <option value="">All Categories</option>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          {(search || category) && (
            <div className="flex items-center gap-3 text-sm">
              <span className="text-gray-500">Active filters:</span>
              {search && <span className="badge badge-blue">"{search}"</span>}
              {category && <span className="badge badge-purple">{category}</span>}
              <button onClick={() => { setSearch(''); setCategory('') }} className="text-blue-600 hover:underline text-sm font-medium">
                Clear
              </button>
            </div>
          )}

          <p className="text-sm text-gray-400">{filtered.length} open project{filtered.length !== 1 ? 's' : ''}</p>

          {filtered.length === 0 ? (
            <div className="empty-state">
              <Inbox size={36} className="text-gray-200" />
              <div>
                <h3 className="section-title mb-1">No projects found</h3>
                <p className="text-gray-500 text-sm">Try different keywords or <Link href="/project/create" className="text-blue-600 hover:underline font-medium">post the first one!</Link></p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filtered.map((p, i) => (
                <div key={p.id} className="animate-fade-in-up" style={{ animationDelay: `${i * 0.04}s` }}>
                  <ProjectCard project={p} />
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Tab: My Communities ─────────────────────────── */}
      {activeTab === 'communities' && (
        <div className="space-y-6">
          {joinedCommunities.length === 0 ? (
            <div className="empty-state">
              <Users size={36} className="text-gray-200" />
              <div>
                <h3 className="section-title mb-1">No communities joined yet</h3>
                <Link href="/communities" className="btn-primary mt-2">Browse Communities</Link>
              </div>
            </div>
          ) : (
            <>
              <div>
                <h3 className="section-title mb-4">Joined Communities</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                  {joinedCommunities.map((c, i) => (
                    <Link key={c.id} href={`/community/${c.id}`} className="block group">
                      <div className="glass-card p-6 card-hover animate-fade-in-up" style={{ animationDelay: `${i * 0.05}s` }}>
                        <div className="flex items-center gap-3 mb-3">
                          <span className="text-3xl">{c.icon}</span>
                          <div className="min-w-0">
                            <h4 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors truncate">{c.name}</h4>
                            <p className="text-xs text-gray-400">{c.member_count} members · {c.category}</p>
                          </div>
                        </div>
                        <p className="text-gray-500 text-sm line-clamp-2 leading-relaxed mb-4">{c.description}</p>
                        <div className="flex items-center justify-between">
                          <span className="badge badge-green border border-emerald-200 text-xs">Joined</span>
                          <ArrowRight size={16} className="text-gray-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="section-title">Explore More</h3>
                  <Link href="/communities" className="text-sm text-blue-600 hover:underline font-medium">View all</Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {communities.filter(c => !c.joined).slice(0, 4).map(c => (
                    <div key={c.id} className="glass-card p-5 flex items-center gap-4">
                      <span className="text-2xl shrink-0">{c.icon}</span>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-gray-900 text-sm truncate">{c.name}</h4>
                        <p className="text-xs text-gray-400">{c.member_count} members</p>
                      </div>
                      <Link href={`/community/${c.id}`} className="btn-secondary text-xs px-3 py-1.5 shrink-0">
                        Join
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* ── Tab: Chats ─────────────────────────────────── */}
      {activeTab === 'chats' && (
        <div className="space-y-4 max-w-2xl">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">{chats.length} conversation{chats.length !== 1 ? 's' : ''}</p>
            <Link href="/chats" className="text-sm text-blue-600 hover:underline font-medium">View all & start new</Link>
          </div>

          {chats.length === 0 ? (
            <div className="empty-state">
              <MessageCircle size={36} className="text-gray-200" />
              <div>
                <h3 className="section-title mb-1">No conversations yet</h3>
                <p className="text-gray-400 text-sm">Start a chat from any user's profile page.</p>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              {chats.map(chat => (
                <Link key={chat.id} href={`/chats/${chat.id}`} className="block group">
                  <div className="glass-card p-4 flex items-center gap-4 group-hover:ring-2 group-hover:ring-blue-300/40 transition-all">
                    <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-blue-100 to-indigo-100 text-blue-700 font-bold flex items-center justify-center text-base shrink-0">
                      {chat.other_user?.name?.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center">
                        <p className="font-bold text-gray-900 text-sm group-hover:text-blue-600 transition-colors">
                          {chat.other_user?.name}
                        </p>
                        <span className="text-xs text-gray-400 shrink-0 ml-2 flex items-center gap-1">
                          <Clock size={11} />
                          {formatDistanceToNow(new Date(chat.last_message_at), { addSuffix: true })}
                        </span>
                      </div>
                      <p className="text-sm text-gray-400 truncate mt-0.5">{chat.last_message}</p>
                    </div>
                    <ChevronRight size={16} className="text-gray-300 shrink-0 group-hover:text-blue-500 transition-colors" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
