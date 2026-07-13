# System Architecture & Supabase Schema

This document details the architecture, dynamic APIs, and authorization boundaries of ProjectHub.

## Platform Layout

ProjectHub is a campus collaboration network structured as a modern Next.js serverless application:
- **Server Components**: Pages like `profile/[id]/page.js` run on the server to read cookie states, evaluate session tokens, and fetch external GitHub repository feeds dynamically.
- **Client Components**: Interactive states (Kanban boards, application popups) run on the client side using React state hooks.
- **Supabase Backend**: Handles database transactions, real-time message streams, and authentication.

---

## Dynamic GitHub API Integration

To highlight student code portfolios, the application features an automatic GitHub integration:
1. **Username Extraction**: Parses the student's registered `github_url` to find their public username.
2. **Server-Side Fetch**: Fetches public repositories directly on the server side using the Next.js cache handler.
3. **Response Caching**: Next.js cache settings (`next: { revalidate: 3600 }`) prevent GitHub rate-limiting by caching the profile's repositories for 1 hour.
4. **Metrics Rendering**: Renders repository metadata (forks, stars, language) in custom card interfaces.
