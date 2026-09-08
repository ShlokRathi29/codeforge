export const STAFF_SESSION_KEY = 'pingu-staff-session'

export function isStaffSignedIn() {
  if (typeof window === 'undefined') return false
  return window.sessionStorage.getItem(STAFF_SESSION_KEY) === 'staff'
}

export function signInStaff(identifier: string, password: string) {
  const valid = identifier.trim().length > 2 && password === 'pingu-staff'
  if (valid) window.sessionStorage.setItem(STAFF_SESSION_KEY, 'staff')
  return valid
}

export function signOutStaff() {
  window.sessionStorage.removeItem(STAFF_SESSION_KEY)
}
