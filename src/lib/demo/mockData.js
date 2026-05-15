// Mock data for demo mode — no Supabase required
export const DEMO_CREDENTIALS = {
  email: 'demo@kalasalingam.ac.in',
  otp: '123456',
}

export const DEMO_USER = {
  id: 'demo-user-001',
  email: 'demo@kalasalingam.ac.in',
}

export const DEMO_PROFILE = {
  id: 'demo-user-001',
  name: 'Aravi Kumar',
  college_email: 'demo@kalasalingam.ac.in',
  branch: 'Computer Science & Engineering',
  year: 3,
  skills: ['React', 'Next.js', 'Node.js', 'Python', 'UI/UX Design', 'PostgreSQL'],
  bio: 'Passionate full-stack developer who loves building impactful products. Always looking for exciting hackathons and startup ideas to collaborate on.',
  github_url: 'https://github.com/demo',
  behance_url: '',
  collaboration_score: 4.7,
  created_at: new Date().toISOString(),
}

export const DEMO_PROJECTS = [
  {
    id: 'proj-001',
    owner_id: 'other-user-001',
    title: 'AI-Powered Campus Event Finder',
    description: 'A smart mobile app that aggregates all college events using NLP and recommends the best ones based on your interests, schedule, and skill areas. We are looking for a backend developer and a mobile developer.',
    required_skills: ['Flutter', 'Python', 'FastAPI', 'NLP', 'Firebase'],
    team_size_needed: 3,
    deadline: '2025-07-15',
    category: 'Hackathon',
    is_anonymous: false,
    status: 'open',
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    profiles: { name: 'Priya Sharma', branch: 'AI & ML', year: 3 },
  },
  {
    id: 'proj-002',
    owner_id: 'demo-user-001',
    title: 'Student Freelance Marketplace',
    description: 'A platform where students can offer services (graphic design, coding, tutoring) and earn money from their peers. Think Fiverr but exclusively for our university ecosystem.',
    required_skills: ['React', 'Node.js', 'MongoDB', 'UI/UX Design', 'Payment APIs'],
    team_size_needed: 4,
    deadline: '2025-08-01',
    category: 'Startup',
    is_anonymous: false,
    status: 'open',
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    profiles: { name: 'Aravi Kumar', branch: 'CSE', year: 3 },
  },
  {
    id: 'proj-003',
    owner_id: 'other-user-002',
    title: 'Smart Attendance System using Face Recognition',
    description: 'A final year project using OpenCV and deep learning to automate attendance marking. Needs a team of 3 students with ML and web dev skills.',
    required_skills: ['Python', 'OpenCV', 'TensorFlow', 'Flask', 'React'],
    team_size_needed: 3,
    deadline: '2025-12-01',
    category: 'Final Year Project',
    is_anonymous: false,
    status: 'open',
    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    profiles: { name: 'Anonymous', branch: 'ECE', year: 4 },
  },
  {
    id: 'proj-004',
    owner_id: 'other-user-003',
    title: 'Open-Source Supabase ORM for Next.js',
    description: 'Building a type-safe, DX-first ORM wrapper around Supabase that auto-generates hooks and server actions. Looking for TypeScript enthusiasts and docs writers.',
    required_skills: ['TypeScript', 'Next.js', 'Supabase', 'API Design'],
    team_size_needed: 2,
    deadline: null,
    category: 'Open Source',
    is_anonymous: true,
    status: 'open',
    created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    profiles: null,
  },
  {
    id: 'proj-005',
    owner_id: 'other-user-004',
    title: 'Mental Health Support Chatbot for Students',
    description: 'A research project building an empathetic chatbot for student mental health using LLMs, privacy-first design, and expert-reviewed responses.',
    required_skills: ['Python', 'LangChain', 'Psychology Research', 'React', 'API Design'],
    team_size_needed: 3,
    deadline: '2025-09-30',
    category: 'Research',
    is_anonymous: false,
    status: 'open',
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    profiles: { name: 'Dr. Lakshmi K.', branch: 'Psychology', year: 5 },
  },
  {
    id: 'proj-006',
    owner_id: 'other-user-005',
    title: 'Inter-College Coding Competition Platform',
    description: 'A competitive programming judge platform for organizing inter-college hackathons. Needs a backend team to build the contest engine and leaderboard.',
    required_skills: ['Go', 'PostgreSQL', 'Docker', 'WebSockets', 'React'],
    team_size_needed: 4,
    deadline: '2025-06-20',
    category: 'Competition',
    is_anonymous: false,
    status: 'open',
    created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    profiles: { name: 'Rahul M.', branch: 'IT', year: 4 },
  },
]

