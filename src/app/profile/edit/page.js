'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function EditProfile() {
  const router = useRouter()
  const supabase = createClient()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  
  const [formData, setFormData] = useState({
    bio: '',
    skills: '',
    github_url: '',
    behance_url: ''
  })

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/auth/verify')
        return
      }
      setUser(user)

      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (data) {
        setFormData({
          bio: data.bio || '',
          skills: data.skills ? data.skills.join(', ') : '',
          github_url: data.github_url || '',
          behance_url: data.behance_url || ''
        })
      }
      setLoading(false)
    }
    fetchProfile()
  }, [supabase, router])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    
    const skillsArray = formData.skills.split(',').map(s => s.trim()).filter(Boolean)
    
    const { error } = await supabase
      .from('profiles')
      .update({
        bio: formData.bio,
        skills: skillsArray,
        github_url: formData.github_url,
        behance_url: formData.behance_url
      })
      .eq('id', user.id)
    
    setSaving(false)
    if (!error) {
      router.push(`/profile/${user.id}`)
      router.refresh()
    } else {
      alert(error.message)
    }
  }

  const handleChange = (e) => setFormData({...formData, [e.target.name]: e.target.value})

  if (loading) return <div className="text-center py-20 text-gray-500">Loading...</div>

  return (
    <div className="max-w-2xl mx-auto py-8">
      <Link href={`/profile/${user?.id}`} className="inline-flex items-center gap-2 text-gray-500 hover:text-blue-600 mb-6 transition-colors">
        <ArrowLeft size={20} /> Back to Profile
      </Link>
      
      <div className="glass-card p-8">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-6">Edit Profile</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Short Bio</label>
            <textarea 
              name="bio" 
              value={formData.bio} 
              onChange={handleChange} 
              className="input-field h-32 resize-none" 
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Skills (comma separated)</label>
            <input 
              type="text" 
              name="skills" 
              value={formData.skills} 
              onChange={handleChange} 
              className="input-field" 
            />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">GitHub URL</label>
              <input 
                type="url" 
                name="github_url" 
                value={formData.github_url} 
                onChange={handleChange} 
                className="input-field" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Behance URL</label>
              <input 
                type="url" 
                name="behance_url" 
                value={formData.behance_url} 
                onChange={handleChange} 
                className="input-field" 
              />
            </div>
          </div>
          
          <button type="submit" disabled={saving} className="btn-primary w-full py-3 mt-4 text-lg">
            {saving ? 'Saving Changes...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  )
}
