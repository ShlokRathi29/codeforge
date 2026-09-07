export type NavSection = 'dashboard' | 'playground' | 'records' | 'settings'

export interface StatItem {
  id: string
  label: string
  value: string | number
  change?: string
  trend?: 'up' | 'down' | 'neutral'
  iconName?: string
}

export interface ActivityRecord {
  id: string
  title: string
  category: string
  status: 'completed' | 'in_progress' | 'pending' | 'failed'
  createdAt: string
  author: string
}
