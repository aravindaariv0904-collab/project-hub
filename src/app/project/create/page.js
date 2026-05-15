'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function CreateProject() {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    required_skills: '',
    team_size_needed: 1,
    deadline: '',
    category: 'Hackathon',
    is_anonymous: false
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const skillsArray = formData.required_skills.split(',').map(s => s.trim()).filter(Boolean)

    const { data, error } = await supabase.from('projects').insert({
      owner_id: user.id,
      title: formData.title,
      description: formData.description,
      required_skills: skillsArray,
      team_size_needed: parseInt(formData.team_size_needed),
      deadline: formData.deadline || null,
      category: formData.category,
      is_anonymous: formData.is_anonymous
    }).select().single()

    setLoading(false)

    if (error) {
      alert(error.message)
    } else {
      router.push(`/project/${data.id}`)
      router.refresh()
    }
  }

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setFormData({ ...formData, [e.target.name]: value })
  }

  return (
    <div className="max-w-3xl mx-auto">
      <Link href="/dashboard" className="inline-flex items-center gap-2 text-gray-500 hover:text-blue-600 mb-6 transition-colors">
        <ArrowLeft size={20} /> Back to Dashboard
      </Link>
      
      <div className="glass-card p-8 sm:p-10">
        <div className="mb-8 border-b border-gray-100 pb-6">
          <h1 className="text-3xl font-extrabold text-gray-900">Post a New Project</h1>
          <p className="text-gray-500 mt-2">Describe your idea clearly to attract the best teammates.</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Project Title</label>
            <input required type="text" name="title" value={formData.title} onChange={handleChange} className="input-field text-lg font-medium" placeholder="e.g., AI Powered Study Planner" />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Detailed Description</label>
            <textarea required name="description" value={formData.description} onChange={handleChange} className="input-field min-h-[150px]" placeholder="Explain the project goals, tech stack, and what you're looking for..." />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Required Skills (comma separated)</label>
            <input required type="text" name="required_skills" value={formData.required_skills} onChange={handleChange} className="input-field" placeholder="React, Node.js, UI/UX" />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Team Size Needed</label>
              <input required type="number" min="1" max="10" name="team_size_needed" value={formData.team_size_needed} onChange={handleChange} className="input-field" />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Deadline / Target Date</label>
              <input type="date" name="deadline" value={formData.deadline} onChange={handleChange} className="input-field" />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Category</label>
              <select required name="category" value={formData.category} onChange={handleChange} className="input-field">
                <option value="Hackathon">Hackathon</option>
                <option value="Startup">Startup</option>
                <option value="Final Year Project">Final Year Project</option>
                <option value="Research">Research</option>
                <option value="Open Source">Open Source</option>
                <option value="Competition">Competition</option>
              </select>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <label className="flex items-center gap-3 cursor-pointer group">
              <div className="relative flex items-center">
                <input type="checkbox" name="is_anonymous" checked={formData.is_anonymous} onChange={handleChange} className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </div>
              <span className="text-sm font-medium text-gray-700 group-hover:text-blue-600 transition-colors">Post Anonymously</span>
            </label>
            
            <button type="submit" disabled={loading} className="btn-primary px-8 py-3 w-full sm:w-auto">
              {loading ? 'Publishing...' : 'Publish Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
