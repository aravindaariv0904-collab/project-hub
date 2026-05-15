import { cookies } from 'next/headers'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Award } from 'lucide-react'
import EndorsementForm from './EndorsementForm'
import { createClient } from '@/lib/supabase/server'
import { isDemoMode } from '@/lib/demo/demoSession'
import { DEMO_PROJECTS, DEMO_TEAM_MEMBERS, DEMO_USER } from '@/lib/demo/mockData'

export default async function EndorseTeam({ params }) {
  const cookieStore = cookies()
  const isDemo = isDemoMode(cookieStore)

  let project, membersToEndorse

  if (isDemo) {
    project = { ...DEMO_PROJECTS[0], status: 'completed' }
    membersToEndorse = DEMO_TEAM_MEMBERS.filter(m => m.profile_id !== DEMO_USER.id)
  } else {
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      const { data } = await supabase
        .from('projects').select('*').eq('id', params.projectId).single()
      if (!data || data.status !== 'completed') notFound()
      project = data

      const { data: team } = await supabase
        .from('teams').select('id').eq('project_id', params.projectId).single()
      if (!team) notFound()

      const { data: members } = await supabase
        .from('team_members')
        .select('profile_id, profiles(name, branch, year)')
        .eq('team_id', team.id)
        .neq('profile_id', user.id)

      membersToEndorse = members ?? []
    } catch {
      notFound()
    }
  }

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <Link
        href={`/workspace/${params.projectId}`}
        className="inline-flex items-center gap-2 text-gray-500 hover:text-blue-600 mb-6 transition-colors text-sm font-medium"
      >
        <ArrowLeft size={18} /> Back to Workspace
      </Link>

      <div className="mb-8 p-8 glass-card bg-gradient-to-br from-indigo-50 to-blue-50 border-blue-100 flex items-center gap-6">
        <div className="w-16 h-16 bg-white rounded-full shadow flex items-center justify-center text-yellow-500 shrink-0">
          <Award size={32} />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Endorse Your Teammates</h1>
          <p className="text-gray-600">
            Great work on <strong>{project.title}</strong>! Recognize your team's contributions.
          </p>
        </div>
      </div>

      {membersToEndorse.length === 0 ? (
        <div className="glass-card p-8 text-center text-gray-400 text-sm">
          No other team members to endorse.
        </div>
      ) : (
        <div className="space-y-6">
          {membersToEndorse.map(m => (
            <EndorsementForm
              key={m.profile_id}
              receiverId={m.profile_id}
              receiverName={m.profiles?.name}
              receiverDetails={`${m.profiles?.branch}, Year ${m.profiles?.year}`}
              projectId={params.projectId}
              isDemo={isDemo}
            />
          ))}
        </div>
      )}
    </div>
  )
}