export const DEMO_APPLICATIONS = [
  {
    id: 'app-001',
    project_id: 'proj-001',
    applicant_id: 'applicant-001',
    anonymous_pitch: 'I have built 3 REST APIs using FastAPI with PostgreSQL backends, including one with real-time WebSocket support. I am also comfortable integrating HuggingFace models for NLP tasks.',
    experience_summary: 'Completed Python for Data Science on Coursera. Built a news sentiment analysis tool with 92% accuracy using BERT. Comfortable with GCP and Docker.',
    status: 'pending',
    applied_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    profiles: { skills: ['Python', 'FastAPI', 'PostgreSQL', 'NLP', 'Docker'] },
  },
  {
    id: 'app-002',
    project_id: 'proj-001',
    applicant_id: 'applicant-002',
    anonymous_pitch: 'Flutter is my primary stack — shipped two apps on Play Store with 500+ downloads combined. Also familiar with Firebase and REST API integration.',
    experience_summary: 'Intern at a startup for 3 months building Flutter apps. Certificate in Mobile App Development from NPTEL. Team lead at college app club.',
    status: 'accepted',
    applied_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    profiles: { skills: ['Flutter', 'Dart', 'Firebase', 'REST APIs', 'UI/UX'] },
  },
  {
    id: 'app-003',
    project_id: 'proj-001',
    applicant_id: 'applicant-003',
    anonymous_pitch: 'Full-stack dev with React + Node experience. Happy to handle the admin dashboard and analytics panel for the event platform.',
    experience_summary: '2 years of part-time freelancing building web dashboards. Comfortable with Tailwind CSS, Chart.js, and REST integration.',
    status: 'rejected',
    applied_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    profiles: { skills: ['React', 'Node.js', 'Tailwind CSS', 'Chart.js', 'MongoDB'] },
  },
]

export const DEMO_TEAM_MEMBERS = [
  {
    profile_id: 'demo-user-001',
    profiles: { name: 'Aravi Kumar', branch: 'CSE', year: 3 },
  },
  {
    profile_id: 'other-user-001',
    profiles: { name: 'Priya Sharma', branch: 'AI & ML', year: 3 },
  },
  {
    profile_id: 'applicant-002',
    profiles: { name: 'Karthik Raj', branch: 'Information Technology', year: 2 },
  },
]

export const DEMO_TASKS = [
  {
    id: 'task-001',
    team_id: 'team-001',
    title: 'Set up FastAPI backend with PostgreSQL',
    status: 'done',
    assigned_to: 'demo-user-001',
    due_date: '2025-06-10',
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    profiles: { name: 'Aravi Kumar' },
  },
  {
    id: 'task-002',
    team_id: 'team-001',
    title: 'Design Flutter UI mockups',
    status: 'in progress',
    assigned_to: 'applicant-002',
    due_date: '2025-06-15',
    created_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    profiles: { name: 'Karthik Raj' },
  },
  {
    id: 'task-003',
    team_id: 'team-001',
    title: 'Integrate NLP event classification model',
    status: 'in progress',
    assigned_to: 'other-user-001',
    due_date: '2025-06-18',
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    profiles: { name: 'Priya Sharma' },
  },
  {
    id: 'task-004',
    team_id: 'team-001',
    title: 'Write API documentation',
    status: 'pending',
    assigned_to: 'demo-user-001',
    due_date: '2025-06-20',
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    profiles: { name: 'Aravi Kumar' },
  },
  {
    id: 'task-005',
    team_id: 'team-001',
    title: 'Build push notification system',
    status: 'pending',
    assigned_to: null,
    due_date: null,
    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    profiles: null,
  },
]

