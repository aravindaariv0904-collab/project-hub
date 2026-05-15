'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Shield, Eye, EyeOff } from 'lucide-react'

export default function ApplyProject({ params }) {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [showTips, setShowTips] = useState(false)

  const [formData, setFormData] = useState({
    anonymous_pitch: '',
    experience_summary: ''
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { error } = await supabase.from('applications').insert({
      project_id: params.id,
      applicant_id: user.id,
      anonymous_pitch: formData.anonymous_pitch,
      experience_summary: formData.experience_summary
    })

    setLoading(false)
    if (error) alert(error.message)
    else {
      router.push(`/project/${params.id}`)
      router.refresh()
    }
  }

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <Link href={`/project/${params.id}`} className="inline-flex items-center gap-2 text-gray-500 hover:text-blue-600 mb-6 transition-colors text-sm font-medium">
        <ArrowLeft size={18} /> Back to Project
      </Link>

      <div className="glass-card overflow-hidden">
        {/* Header */}
        <div className="p-8 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-md">
              <Shield size={22} />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-gray-900">Apply Anonymously</h1>
              <p className="text-gray-600 text-sm mt-1 leading-relaxed">
                Your name and email are hidden. The owner sees only your pitch, experience, and skills — ensuring fair, bias-free evaluation.
              </p>
            </div>
          </div>
        </div>

        <div className="p-8 space-y-6">
          {/* Tips Toggle */}
          <button
            type="button"
            onClick={() => setShowTips(!showTips)}
            className="text-sm text-blue-600 hover:underline flex items-center gap-2 font-medium"
          >
            {showTips ? <EyeOff size={16} /> : <Eye size={16} />}
            {showTips ? 'Hide tips' : 'Show writing tips'}
          </button>

          {showTips && (
            <div className="p-5 bg-blue-50 rounded-xl border border-blue-100 text-sm text-blue-800 space-y-2 animate-fade-in">
              <p className="font-semibold mb-3">📝 Writing a great pitch:</p>
              <ul className="space-y-1.5 list-disc list-inside text-blue-700">
                <li>Be specific about what you can contribute</li>
                <li>Mention relevant technical skills or tools you know</li>
                <li>Do NOT include your name, branch, or roll number</li>
                <li>Show enthusiasm for the project idea</li>
              </ul>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 block">
                Your Anonymous Pitch
                <span className="text-red-500 ml-1">*</span>
              </label>
              <textarea
                required
                value={formData.anonymous_pitch}
                onChange={e => setFormData({ ...formData, anonymous_pitch: e.target.value })}
                className="input-field min-h-[130px] resize-y"
                placeholder="Why are YOU the right person for this project? Be specific and keep it anonymous…"
              />
              <p className="text-xs text-gray-400">{formData.anonymous_pitch.length}/500 characters</p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 block">
                Relevant Experience
                <span className="text-red-500 ml-1">*</span>
              </label>
              <textarea
                required
                value={formData.experience_summary}
                onChange={e => setFormData({ ...formData, experience_summary: e.target.value })}
                className="input-field min-h-[120px] resize-y"
                placeholder="Briefly describe past projects, courses, or technical skills relevant to this role…"
              />
            </div>

            <div className="pt-4 border-t border-gray-100">
              <button type="submit" disabled={loading} className="btn-primary w-full py-4 text-base">
                {loading
                  ? <><span className="spinner" /> Submitting…</>
                  : <><Shield size={18} /> Submit Anonymous Application</>}
              </button>
              <p className="text-xs text-center text-gray-400 mt-3">Your identity will only be revealed if the owner accepts your application.</p>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
