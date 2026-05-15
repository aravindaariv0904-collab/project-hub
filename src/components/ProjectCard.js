import Link from 'next/link'
import SkillBadges from './SkillBadges'
import { Users, Calendar, Folder, ArrowRight } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

const categoryStyles = {
  Hackathon: 'category-hackathon',
  Startup: 'category-startup',
  'Final Year Project': 'category-fyp',
  Research: 'category-research',
  'Open Source': 'category-opensource',
  Competition: 'category-competition',
}

export default function ProjectCard({ project }) {
  return (
    <Link href={`/project/${project.id}`} className="block h-full group">
      <div className="glass-card p-6 h-full flex flex-col card-hover">
        {/* Top row */}
        <div className="flex justify-between items-start mb-4">
          <span className={`badge border ${categoryStyles[project.category] ?? 'badge-blue'}`}>
            <Folder size={11} />
            {project.category}
          </span>
          <span className="text-xs text-gray-400 shrink-0 ml-2">
            {formatDistanceToNow(new Date(project.created_at), { addSuffix: true })}
          </span>
        </div>

        {/* Title + Description */}
        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
          {project.title}
        </h3>
        <p className="text-gray-500 text-sm mb-4 line-clamp-3 flex-1 leading-relaxed">
          {project.description}
        </p>

        {/* Skills */}
        <div className="mb-4">
          <SkillBadges skills={project.required_skills} max={4} />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between text-xs text-gray-500 pt-4 border-t border-gray-100">
          <div className="flex items-center gap-1.5">
            <Users size={14} className="text-gray-400" />
            <span>{project.team_size_needed} needed</span>
          </div>
          <div className="flex items-center gap-3">
            {project.deadline && (
              <div className="flex items-center gap-1.5">
                <Calendar size={14} className="text-gray-400" />
                <span>{new Date(project.deadline).toLocaleDateString()}</span>
              </div>
            )}
            <ArrowRight size={14} className="text-blue-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
          </div>
        </div>
      </div>
    </Link>
  )
}
