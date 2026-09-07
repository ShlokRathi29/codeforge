import axios from 'axios'
import type { ActivityRecord, StatItem } from '../types'

export const API_BASE_URL = import.meta.env.DEV
  ? ''
  : (import.meta.env.VITE_API_URL || 'https://codeforge-zdxk.onrender.com')

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 60000,
})

export interface BackendItem {
  id: number
  title: string
  description?: string | null
  is_completed: boolean
  created_at: string
  updated_at: string
}

// Live Backend API Methods with graceful retry for Render cold starts
export async function getHealthStatus(retries = 2): Promise<{ status: string }> {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await api.get<{ status: string }>('/health')
      return res.data
    } catch (err) {
      if (attempt === retries) throw err
      await new Promise((r) => setTimeout(r, 2000))
    }
  }
  return { status: 'error' }
}

export async function getItems(): Promise<BackendItem[]> {
  const res = await api.get<BackendItem[]>('/api/v1/items')
  return res.data
}

export async function createItem(payload: {
  title: string
  description?: string
  is_completed?: boolean
}): Promise<BackendItem> {
  const res = await api.post<BackendItem>('/api/v1/items', payload)
  return res.data
}

export async function deleteItem(itemId: number): Promise<{ message: string }> {
  const res = await api.delete<{ message: string }>(`/api/v1/items/${itemId}`)
  return res.data
}

// Mock fallback dataset for instant hackathon pitching
export const mockStats: StatItem[] = [
  { id: '1', label: 'Active Projects', value: '12', change: '+24%', trend: 'up' },
  { id: '2', label: 'Tasks Processed', value: '1,429', change: '+18%', trend: 'up' },
  { id: '3', label: 'Render Latency', value: '84ms', change: '-12ms', trend: 'up' },
  { id: '4', label: 'Accuracy Score', value: '99.4%', change: '+0.6%', trend: 'up' },
]

export const mockRecords: ActivityRecord[] = [
  {
    id: 'rec-1',
    title: 'Model Pipeline Inference',
    category: 'AI / ML',
    status: 'completed',
    createdAt: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
    author: 'Alex Dev',
  },
  {
    id: 'rec-2',
    title: 'Data Ingestion Batch #84',
    category: 'Database',
    status: 'in_progress',
    createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    author: 'System Worker',
  },
  {
    id: 'rec-3',
    title: 'Semantic Vector Re-indexing',
    category: 'Search Engine',
    status: 'pending',
    createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    author: 'Sam Architect',
  },
  {
    id: 'rec-4',
    title: 'OAuth Provider Sync Check',
    category: 'Auth & Security',
    status: 'completed',
    createdAt: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
    author: 'DevOps Bot',
  },
]
