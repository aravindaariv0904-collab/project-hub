# Troubleshooting Guide

Common issues and resolutions for ProjectHub.

---

## 1. Supabase Database Sync

### Issue: Login session is invalid or fails to load profile
- **Symptom**: Clicking Login displays a connection failure popup or loop.
- **Resolution**:
  1. Verify your Supabase URL and Anon key in Vercel settings.
  2. If testing locally, check if you have set the `.env.local` variables.
  3. Enter **Demo Mode** by clicking the guest preview toggle to inspect client pages.

---

## 2. GitHub Profile Fetch

### Issue: GitHub repos are missing from the profile
- **Symptom**: User profile displays "GitHub" link but no repository cards are rendered below.
- **Cause**: The GitHub username was parsed incorrectly, the user has no public repositories, or the GitHub API has rate-limited the host.
- **Resolution**:
  - Ensure the profile url matches `https://github.com/username` format.
  - The server caches responses for 1 hour to prevent API limits. Wait for cache expiration or refresh page cache.
