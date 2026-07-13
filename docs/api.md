# API Reference

This document covers local proxy and Supabase database models for ProjectHub.

---

## 1. Supabase Database Schema

The backend uses a relational database schema mapping profiles, projects, teams, and peer reviews:

### Profiles Table
- `id` (uuid, primary key)
- `name` (text, required)
- `branch` (text)
- `year` (integer)
- `github_url` (text)
- `bio` (text)
- `skills` (text[])

### Projects Table
- `id` (uuid, primary key)
- `title` (text, required)
- `description` (text)
- `status` (text: 'open' | 'active' | 'completed')
- `category` (text)
- `required_skills` (text[])

### Endorsements Table
- `id` (uuid, primary key)
- `giver_id` (uuid, references profiles)
- `receiver_id` (uuid, references profiles)
- `project_id` (uuid, references projects)
- `rating` (integer, 1-5)
- `feedback` (text)

---

## 2. GitHub External API Proxy (Server Side)

Fetches student repository lists.
* **Endpoint**: `https://api.github.com/users/<username>/repos?sort=updated&per_page=4`
* **Method**: `GET`
* **Headers**: `User-Agent: project-hub-app`
* **Caching**: `revalidate: 3600` (1 hour cache)