export const DEMO_ENDORSEMENTS = [
  {
    id: 'end-001',
    project_id: 'proj-completed-001',
    giver_id: 'other-user-001',
    receiver_id: 'demo-user-001',
    rating: 5,
    feedback: 'Aravi is an exceptional collaborator. He finished the backend API two days ahead of schedule and proactively helped the team debug Flutter integration issues. Highly recommend!',
    created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    projects: { title: 'E-Learning Platform for Rural Schools' },
    profiles: { name: 'Priya Sharma' },
  },
  {
    id: 'end-002',
    project_id: 'proj-completed-002',
    giver_id: 'other-user-006',
    receiver_id: 'demo-user-001',
    rating: 4,
    feedback: 'Great communication and code quality. Would have loved more detailed comments in the codebase, but overall a reliable teammate who delivers on time.',
    created_at: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    projects: { title: 'IoT-Based Smart Lab Monitoring System' },
    profiles: { name: 'Vikram S.' },
  },
]

export const DEMO_COMPLETED_PROJECTS = [
  {
    id: 'proj-completed-001',
    title: 'E-Learning Platform for Rural Schools',
    status: 'completed',
    category: 'Final Year Project',
    required_skills: ['React', 'Node.js', 'PostgreSQL', 'AWS'],
  },
  {
    id: 'proj-completed-002',
    title: 'IoT-Based Smart Lab Monitoring System',
    status: 'completed',
    category: 'Research',
    required_skills: ['Python', 'MQTT', 'React', 'InfluxDB'],
  },
]

export const DEMO_COMMUNITIES = [
  { id: 'comm-001', name: 'AI/ML Enthusiasts', description: 'Discuss machine learning, deep learning, LLMs, and AI research. Share papers, projects, and ideas.', category: 'Technology', icon: '🤖', member_count: 234, joined: true },
  { id: 'comm-002', name: 'Web Developers', description: 'Everything web — React, Next.js, Node, CSS, and modern full-stack development.', category: 'Technology', icon: '🌐', member_count: 312, joined: true },
  { id: 'comm-003', name: 'UI/UX Designers', description: 'Design systems, Figma, user research, prototyping and all things design.', category: 'Design', icon: '🎨', member_count: 156, joined: false },
  { id: 'comm-004', name: 'Hackathon Warriors', description: 'Team up for hackathons, share past experiences, and coordinate for upcoming events.', category: 'Events', icon: '⚡', member_count: 189, joined: true },
  { id: 'comm-005', name: 'Startup Founders', description: 'Build startups, discuss ideas, find co-founders, and share the entrepreneurship journey.', category: 'Business', icon: '🚀', member_count: 98, joined: false },
  { id: 'comm-006', name: 'Robotics Club', description: 'Hardware, embedded systems, Arduino, Raspberry Pi, and robotics projects.', category: 'Hardware', icon: '🤖', member_count: 67, joined: false },
  { id: 'comm-007', name: 'Gaming Community', description: 'Game development, gaming discussions, and game jam collaborations.', category: 'Entertainment', icon: '🎮', member_count: 145, joined: false },
  { id: 'comm-008', name: 'Open Source Contributors', description: 'Find open source projects to contribute to and share your own OSS work.', category: 'Technology', icon: '📦', member_count: 203, joined: false },
]

