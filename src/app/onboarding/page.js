'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function Onboarding() {
  const router = useRouter()
  const supabase = createClient()
  const [user, setUser] = useState(null)
  
  const [formData, setFormData] = useState({
    name: '',
    branch: 'Computer Science',
    year: '1',
    skills: '', // will split by comma
    bio: '',
    github_url: '',
    behance_url: ''
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    getUser()
  }, [supabase])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!user) return
    setLoading(true)
    
    const skillsArray = formData.skills.split(',').map(s => s.trim()).filter(Boolean)
    
    const { error } = await supabase.from('profiles').insert({
      id: user.id,
      name: formData.name,
      college_email: user.email,
      branch: formData.branch,
      year: parseInt(formData.year),
      skills: skillsArray,
      bio: formData.bio,
      github_url: formData.github_url,
      behance_url: formData.behance_url
    })
    
    setLoading(false)
    if (!error) {
      router.push('/dashboard')
      router.refresh()
    } else {
      alert(error.message)
    }
  }

  const handleChange = (e) => setFormData({...formData, [e.target.name]: e.target.value})

  return (
    <div className="max-w-2xl mx-auto py-8">
      <div className="glass-card p-8">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-6">Complete Your Profile</h1>
        <p className="text-gray-500 mb-8">Tell us about yourself so we can match you with the best projects.</p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Full Name</label>
              <input required type="text" name="name" value={formData.name} onChange={handleChange} className="input-field" placeholder="John Doe" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Branch / Major</label>
              <input required type="text" name="branch" value={formData.branch} onChange={handleChange} className="input-field" placeholder="Computer Science" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Year of Study</label>
              <select required name="year" value={formData.year} onChange={handleChange} className="input-field">
                <option value="1">First Year</option>
                <option value="2">Second Year</option>
                <option value="3">Third Year</option>
                <option value="4">Fourth Year</option>
                <option value="5">Fifth Year / PG</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Skills (comma separated)</label>
              <input required type="text" name="skills" value={formData.skills} onChange={handleChange} className="input-field" placeholder="React, Node.js, UI Design" />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Short Bio</label>
            <textarea required name="bio" value={formData.bio} onChange={handleChange} className="input-field h-24 resize-none" placeholder="Passionate about building cool stuff..." />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">GitHub URL (Optional)</label>
              <input type="url" name="github_url" value={formData.github_url} onChange={handleChange} className="input-field" placeholder="https://github.com/username" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Behance URL (Optional)</label>
              <input type="url" name="behance_url" value={formData.behance_url} onChange={handleChange} className="input-field" placeholder="https://behance.net/username" />
            </div>
          </div>
          
          <button type="submit" disabled={loading} className="btn-primary w-full py-3 mt-4 text-lg">
            {loading ? 'Saving...' : 'Complete Setup'}
          </button>
        </form>
      </div>
    </div>
  )
}
