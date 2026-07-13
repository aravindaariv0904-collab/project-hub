# Deployment Guide

This document covers how to deploy the ProjectHub application.

## Recommended Hosting Platform
The project is built on Next.js, and the recommended platform for hosting is **Vercel** with **Supabase** for database infrastructure.

---

## 1. Supabase Setup
1. Create a project at [supabase.com](https://supabase.com/).
2. Run database initialization scripts (provided in schema files) in the SQL Editor.
3. Obtain your API credentials:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

---

## 2. Deploying to Vercel
1. Link your repository in the Vercel dashboard.
2. Configure environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`: (Your URL)
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: (Your Key)
3. Vercel will automatically configure the build presets and execute:
   - **Build command**: `next build`
   - **Publish directory**: `.next`
4. Click **Deploy**.