export const DEMO_COMMUNITY_THREADS = [
  {
    id: 'thread-001',
    community_id: 'comm-001',
    title: 'Best resources to learn Transformers from scratch?',
    content: 'I\'ve been trying to understand the attention mechanism properly. Any good resources beyond the original paper?',
    created_by: 'other-user-001',
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    profiles: { name: 'Priya Sharma' },
    reply_count: 5,
  },
  {
    id: 'thread-002',
    community_id: 'comm-001',
    title: 'Looking for collaborators on an LLM fine-tuning project',
    content: 'Working on fine-tuning LLaMA-3 for Tamil language tasks. Need help with data preprocessing and evaluation metrics.',
    created_by: 'demo-user-001',
    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    profiles: { name: 'Aravi Kumar' },
    reply_count: 3,
  },
  {
    id: 'thread-003',
    community_id: 'comm-002',
    title: 'Next.js 15 vs Remix — which for new projects?',
    content: 'Starting a new SaaS project and torn between Next.js 15 and Remix. What are your experiences?',
    created_by: 'applicant-002',
    created_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    profiles: { name: 'Karthik Raj' },
    reply_count: 8,
  },
]

export const DEMO_COMMUNITY_MESSAGES = {
  'comm-001': [
    { id: 'msg-c1-001', sender_id: 'other-user-001', content: 'Has anyone tried the new Gemini Flash API? Insanely fast for code generation tasks.', created_at: new Date(Date.now() - 20 * 60 * 1000).toISOString(), profiles: { name: 'Priya Sharma' } },
    { id: 'msg-c1-002', sender_id: 'applicant-002', content: 'Yes! I used it for a hackathon last week. The context window is massive too.', created_at: new Date(Date.now() - 15 * 60 * 1000).toISOString(), profiles: { name: 'Karthik Raj' } },
    { id: 'msg-c1-003', sender_id: 'demo-user-001', content: 'I\'ve been using it for RAG pipelines. The embeddings quality is great too.', created_at: new Date(Date.now() - 10 * 60 * 1000).toISOString(), profiles: { name: 'Aravi Kumar' } },
    { id: 'msg-c1-004', sender_id: 'other-user-001', content: 'Anyone joining the upcoming ML workshop on Saturday?', created_at: new Date(Date.now() - 5 * 60 * 1000).toISOString(), profiles: { name: 'Priya Sharma' } },
  ],
  'comm-002': [
    { id: 'msg-c2-001', sender_id: 'applicant-002', content: 'Just shipped my first Next.js app with the new App Router. The server components are a game changer!', created_at: new Date(Date.now() - 30 * 60 * 1000).toISOString(), profiles: { name: 'Karthik Raj' } },
    { id: 'msg-c2-002', sender_id: 'demo-user-001', content: 'Agreed! Especially the way you can mix client and server components seamlessly.', created_at: new Date(Date.now() - 25 * 60 * 1000).toISOString(), profiles: { name: 'Aravi Kumar' } },
    { id: 'msg-c2-003', sender_id: 'other-user-001', content: 'Anyone have experience with Drizzle ORM? Thinking of switching from Prisma.', created_at: new Date(Date.now() - 8 * 60 * 1000).toISOString(), profiles: { name: 'Priya Sharma' } },
  ],
  'comm-004': [
    { id: 'msg-c4-001', sender_id: 'demo-user-001', content: 'SIH registrations open! Who\'s forming teams?', created_at: new Date(Date.now() - 60 * 60 * 1000).toISOString(), profiles: { name: 'Aravi Kumar' } },
    { id: 'msg-c4-002', sender_id: 'applicant-002', content: 'I\'m in! Need a UI/UX designer though. Anyone?', created_at: new Date(Date.now() - 55 * 60 * 1000).toISOString(), profiles: { name: 'Karthik Raj' } },
    { id: 'msg-c4-003', sender_id: 'other-user-001', content: 'Check the Requirement Board on ProjectHub! I posted a team-forming request there.', created_at: new Date(Date.now() - 50 * 60 * 1000).toISOString(), profiles: { name: 'Priya Sharma' } },
  ],
}

