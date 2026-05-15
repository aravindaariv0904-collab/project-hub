import { DEMO_USER, DEMO_CREDENTIALS } from './mockData'

export const DEMO_COOKIE = 'demo_session'
export const DEMO_COOKIE_VALUE = 'active'

// Use in server components to check if demo mode is active
export function isDemoMode(cookieStore) {
  try {
    return cookieStore.get(DEMO_COOKIE)?.value === DEMO_COOKIE_VALUE
  } catch {
    return false
  }
}

// Use in client components 
export function isDemoModeClient() {
  if (typeof document === 'undefined') return false
  return document.cookie.includes(`${DEMO_COOKIE}=${DEMO_COOKIE_VALUE}`)
}

export function getDemoUser() {
  return DEMO_USER
}

export { DEMO_CREDENTIALS }
