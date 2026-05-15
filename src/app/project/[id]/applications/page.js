import { cookies } from 'next/headers'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Inbox } from 'lucide-react'
import ApplicationCardWrapper from './ApplicationCardWrapper'
import { createClient } from '@/lib/supabase/server'
import { isDemoMode } from '@/lib/demo/demoSession'
import { DEMO_APPLICATIONS, DEMO_PROJECTS, DEMO_USER } from '@/lib/demo/mockData'

export default async function ViewApplications({ params }) {
  const cookieStore = cookies()
  const isDemo = isDemoMode(cookieStore)

  let project, applications

  if (isDemo) {
    // Show owner-view for demo's own project
    project = DEMO_PROJECTS.find(p => p.owner_id === DEMO_USER.id) ?? DEMO_PROJECTS[1]
    applications = DEMO_APPLICATIONS
  } else {
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) redirect('/auth/verify')

      const { data } = await supabase
        .from('projects')
        .select('owner_id, title, id')
        .eq('id', params.id)
        .single()

      if (!data) notFound()
      if (data.owner_id !== user.id) redirect(`/project/${params.id}`)

      project = data
      const { data: apps } = await supabase
        .from('applications')
        .select('*, profiles!applications_applicant_id_fkey(skills)')
        .eq('project_id', params.id)
        .order('applied_at', { ascending: false })

      applications = apps ?? []
    } catch {
      notFound()
    }
  }

  return (
    <div className="max-w-5xl mx-auto animate-fade-in">
      <Link
        href={`/project/${project.id ?? params.id}`}
        className="inline-flex items-center gap-2 text-gray-500 hover:text-blue-600 mb-6 transition-colors text-sm font-medium"
      >
        <ArrowLeft size={18} /> Back to Project
      </Link>

      <div className="mb-8">
        <h1 className="page-title">Applications</h1>
        <p className="text-gray-500 mt-1">
          Reviewing anonymous applications for:{' '}
          <span className="font-semibold text-gray-700">{project.title}</span>
        </p>
      </div>

      {applications.length === 0 ? (
        <div className="empty-state">
          <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center text-blue-200">
            <Inbox size={32} />
          </div>
          <div>
            <h3 className="section-title mb-2">No applications yet</h3>
            <p className="text-gray-500 text-sm">
              Once students apply, their anonymous pitches will appear here.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {applications.map(app => (
            <ApplicationCardWrapper
              key={app.id}
              application={app}
              projectId={project.id ?? params.id}
              isDemo={isDemo}
            />
          ))}
        </div>
      )}
    </div>
  )
}