export const DEMO_COMMUNITY_MEMBERS = {
  'comm-001': [
    { profile_id: 'demo-user-001', profiles: { name: 'Aravi Kumar', branch: 'CSE' }, role: 'member' },
    { profile_id: 'other-user-001', profiles: { name: 'Priya Sharma', branch: 'AI & ML' }, role: 'admin' },
    { profile_id: 'applicant-002', profiles: { name: 'Karthik Raj', branch: 'IT' }, role: 'member' },
    { profile_id: 'other-user-002', profiles: { name: 'Ravi K.', branch: 'CSE' }, role: 'member' },
    { profile_id: 'other-user-003', profiles: { name: 'Deepa M.', branch: 'AI & ML' }, role: 'member' },
  ],
  'comm-002': [
    { profile_id: 'demo-user-001', profiles: { name: 'Aravi Kumar', branch: 'CSE' }, role: 'member' },
    { profile_id: 'applicant-002', profiles: { name: 'Karthik Raj', branch: 'IT' }, role: 'admin' },
    { profile_id: 'other-user-001', profiles: { name: 'Priya Sharma', branch: 'AI & ML' }, role: 'member' },
  ],
  'comm-004': [
    { profile_id: 'demo-user-001', profiles: { name: 'Aravi Kumar', branch: 'CSE' }, role: 'member' },
    { profile_id: 'other-user-001', profiles: { name: 'Priya Sharma', branch: 'AI & ML' }, role: 'member' },
    { profile_id: 'applicant-002', profiles: { name: 'Karthik Raj', branch: 'IT' }, role: 'admin' },
  ],
}

export const DEMO_PRIVATE_CHATS = [
  {
    id: 'chat-001',
    participant1_id: 'demo-user-001',
    participant2_id: 'other-user-001',
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    other_user: { id: 'other-user-001', name: 'Priya Sharma', branch: 'AI & ML' },
    last_message: 'Let me know when the model training is done!',
    last_message_at: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
  },
  {
    id: 'chat-002',
    participant1_id: 'demo-user-001',
    participant2_id: 'applicant-002',
    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    other_user: { id: 'applicant-002', name: 'Karthik Raj', branch: 'IT' },
    last_message: 'The Flutter build is ready for testing 🚀',
    last_message_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
]

export const DEMO_PRIVATE_MESSAGES = {
  'chat-001': [
    { id: 'pm-001', chat_id: 'chat-001', sender_id: 'other-user-001', content: 'Hey! Saw your project on the board. Really interesting concept!', created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), profiles: { name: 'Priya Sharma' } },
    { id: 'pm-002', chat_id: 'chat-001', sender_id: 'demo-user-001', content: 'Thanks Priya! I think your ML skills would be a great fit. Have you worked with event classification before?', created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000 + 5 * 60 * 1000).toISOString(), profiles: { name: 'Aravi Kumar' } },
    { id: 'pm-003', chat_id: 'chat-001', sender_id: 'other-user-001', content: 'Yes! I did a similar project for news categorization using BERT. I can adapt that.', created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), profiles: { name: 'Priya Sharma' } },
    { id: 'pm-004', chat_id: 'chat-001', sender_id: 'demo-user-001', content: 'Perfect. I\'ve started setting up the FastAPI backend. Let me know when the model training is done!', created_at: new Date(Date.now() - 30 * 60 * 1000).toISOString(), profiles: { name: 'Aravi Kumar' } },
  ],
  'chat-002': [
    { id: 'pm-005', chat_id: 'chat-002', sender_id: 'applicant-002', content: 'Hey, I applied to your project! Fingers crossed 🤞', created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), profiles: { name: 'Karthik Raj' } },
    { id: 'pm-006', chat_id: 'chat-002', sender_id: 'demo-user-001', content: 'Hey Karthik! Saw your application — your Play Store experience is impressive.', created_at: new Date(Date.now() - 22 * 60 * 60 * 1000).toISOString(), profiles: { name: 'Aravi Kumar' } },
    { id: 'pm-007', chat_id: 'chat-002', sender_id: 'applicant-002', content: 'Thanks! I\'m really excited about this project. The Flutter build is ready for testing 🚀', created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), profiles: { name: 'Karthik Raj' } },
  ],
}

