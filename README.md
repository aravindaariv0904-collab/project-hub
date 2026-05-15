# ProjectHub for Students 🚀

> A collaboration operating system for college students to find trustworthy teammates, build projects together, and generate verified proof-of-work.

![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)
![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3-38bdf8?logo=tailwindcss)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ecf8e?logo=supabase)

---

## 🎯 What It Solves

College students struggle to find trustworthy teammates for projects, hackathons, and startups. They bounce between WhatsApp, Discord, LinkedIn, and GitHub. **ProjectHub brings everything together** — with a key innovation: **anonymous applications first**, so identity is hidden until the project owner accepts, removing fear of rejection and branch bias.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🔐 **College Email Auth** | OTP-based login restricted to `@kalasalingam.ac.in` |
| 📋 **Requirement Board** | Post & discover open project requirements with skill filters |
| 🎭 **Anonymous Applications** | Apply without revealing identity; revealed only on acceptance |
| 🏗️ **Team Workspace** | Kanban task board for accepted teams |
| 💬 **Communities** | 8 interest-based communities with live chat + discussion threads |
| 📩 **Private Chats** | 1:1 messaging with real-time delivery (Supabase Realtime) |
| ⭐ **Peer Endorsements** | Post-project rating system that builds a collaboration score |
| 👤 **Skill Profiles** | Verified portfolio of skills, projects, and endorsements |

---

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router), Tailwind CSS, Lucide React
- **Backend**: Supabase (PostgreSQL + Auth + Realtime + Storage)
- **Auth**: Supabase OTP with college email domain restriction
- **Real-time**: Supabase Realtime channels for community + private chat
- **Design**: Glassmorphism UI with 3D effects and micro-animations

---

## 🚀 Getting Started

### 1. Clone the repo
```bash
git clone https://github.com/aravindaariv0904-collab/projecthub-for-students.git
cd projecthub-for-students
npm install
```

### 2. Set up environment variables
Create `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Run the app
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000)

### 4. Try Demo Mode (no Supabase needed)
| Field | Value |
|---|---|
| Email | `demo@kalasalingam.ac.in` |
| OTP | `123456` |

---

## 📄 Pages

| Route | Page |
|---|---|
| `/` | Landing page |
| `/auth/verify` | Email + OTP login |
| `/onboarding` | Multi-step profile setup |
| `/dashboard` | 3-tab hub (Projects, Communities, Chats) |
| `/project/create` | Post a new project requirement |
| `/project/[id]` | Project detail + anonymous apply |
| `/project/[id]/applications` | Review anonymous applications (owner) |
| `/workspace/[id]` | Team workspace with Kanban board |
| `/communities` | Browse all 8 communities |
| `/community/[id]` | Live chat + discussions + members |
| `/chats` | Private messages list |
| `/chats/[id]` | 1:1 real-time chat |
| `/profile/[id]` | Public skill profile with endorsements |
| `/profile/edit` | Edit your profile |
| `/endorse/[id]` | Rate teammates after project completion |

---

## 🗄️ Database Schema

Run the SQL from `supabase-schema.sql` in your Supabase dashboard to set up all tables:
- `profiles`, `projects`, `applications`, `teams`, `team_members`
- `workspace_tasks`, `endorsements`
- `communities`, `community_members`, `community_threads`
- `messages`, `private_chats`

---

## 📱 Screenshots

Coming soon — run the demo to explore all features live.

---

## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first.

---

## 📝 License

MIT © 2025 Kalasalingam University — Built for students, by students 🚀
