import { cookies } from 'next/headers'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import SkillBadges from '@/components/SkillBadges'
import { ArrowLeft, Users, Calendar, Folder, Clock, CheckCircle, Lock, AlertCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { isDemoMode } from '@/lib/demo/demoSession'
import { DEMO_PROJECTS, DEMO_USER } from '@/lib/demo/mockData'

const categoryStyles = {
  Hackathon: 'category-hackathon',
  Startup: 'category-startup',
  'Final Year Project': 'category-fyp',
  Research: 'category-research',
  'Open Source': 'category-opensource',
  Competition: 'category-competition',
}

export default async function ProjectDetails({ params }) {
  const cookieStore = cookies()
  const isDemo = isDemoMode(cookieStore)

  let project, isOwner, hasApplied, applicationStatus, isTeamMember

  if (isDemo) {
    project = DEMO_PROJECTS.find(p => p.id === params.id) ?? DEMO_PROJECTS[0]
    isOwner = project.owner_id === DEMO_USER.id
    hasApplied = false
    applicationStatus = null
    isTeamMember = isOwner
  } else {
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      const { data } = await supabase
        .from('projects')
        .select('*, profiles!projects_owner_id_fkey(name, branch, year)')
        .eq('id', params.id)
        .single()

      if (!data) notFound()
      project = data
      isOwner = user?.id === project.owner_id

      if (user && !isOwner) {
        const { data: app } = await supabase
          .from('applications')
          .select('status')
          .eq('project_id', params.id)
          .eq('applicant_id', user.id)
          .single()
        hasApplied = !!app
        applicationStatus = app?.status
      }

      const { data: team } = await supabase
        .from('teams')
        .select('id, team_members!inner(profile_id)')
        .eq('project_id', params.id)
        .eq('team_members.profile_id', user?.id)
        .single()
      isTeamMember = !!(team || isOwner)
    } catch {
      notFound()
    }
  }

  const isCompleted = project.status === 'completed'
  const isOpen = project.status === 'open'

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <Link href="/dashboard" className="inline-flex items-center gap-2 text-gray-500 hover:text-blue-600 mb-6 transition-colors text-sm font-medium">
        <ArrowLeft size={18} /> Back to Dashboard
      </Link>

      <div className="glass-card overflow-hidden">
        <div className={`h-2 w-full ${isCompleted ? 'bg-emerald-500' : 'bg-gradient-to-r from-blue-600 to-indigo-500'}`} />

        <div className="p-8 sm:p-10">
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <span className={`badge border ${categoryStyles[project.category] ?? 'badge-blue'}`}>
              <Folder size={11} /> {project.category}
            </span>
            {isCompleted && (
              <span className="badge badge-green border border-emerald-200">
                <CheckCircle size={11} /> Completed
              </span>
            )}
            {project.is_anonymous && (
              <span className="badge bg-gray-100 text-gray-600 border border-gray-200">
                <Lock size={11} /> Anonymous Post
              </span>
            )}
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4 leading-tight">
            {project.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 mb-8 pb-8 border-b border-gray-100 text-sm">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-100 to-indigo-100 text-blue-700 font-bold flex items-center justify-center text-sm">
                {project.is_anonymous ? '?' : project.profiles?.name?.charAt(0)}
              </div>
              <span className="font-semibold text-gray-800">
                {project.is_anonymous ? 'Anonymous Student' : project.profiles?.name}
              </span>
              {!project.is_anonymous && project.profiles && (
                <span className="text-gray-400">{project.profiles.branch} · Yr {project.profiles.year}</span>
              )}
            </div>
            <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg">
              <Users size={14} />
              <span className="font-semibold">{project.team_size_needed} members needed</span>
            </div>
            {project.deadline && (
              <div className="flex items-center gap-2 bg-amber-50 text-amber-700 px-3 py-1.5 rounded-lg">
                <Calendar size={14} />
                <span className="font-semibold">Deadline: {new Date(project.deadline).toLocaleDateString()}</span>
              </div>
            )}
            <div className="flex items-center gap-2 text-gray-400 ml-auto">
              <Clock size={14} />
              <span>Posted {new Date(project.created_at).toLocaleDateString()}</span>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="section-title mb-4">About This Project</h3>
            <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{project.description}</p>
          </div>

          <div className="mb-10 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-100">
            <h3 className="section-title mb-4 text-blue-900">Required Skills</h3>
            <SkillBadges skills={project.required_skills} />
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-100">
            {isOwner ? (
              <>
                <Link href={`/project/${project.id}/applications`} className="btn-primary flex-1 justify-center py-4">
                  View Applications
                </Link>
                {isTeamMember && (
                  <Link href={`/workspace/${project.id}`} className="btn-secondary flex-1 justify-center py-4">
                    Go to Workspace
                  </Link>
                )}
              </>
            ) : isTeamMember ? (
              <Link href={`/workspace/${project.id}`} className="btn-primary flex-1 justify-center py-4">
                Go to Workspace
              </Link>
            ) : hasApplied ? (
              <div className={`flex-1 flex items-center justify-center gap-3 px-6 py-4 rounded-xl font-semibold border ${
                applicationStatus === 'accepted' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                applicationStatus === 'rejected' ? 'bg-red-50 text-red-700 border-red-200' :
                'bg-amber-50 text-amber-700 border-amber-200'
              }`}>
                {applicationStatus === 'accepted' && <CheckCircle size={18} />}
                {applicationStatus === 'rejected' && <AlertCircle size={18} />}
                Application: <span className="uppercase font-bold">{applicationStatus}</span>
              </div>
            ) : isOpen ? (
              <Link href={`/project/${project.id}/apply`} className="btn-primary flex-1 justify-center py-4 text-base">
                <Lock size={18} /> Apply Anonymously
              </Link>
            ) : (
              <div className="flex-1 flex items-center justify-center bg-gray-100 text-gray-500 rounded-xl py-4 font-semibold">
                Project Closed
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
