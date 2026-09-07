import axios from 'axios'
import type { ActivityRecord, StatItem } from '../types'

export const USE_MOCK_API = true

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
})

// Mock fallback dataset for instant hackathon pitching
export const mockStats: StatItem[] = [
  { id: '1', label: 'Active Projects', value: '12', change: '+24%', trend: 'up' },
  { id: '2', label: 'Tasks Processed', value: '1,429', change: '+18%', trend: 'up' },
  { id: '3', label: 'Response Latency', value: '42ms', change: '-8ms', trend: 'up' },
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
