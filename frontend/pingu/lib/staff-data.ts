export type AlertStatus = 'new' | 'reviewed' | 'follow-up' | 'dismissed'
export type AlertKind = 'Persistent Stress Pattern' | 'Declining Wellbeing' | 'Wellbeing Check Recommended'

export type StaffAlert = {
  id: string
  studentId: string
  studentName: string
  kind: AlertKind
  status: AlertStatus
  createdAt: string
  lastCheckIn: string
  reason: string
  bullets: string[]
  trend: { day: string; wellbeing: number; stress: number }[]
}

export type StudentSummary = {
  id: string
  name: string
  year: string
  lastCheckIn: string
  status: 'Steady' | 'Watch' | 'Support recommended'
  trend: 'Improving' | 'Stable' | 'Declining'
  checkIns: number
}

export const staffAlerts: StaffAlert[] = [
  { id: 'ALT-1042', studentId: 'PG-2048', studentName: 'Student PG-2048', kind: 'Persistent Stress Pattern', status: 'new', createdAt: 'Today, 9:42 AM', lastCheckIn: 'Today', reason: 'Stress responses have remained elevated across several check-ins.', bullets: ['Stress above the review threshold 4 of 5 times', 'Wellbeing has remained below the student’s usual range', 'A human check-in may be helpful'], trend: [{ day: 'Mon', wellbeing: 68, stress: 3.5 }, { day: 'Tue', wellbeing: 61, stress: 4.1 }, { day: 'Wed', wellbeing: 58, stress: 4.3 }, { day: 'Thu', wellbeing: 55, stress: 4.4 }, { day: 'Fri', wellbeing: 57, stress: 4.2 }] },
  { id: 'ALT-1041', studentId: 'PG-1981', studentName: 'Student PG-1981', kind: 'Declining Wellbeing', status: 'follow-up', createdAt: 'Yesterday, 3:18 PM', lastCheckIn: 'Yesterday', reason: 'Recent wellbeing responses show a gentle downward pattern.', bullets: ['Wellbeing has declined for 3 consecutive check-ins', 'Check-in streak is still active', 'Consider offering a low-pressure conversation'], trend: [{ day: 'Mon', wellbeing: 81, stress: 2.1 }, { day: 'Tue', wellbeing: 76, stress: 2.7 }, { day: 'Wed', wellbeing: 71, stress: 3.0 }, { day: 'Thu', wellbeing: 66, stress: 3.4 }, { day: 'Fri', wellbeing: 62, stress: 3.6 }] },
  { id: 'ALT-1038', studentId: 'PG-1764', studentName: 'Student PG-1764', kind: 'Wellbeing Check Recommended', status: 'reviewed', createdAt: 'Sep 6, 11:06 AM', lastCheckIn: 'Sep 6', reason: 'The student may benefit from a timely human check-in.', bullets: ['No check-in recorded for 5 days', 'Earlier responses suggested increased overwhelm', 'No private reflection content is included here'], trend: [{ day: 'Mon', wellbeing: 73, stress: 2.8 }, { day: 'Tue', wellbeing: 69, stress: 3.1 }, { day: 'Wed', wellbeing: 64, stress: 3.8 }, { day: 'Thu', wellbeing: 60, stress: 4.0 }, { day: 'Fri', wellbeing: 60, stress: 4.0 }] },
  { id: 'ALT-1036', studentId: 'PG-2137', studentName: 'Student PG-2137', kind: 'Persistent Stress Pattern', status: 'dismissed', createdAt: 'Sep 5, 2:40 PM', lastCheckIn: 'Sep 5', reason: 'Stress responses were consistently higher than the student’s baseline.', bullets: ['Stress above the review threshold 3 times', 'Pattern is now marked dismissed by staff', 'Dismissal can be revisited if new signals appear'], trend: [{ day: 'Mon', wellbeing: 62, stress: 4.2 }, { day: 'Tue', wellbeing: 65, stress: 3.8 }, { day: 'Wed', wellbeing: 70, stress: 3.2 }, { day: 'Thu', wellbeing: 72, stress: 2.8 }, { day: 'Fri', wellbeing: 75, stress: 2.4 }] },
]

export const students: StudentSummary[] = Array.from({ length: 18 }, (_, i) => {
  const id = `PG-${String(1800 + i * 37).padStart(4, '0')}`
  const flagged = ['PG-2048', 'PG-1981', 'PG-1764', 'PG-2137'].includes(id)
  return { id, name: `Student ${id}`, year: i % 3 === 0 ? 'Year 1' : i % 3 === 1 ? 'Year 2' : 'Year 3', lastCheckIn: i % 5 === 0 ? '5 days ago' : 'Today', status: flagged ? (i % 2 ? 'Watch' : 'Support recommended') : 'Steady', trend: flagged ? (i % 2 ? 'Declining' : 'Stable') : 'Improving', checkIns: 3 + (i % 7) }
})

export const aggregateTrend = [
  { day: 'Mon', completion: 74, wellbeing: 71, stress: 2.8 },
  { day: 'Tue', completion: 78, wellbeing: 73, stress: 2.7 },
  { day: 'Wed', completion: 76, wellbeing: 70, stress: 3.0 },
  { day: 'Thu', completion: 82, wellbeing: 75, stress: 2.6 },
  { day: 'Fri', completion: 80, wellbeing: 77, stress: 2.4 },
  { day: 'Sat', completion: 59, wellbeing: 79, stress: 2.2 },
  { day: 'Sun', completion: 64, wellbeing: 76, stress: 2.5 },
]

export function getAlert(id: string) { return staffAlerts.find((alert) => alert.id === id) }
export const alertCounts = { total: staffAlerts.length, new: staffAlerts.filter((a) => a.status === 'new').length, followUp: staffAlerts.filter((a) => a.status === 'follow-up').length }
