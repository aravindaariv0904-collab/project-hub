'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Check, X, UserCircle, ChevronDown, ChevronUp } from 'lucide-react'
import SkillBadges from '@/components/SkillBadges'

export default function ApplicationCard({ application, projectId, onStatusChange }) {
  const [loading, setLoading] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const supabase = createClient()

  const handleAction = async (status) => {
    setLoading(true)

    const { error: appError } = await supabase
      .from('applications')
      .update({ status })
      .eq('id', application.id)

    if (appError) {
      alert(appError.message)
      setLoading(false)
      return
    }

    if (status === 'accepted') {
      let teamId = null
      const { data: existingTeam } = await supabase
        .from('teams')
        .select('id')
        .eq('project_id', projectId)
        .single()

      if (existingTeam) {
        teamId = existingTeam.id
      } else {
        const { data: newTeam } = await supabase
          .from('teams')
          .insert({ project_id: projectId })
          .select()
          .single()
        if (newTeam) teamId = newTeam.id
      }

      if (teamId) {
        await supabase.from('team_members').insert({
          team_id: teamId,
          profile_id: application.applicant_id
        })
      }
    }

    setLoading(false)
    onStatusChange()
  }

  const statusColor = {
    pending: 'badge badge-yellow border border-yellow-200',
    accepted: 'badge badge-green border border-emerald-200',
    rejected: 'badge badge-red border border-red-200',
  }

  return (
    <div className={`glass-card overflow-hidden transition-all duration-300 ${
      application.status === 'accepted' ? 'ring-2 ring-emerald-400/30' :
      application.status === 'rejected' ? 'opacity-60' : ''
    }`}>
      {/* Card Header */}
      <div className="p-5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-gray-100 to-gray-200 text-gray-400 flex items-center justify-center">
            <UserCircle size={24} />
          </div>
          <div>
            <h4 className="font-bold text-gray-900 text-sm">Anonymous Applicant</h4>
            <span className="text-xs text-gray-400">Identity hidden</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className={statusColor[application.status] || 'badge badge-blue'}>
            {application.status}
          </span>

          <button
            onClick={() => setExpanded(!expanded)}
            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 transition-colors"
          >
            {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>
      </div>

      {/* Expandable Details */}
      {expanded && (
        <div className="px-5 pb-5 border-t border-gray-100 pt-4 space-y-4 animate-fade-in">
          <div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">Pitch</span>
            <p className="text-gray-700 text-sm italic border-l-2 border-blue-300 pl-3 leading-relaxed">
              "{application.anonymous_pitch}"
            </p>
          </div>
          <div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">Experience</span>
            <p className="text-gray-700 text-sm whitespace-pre-wrap leading-relaxed">{application.experience_summary}</p>
          </div>
          <div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">Skills</span>
            <SkillBadges skills={application.profiles?.skills} max={10} />
          </div>
        </div>
      )}

      {/* Actions — only for pending */}
      {application.status === 'pending' && (
        <div className="px-5 pb-5 flex gap-3">
          <button
            disabled={loading}
            onClick={() => handleAction('rejected')}
            className="flex-1 btn-danger py-2.5 text-sm"
          >
            <X size={16} /> Reject
          </button>
          <button
            disabled={loading}
            onClick={() => handleAction('accepted')}
            className="flex-1 btn-success py-2.5 text-sm"
          >
            <Check size={16} /> Accept
          </button>
        </div>
      )}
    </div>
  )
}
