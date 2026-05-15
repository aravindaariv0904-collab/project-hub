'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CheckCircle } from 'lucide-react'

export default function CompleteProjectButton({ projectId, isDemo }) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleComplete = async () => {
    if (!confirm('Mark this project as complete? This cannot be undone.')) return
    setLoading(true)

    if (isDemo) {
      // Demo: just show a toast and refresh
      setTimeout(() => {
        setLoading(false)
        alert('🎭 Demo: Project marked complete! In production this updates the database.')
        router.refresh()
      }, 800)
      return
    }

    const { createClient } = await import('@/lib/supabase/client')
    const supabase = createClient()
    const { error } = await supabase
      .from('projects')
      .update({ status: 'completed' })
      .eq('id', projectId)

    setLoading(false)
    if (!error) router.refresh()
    else alert(error.message)
  }

  return (
    <button
      onClick={handleComplete}
      disabled={loading}
      className="btn-success flex items-center gap-2"
    >
      <CheckCircle size={18} />
      {loading ? 'Completing…' : 'Mark Project Complete'}
    </button>
  )
}
