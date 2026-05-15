import { cookies } from 'next/headers'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Users, CheckCircle, ClipboardList } from 'lucide-react'
import TaskBoard from '@/components/TaskBoard'
import CompleteProjectButton from './CompleteProjectButton'
import { createClient } from '@/lib/supabase/server'
import { isDemoMode } from '@/lib/demo/demoSession'
import { DEMO_PROJECTS, DEMO_TEAM_MEMBERS, DEMO_TASKS, DEMO_USER } from '@/lib/demo/mockData'

export default async function Workspace({ params }) {
  const cookieStore = cookies()
  const isDemo = isDemoMode(cookieStore)

  let project, teamMembers, tasks, isOwner, team

  if (isDemo) {
    project = DEMO_PROJECTS.find(p => p.id === params.projectId) ?? DEMO_PROJECTS[0]
    team = { id: 'team-001' }
    teamMembers = DEMO_TEAM_MEMBERS
    tasks = DEMO_TASKS
    isOwner = project.owner_id === DEMO_USER.id
  } else {
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) redirect('/auth/verify')

      const { data: proj } = await supabase
        .from('projects').select('*').eq('id', params.projectId).single()
      if (!proj) notFound()
      project = proj

      const { data: t } = await supabase
        .from('teams').select('id').eq('project_id', params.projectId).single()

      if (!t) {
        return (
          <div className="max-w-2xl mx-auto text-center py-20 space-y-4">
            <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center text-amber-400 mx-auto">
              <ClipboardList size={32} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Workspace Not Ready</h2>
            <p className="text-gray-500">Accept at least one application to form the team and unlock this workspace.</p>
            {project.owner_id === user.id && (
              <Link href={`/project/${project.id}/applications`} className="btn-primary mt-4">View Applications</Link>
            )}
          </div>
        )
      }

      team = t
      isOwner = project.owner_id === user.id

      const { data: members } = await supabase
        .from('team_members')
        .select('profile_id, profiles(name, branch, year)')
        .eq('team_id', team.id)

      teamMembers = members ?? []

      const isMember = teamMembers.some(m => m.profile_id === user.id)
      if (!isOwner && !isMember) redirect(`/project/${project.id}`)

      const { data: t2 } = await supabase
        .from('workspace_tasks')
        .select('*, profiles(name)')
        .eq('team_id', team.id)
        .order('created_at', { ascending: true })
      tasks = t2 ?? []
    } catch {
      notFound()
    }
  }

  const isCompleted = project.status === 'completed'
  const projectId = project.id ?? params.projectId

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <Link href={`/project/${projectId}`} className="inline-flex items-center gap-2 text-gray-500 hover:text-blue-600 mb-3 transition-colors text-sm font-medium">
            <ArrowLeft size={18} /> Back to Project
          </Link>
          <h1 className="page-title">{project.title}</h1>
          <p className="text-gray-500 mt-1">Team Workspace</p>
        </div>

        <div className="flex items-center gap-3">
          {isCompleted ? (
            <>
              <span className="badge badge-green border border-emerald-200 py-2 px-4 text-sm">
                <CheckCircle size={16} /> Completed
              </span>
              <Link href={`/endorse/${projectId}`} className="btn-primary">
                Endorse Teammates
              </Link>
            </>
          ) : (
            isOwner && <CompleteProjectButton projectId={projectId} isDemo={isDemo} />
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-5">
          <div className="glass-card p-6">
            <h3 className="section-title flex items-center gap-2 mb-5">
              <Users size={18} className="text-blue-600" /> Team
            </h3>
            <div className="space-y-3">
              {teamMembers.map(m => (
                <Link
                  key={m.profile_id}
                  href={`/profile/${m.profile_id}`}
                  className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-blue-50 transition-colors group"
                >
                  <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-100 to-indigo-100 text-blue-700 font-bold flex items-center justify-center text-sm shrink-0">
                    {m.profiles?.name?.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-gray-900 text-sm group-hover:text-blue-600 transition-colors truncate">
                      {m.profiles?.name}
                    </p>
                    <p className="text-xs text-gray-400 truncate">{m.profiles?.branch}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="glass-card p-6 space-y-3 text-sm">
            <h3 className="section-title mb-3">Project Info</h3>
            <div className="flex justify-between">
              <span className="text-gray-500">Status</span>
              <span className={`font-semibold capitalize ${isCompleted ? 'text-emerald-600' : 'text-blue-600'}`}>
                {project.status}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Category</span>
              <span className="font-semibold text-gray-800">{project.category}</span>
            </div>
            {project.deadline && (
              <div className="flex justify-between">
                <span className="text-gray-500">Deadline</span>
                <span className="font-semibold text-gray-800">
                  {new Date(project.deadline).toLocaleDateString()}
                </span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-gray-500">Members</span>
              <span className="font-semibold text-gray-800">{teamMembers.length}</span>
            </div>
          </div>
        </div>

        {/* Task Board */}
        <div className="lg:col-span-3">
          {isCompleted ? (
            <div className="glass-card p-12 text-center flex flex-col items-center gap-5">
              <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-500">
                <CheckCircle size={40} />
              </div>
              <div>
                <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Project Completed! 🎉</h2>
                <p className="text-gray-500 max-w-md">
                  Recognize your teammates' contributions by leaving endorsements.
                </p>
              </div>
              <Link href={`/endorse/${projectId}`} className="btn-primary text-base px-8 py-3">
                Leave Endorsements
              </Link>
            </div>
          ) : (
            <TaskBoard initialTasks={tasks} teamId={team.id} members={teamMembers} isDemo={isDemo} />
          )}
        </div>
      </div>
    </div>
  )
}
