'use client'

import { useState } from 'react'
import RatingStars from '@/components/RatingStars'

export default function EndorsementForm({ receiverId, receiverName, receiverDetails, projectId, isDemo }) {
  const [rating, setRating] = useState(0)
  const [feedback, setFeedback] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (rating === 0) { alert('Please select a rating'); return }
    setLoading(true)

    if (isDemo) {
      setTimeout(() => {
        setLoading(false)
        setSubmitted(true)
      }, 600)
      return
    }

    const { createClient } = await import('@/lib/supabase/client')
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    const { error } = await supabase.from('endorsements').insert({
      project_id: projectId,
      giver_id: user.id,
      receiver_id: receiverId,
      rating,
      feedback,
    })

    if (error) { alert(error.message); setLoading(false); return }

    const { data: endorsements } = await supabase.from('endorsements').select('rating').eq('receiver_id', receiverId)
    if (endorsements?.length) {
      const avg = (endorsements.reduce((a, e) => a + e.rating, 0) / endorsements.length).toFixed(2)
      await supabase.from('profiles').update({ collaboration_score: parseFloat(avg) }).eq('id', receiverId)
    }

    setLoading(false)
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="glass-card p-6 bg-emerald-50/50 border border-emerald-100 flex items-center justify-between gap-4">
        <div>
          <h4 className="font-bold text-gray-900">{receiverName}</h4>
          <p className="text-emerald-600 text-sm font-medium mt-0.5">✓ Endorsement submitted!</p>
        </div>
        <RatingStars rating={rating} readOnly size={20} />
      </div>
    )
  }

  return (
    <div className="glass-card p-6">
      <div className="flex items-center gap-4 mb-5">
        <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-indigo-100 to-blue-100 text-indigo-700 font-extrabold flex items-center justify-center text-lg shrink-0">
          {receiverName?.charAt(0)}
        </div>
        <div>
          <h4 className="font-bold text-gray-900">{receiverName}</h4>
          <p className="text-xs text-gray-500">{receiverDetails}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">Rate Collaboration (1–5 stars)</label>
          <RatingStars rating={rating} setRating={setRating} size={28} />
        </div>

        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">Written Feedback</label>
          <textarea
            required
            value={feedback}
            onChange={e => setFeedback(e.target.value)}
            className="input-field min-h-[90px]"
            placeholder={`What did ${receiverName} do well? What could they improve?`}
          />
        </div>

        <button type="submit" disabled={loading} className="btn-primary py-2.5 px-6">
          {loading ? <><span className="spinner" /> Submitting…</> : 'Submit Endorsement'}
        </button>
      </form>
    </div>
  )
}
