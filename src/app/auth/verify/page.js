'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Mail, KeyRound, ArrowRight, AlertCircle, Layers, CheckCircle } from 'lucide-react'
import { DEMO_CREDENTIALS, DEMO_COOKIE, DEMO_COOKIE_VALUE } from '@/lib/demo/demoSession'

export default function VerifyAuth() {
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [step, setStep] = useState('email')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [isDemo, setIsDemo] = useState(false)

  const router = useRouter()

  const handleSendOTP = async (e) => {
    e.preventDefault()
    setError(null)

    if (!email.endsWith('@kalasalingam.ac.in')) {
      setError('Only @kalasalingam.ac.in email addresses are allowed.')
      return
    }

    // Silently use demo mode for the test account
    if (email === DEMO_CREDENTIALS.email) {
      setIsDemo(true)
      setStep('otp')
      return
    }

    setLoading(true)
    try {
      const { createClient } = await import('@/lib/supabase/client')
      const supabase = createClient()
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: { shouldCreateUser: true },
      })
      if (error) throw error
      setStep('otp')
    } catch (err) {
      setError(err.message || 'Failed to send OTP. Please try again.')
    }
    setLoading(false)
  }

  const handleVerifyOTP = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    if (isDemo) {
      if (otp === DEMO_CREDENTIALS.otp) {
        document.cookie = `${DEMO_COOKIE}=${DEMO_COOKIE_VALUE}; path=/; max-age=86400`
        router.push('/dashboard')
        router.refresh()
      } else {
        setError('Incorrect OTP. Please check and try again.')
        setLoading(false)
      }
      return
    }

    try {
      const { createClient } = await import('@/lib/supabase/client')
      const supabase = createClient()
      const { data, error } = await supabase.auth.verifyOtp({
        email, token: otp, type: 'email',
      })
      if (error) throw error

      const { data: profile } = await supabase
        .from('profiles').select('id').eq('id', data.user.id).single()

      router.push(profile ? '/dashboard' : '/onboarding')
      router.refresh()
    } catch (err) {
      setError(err.message || 'Verification failed. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-[80vh] py-8">
      <div className="w-full max-w-md space-y-6">
        {/* Brand */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 shadow-glow mx-auto">
            <Layers size={32} className="text-white" />
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900">Welcome to ProjectHub</h1>
          <p className="text-gray-500">
            {step === 'email'
              ? 'Sign in with your college email to get started.'
              : `We sent a 6-digit OTP to ${email}`}
          </p>
        </div>

        {/* Card */}
        <div className="glass-card p-8 relative overflow-hidden">
          <div className="absolute -top-20 -right-20 w-56 h-56 bg-blue-400 rounded-full opacity-10 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 w-56 h-56 bg-indigo-400 rounded-full opacity-10 blur-3xl pointer-events-none" />

          {error && (
            <div className="mb-5 flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm animate-fade-in">
              <AlertCircle size={18} className="shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {step === 'email' ? (
            <form onSubmit={handleSendOTP} className="space-y-5 relative">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-gray-700 block">College Email</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="student@kalasalingam.ac.in"
                    className="input-field pl-11"
                    required
                    autoComplete="email"
                  />
                </div>
                <p className="text-xs text-gray-400 mt-1">Only @kalasalingam.ac.in emails are accepted.</p>
              </div>

              <button type="submit" disabled={loading} className="btn-primary w-full py-3.5 text-base rounded-xl">
                {loading
                  ? <><span className="spinner" /> Sending OTP…</>
                  : <><Mail size={18} /> Send OTP <ArrowRight size={18} /></>}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOTP} className="space-y-5 relative">
              <div className="text-center p-4 bg-blue-50 rounded-xl border border-blue-100 mb-2">
                <CheckCircle size={20} className="inline text-blue-500 mr-2" />
                <span className="text-sm text-blue-700 font-medium">OTP sent! Check your inbox.</span>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-gray-700 block">Enter 6-digit OTP</label>
                <div className="relative">
                  <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    value={otp}
                    onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="· · · · · ·"
                    className="input-field pl-11 text-center tracking-[0.5em] text-2xl font-bold font-mono"
                    required
                    maxLength={6}
                    inputMode="numeric"
                    autoFocus
                  />
                </div>
              </div>

              <button type="submit" disabled={loading} className="btn-primary w-full py-3.5 text-base rounded-xl">
                {loading
                  ? <><span className="spinner" /> Verifying…</>
                  : 'Verify & Sign In'}
              </button>

              <button
                type="button"
                onClick={() => { setStep('email'); setError(null); setIsDemo(false) }}
                className="w-full text-sm text-blue-600 hover:underline font-medium text-center"
              >
                ← Use a different email
              </button>
            </form>
          )}
        </div>

        <p className="text-center text-xs text-gray-400">
          By signing in, you agree to use this platform responsibly as a verified student.
        </p>
      </div>
    </div>
  )
}
