import { cookies } from 'next/headers'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ExternalLink, Edit3, Award, Star, BookOpen, Layers } from 'lucide-react'
import SkillBadges from '@/components/SkillBadges'
import RatingStars from '@/components/RatingStars'
import { createClient } from '@/lib/supabase/server'
import { isDemoMode } from '@/lib/demo/demoSession'
import {
  DEMO_PROFILE, DEMO_USER,
  DEMO_ENDORSEMENTS, DEMO_COMPLETED_PROJECTS
} from '@/lib/demo/mockData'

export default async function Profile({ params }) {
  const cookieStore = cookies()
  const isDemo = isDemoMode(cookieStore)
  const isDemoProfile = params.id === DEMO_USER.id

  let profile, endorsements, completedProjects, isOwnProfile

  if (isDemo && isDemoProfile) {
    profile = DEMO_PROFILE
    endorsements = DEMO_ENDORSEMENTS
    completedProjects = DEMO_COMPLETED_PROJECTS
    isOwnProfile = true
  } else if (isDemo) {
    // Demo mode but accessing a non-demo profile — show demo profile anyway
    profile = DEMO_PROFILE
    endorsements = DEMO_ENDORSEMENTS
    completedProjects = DEMO_COMPLETED_PROJECTS
    isOwnProfile = false
  } else {
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      isOwnProfile = user?.id === params.id

      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', params.id)
        .single()
      if (!data) notFound()
      profile = data

      const { data: ends } = await supabase
        .from('endorsements')
        .select('*, projects(title), profiles!endorsements_giver_id_fkey(name)')
        .eq('receiver_id', params.id)
        .order('created_at', { ascending: false })
      endorsements = ends ?? []

      const { data: memberships } = await supabase
        .from('team_members')
        .select('teams(projects(id, title, status, category, required_skills))')
        .eq('profile_id', params.id)

      completedProjects = memberships
        ?.map(m => m.teams?.projects)
        .filter(p => p?.status === 'completed') ?? []
    } catch {
      notFound()
    }
  }

  const score = parseFloat(profile.collaboration_score ?? 5)

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in">
      <div className="glass-card overflow-hidden">
        {/* Banner */}
        <div className="h-36 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 relative">
          <div
            className="absolute inset-0 opacity-20"
            style={{ backgroundImage: 'radial-gradient(white 1px, transparent 1px)', backgroundSize: '24px 24px' }}
          />
        </div>

        <div className="px-8 pb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 -mt-14 mb-6">
            <div className="w-28 h-28 rounded-3xl bg-white shadow-xl border-4 border-white flex items-center justify-center text-5xl font-black text-blue-600">
              {profile.name.charAt(0).toUpperCase()}
            </div>
            {isOwnProfile && (
              <Link href="/profile/edit" className="btn-secondary flex items-center gap-2">
                <Edit3 size={15} /> Edit Profile
              </Link>
            )}
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1 space-y-5">
              <div>
                <h1 className="text-3xl font-extrabold text-gray-900">{profile.name}</h1>
                <p className="text-gray-500 mt-1 font-medium">{profile.branch} · Year {profile.year}</p>
                <p className="text-xs text-gray-400 mt-0.5">{profile.college_email}</p>
              </div>

              {(profile.github_url || profile.behance_url) && (
                <div className="flex items-center gap-4">
                  {profile.github_url && (
                    <a href={profile.github_url} target="_blank" rel="noreferrer"
                      className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors font-medium text-sm">
                      <ExternalLink size={16} /> GitHub
                    </a>
                  )}
                  {profile.behance_url && (
                    <a href={profile.behance_url} target="_blank" rel="noreferrer"
                      className="flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-colors font-medium text-sm">
                      <span className="font-black text-base">Bē</span> Behance
                    </a>
                  )}
                </div>
              )}

              {profile.bio && <p className="text-gray-700 leading-relaxed">{profile.bio}</p>}

              {profile.skills?.length > 0 && (
                <div>
                  <p className="text-sm font-bold text-gray-900 mb-2">Skills</p>
                  <SkillBadges skills={profile.skills} max={20} />
                </div>
              )}
            </div>

            {/* Score Card */}
            <div className="w-full lg:w-56 shrink-0">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100 text-center">
                <div className="text-blue-500 flex justify-center mb-2"><Award size={28} /></div>
                <div className="text-5xl font-black text-gray-900">{score.toFixed(1)}</div>
                <div className="text-xs font-bold text-blue-600 uppercase tracking-widest mt-1 mb-3">Collab Score</div>
                <div className="flex justify-center">
                  <RatingStars rating={Math.round(score)} readOnly size={20} />
                </div>
                <p className="text-xs text-gray-400 mt-2">{endorsements.length} endorsement{endorsements.length !== 1 ? 's' : ''}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Two-column */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Endorsements */}
        <div className="space-y-4">
          <h3 className="section-title flex items-center gap-2">
            <Star size={20} className="text-yellow-500 fill-yellow-400" /> Peer Endorsements
            <span className="ml-auto text-sm font-normal text-gray-400">{endorsements.length} total</span>
          </h3>
          {endorsements.length === 0 ? (
            <div className="glass-card p-6 text-center text-gray-400 text-sm">
              Complete projects to earn peer endorsements!
            </div>
          ) : endorsements.map(e => (
            <div key={e.id} className="glass-card p-5">
              <div className="flex items-start justify-between mb-3 gap-3">
                <div>
                  <p className="font-bold text-gray-900 text-sm">{e.profiles?.name}</p>
                  <p className="text-xs text-gray-400 mt-0.5">for: {e.projects?.title}</p>
                </div>
                <RatingStars rating={e.rating} readOnly size={16} />
              </div>
              {e.feedback && (
                <p className="text-gray-600 text-sm italic leading-relaxed">"{e.feedback}"</p>
              )}
            </div>
          ))}
        </div>

        {/* Completed Projects */}
        <div className="space-y-4">
          <h3 className="section-title flex items-center gap-2">
            <BookOpen size={20} className="text-indigo-500" /> Completed Projects
            <span className="ml-auto text-sm font-normal text-gray-400">{completedProjects.length} total</span>
          </h3>
          {completedProjects.length === 0 ? (
            <div className="glass-card p-6 text-center text-gray-400 text-sm">
              No completed projects yet. Join a project to get started!
            </div>
          ) : completedProjects.map(p => (
            <Link key={p.id} href={`/project/${p.id}`} className="block group">
              <div className="glass-card p-5 group-hover:ring-2 group-hover:ring-blue-300/40 transition-all">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                    <Layers size={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors text-sm truncate">{p.title}</h4>
                    <p className="text-xs text-gray-400 mt-0.5 mb-2">{p.category}</p>
                    <SkillBadges skills={p.required_skills} max={3} />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
