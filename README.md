# ProjectHub for Students

A modern collaboration platform for college students to find project teammates, manage workspaces, and build their collaboration scores.

## Tech Stack
- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS (with glassmorphism 3D UI)
- **Database & Auth**: Supabase (PostgreSQL)
- **Icons**: Lucide React

## Setup Instructions

### 1. Supabase Setup
Create a new Supabase project and run the following SQL in the SQL Editor to set up the database schema:

```sql
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  name TEXT NOT NULL,
  college_email TEXT UNIQUE NOT NULL,
  branch TEXT NOT NULL,
  year INTEGER NOT NULL,
  skills TEXT[] NOT NULL,
  bio TEXT,
  github_url TEXT,
  behance_url TEXT,
  collaboration_score DECIMAL(3,2) DEFAULT 5.00,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  required_skills TEXT[] NOT NULL,
  team_size_needed INTEGER NOT NULL,
  deadline DATE,
  category TEXT NOT NULL,
  is_anonymous BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'open',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  applicant_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  anonymous_pitch TEXT NOT NULL,
  experience_summary TEXT,
  status TEXT DEFAULT 'pending',
  applied_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(project_id, applicant_id)
);

CREATE TABLE teams (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE team_members (
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (team_id, profile_id)
);

CREATE TABLE workspace_tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  assigned_to UUID REFERENCES profiles(id),
  due_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE endorsements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  giver_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  receiver_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  rating INTEGER CHECK (rating BETWEEN 1 AND 5),
  feedback TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 2. Environment Variables
Create a `.env.local` file in the root of the `projecthub` directory and add your Supabase credentials:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**Note**: In Supabase Auth Settings, configure Email Auth and set up the Email domain allowlist if you want to strictly enforce `@kalasalingam.ac.in` at the database level. Alternatively, the app checks it on the frontend.

### 3. Run Locally
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

## Features
- **OTP Login**: Secure passwordless login using college email.
- **Smart Dashboard**: Filter projects by skills, categories, or search terms.
- **Anonymous Applications**: Apply to projects without bias; owners review based solely on skills and pitch.
- **Workspace**: Built-in Kanban task board for active teams.
- **Endorsements**: Peer review system that updates student collaboration scores upon project completion.
- **Modern UI**: Stunning glassmorphism and 3D visual effects.
