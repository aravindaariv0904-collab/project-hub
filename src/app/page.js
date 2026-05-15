import Link from 'next/link'
import { ArrowRight, Users, Zap, Shield, Star, BookOpen, Code2 } from 'lucide-react'

export default function Home() {
  return (
    <div className="flex flex-col items-center">
      {/* ── Hero ─────────────────────────────────── */}
      <section className="w-full flex flex-col items-center text-center space-y-8 py-16 sm:py-24 animate-fade-in-up">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border-blue-100 text-blue-700 font-semibold text-sm">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-500"></span>
          </span>
          Exclusively for Kalasalingam University Students
        </div>

        <h1 className="text-5xl sm:text-7xl font-black tracking-tight text-gray-900 max-w-4xl leading-[1.05]">
          Build your next big idea with the{' '}
          <span className="text-gradient">perfect team.</span>
        </h1>

        <p className="text-xl text-gray-500 max-w-2xl leading-relaxed">
          Post your project idea, find skilled teammates through anonymous pitches,
          collaborate in a shared workspace, and build your reputation with peer endorsements.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
          <Link href="/auth/verify" className="btn-primary text-base px-8 py-4 rounded-2xl text-lg">
            Get Started Free <ArrowRight size={20} />
          </Link>
          <Link href="/dashboard" className="btn-secondary text-base px-8 py-4 rounded-2xl text-lg">
            Browse Projects
          </Link>
        </div>

        <div className="flex items-center gap-8 pt-4 text-sm text-gray-400">
          <div className="flex items-center gap-2">
            <Star size={16} className="fill-yellow-400 text-yellow-400" />
            <span>Peer Endorsements</span>
          </div>
          <div className="flex items-center gap-2">
            <Shield size={16} className="text-emerald-500" />
            <span>Anonymous Applications</span>
          </div>
          <div className="flex items-center gap-2">
            <Code2 size={16} className="text-blue-500" />
            <span>Kanban Workspace</span>
          </div>
        </div>
      </section>

      {/* ── Feature Cards ────────────────────────── */}
      <section className="w-full grid grid-cols-1 md:grid-cols-3 gap-6 py-8">
        {[
          {
            icon: <Users size={28} />,
            color: 'bg-blue-50 text-blue-600',
            title: 'Smart Team Matching',
            desc: 'Post your project with required skills. Students apply anonymously so you judge purely on merit, not identity.',
          },
          {
            icon: <Zap size={28} />,
            color: 'bg-indigo-50 text-indigo-600',
            title: 'Integrated Workspace',
            desc: 'Once a team is formed, collaborate instantly with a Kanban task board, member roster, and project tracking.',
          },
          {
            icon: <Shield size={28} />,
            color: 'bg-purple-50 text-purple-600',
            title: 'Peer Endorsements',
            desc: 'After completing a project, rate your teammates. Scores accumulate on public profiles to build real credibility.',
          },
        ].map((f, i) => (
          <div
            key={i}
            className="glass-card p-8 card-hover flex flex-col gap-5"
            style={{ animationDelay: `${i * 0.15}s` }}
          >
            <div className={`w-14 h-14 rounded-2xl ${f.color} flex items-center justify-center`}>
              {f.icon}
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{f.title}</h3>
              <p className="text-gray-500 leading-relaxed text-sm">{f.desc}</p>
            </div>
          </div>
        ))}
      </section>

      {/* ── How It Works ─────────────────────────── */}
      <section className="w-full py-16 text-center">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">How it works</h2>
        <p className="text-gray-500 mb-12 max-w-xl mx-auto">From idea to completed project in four simple steps.</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { step: '01', title: 'Sign Up', desc: 'Login with your college email. Create your skill profile.' },
            { step: '02', title: 'Post or Apply', desc: 'Post a project or apply anonymously to an existing one.' },
            { step: '03', title: 'Collaborate', desc: 'Use the team workspace to assign and track tasks.' },
            { step: '04', title: 'Get Endorsed', desc: 'Finish the project and earn peer ratings on your profile.' },
          ].map((s, i) => (
            <div key={i} className="glass-card p-6 text-left relative overflow-hidden">
              <span className="absolute top-4 right-5 text-6xl font-black text-gray-100 select-none">{s.step}</span>
              <div className="relative z-10">
                <div className="text-blue-600 font-black text-sm mb-4 uppercase tracking-widest">Step {s.step}</div>
                <h4 className="font-bold text-gray-900 text-lg mb-2">{s.title}</h4>
                <p className="text-gray-500 text-sm">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA Banner ───────────────────────────── */}
      <section className="w-full mb-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-600 p-12 text-center text-white">
          <div className="absolute inset-0 opacity-20"
            style={{ backgroundImage: 'radial-gradient(circle at 30% 50%, white 1px, transparent 1px), radial-gradient(circle at 70% 20%, white 1px, transparent 1px)', backgroundSize: '60px 60px' }}
          />
          <div className="relative z-10 space-y-6 max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-extrabold">Ready to build something great?</h2>
            <p className="text-blue-100 text-lg">Join hundreds of students already collaborating on hackathons, startups, and final-year projects.</p>
            <Link href="/auth/verify" className="inline-flex items-center gap-2 bg-white text-blue-600 font-bold px-8 py-4 rounded-2xl hover:-translate-y-1 transition-all shadow-lg hover:shadow-xl">
              Join ProjectHub <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
