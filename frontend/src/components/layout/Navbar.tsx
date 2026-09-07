import React, { useEffect, useState } from 'react'
import { Search, Bell, Plus, Globe } from 'lucide-react'
import { Button } from '../ui/Button'
import { getHealthStatus, API_BASE_URL } from '../../api/client'

interface NavbarProps {
  onOpenNewAction?: () => void
  searchQuery: string
  setSearchQuery: (q: string) => void
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenNewAction,
  searchQuery,
  setSearchQuery,
}) => {
  const [isBackendOnline, setIsBackendOnline] = useState<boolean | null>(null)

  useEffect(() => {
    let mounted = true
    getHealthStatus()
      .then((res) => {
        if (mounted && res.status === 'ok') setIsBackendOnline(true)
      })
      .catch(() => {
        if (mounted) setIsBackendOnline(false)
      })
    return () => {
      mounted = false
    }
  }, [])

  return (
    <header className="h-16 border-b border-slate-800 bg-slate-900/60 backdrop-blur-md sticky top-0 z-30 px-6 flex items-center justify-between">
      {/* Search Bar */}
      <div className="flex items-center gap-3 w-full max-w-md">
        <div className="relative w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search projects, prompts, records..."
            className="w-full bg-slate-950/60 border border-slate-800 rounded-lg pl-9 pr-4 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
          />
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-3">
        {/* Render Live Backend Badge */}
        <a
          href={`${API_BASE_URL}/docs`}
          target="_blank"
          rel="noreferrer"
          title={`Backend API: ${API_BASE_URL}`}
          className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 bg-emerald-950/50 border border-emerald-500/30 rounded-full text-emerald-300 text-xs font-mono hover:bg-emerald-900/40 transition"
        >
          <Globe className="w-3.5 h-3.5 text-emerald-400" />
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>
            {isBackendOnline === true
              ? 'Render: Online'
              : isBackendOnline === false
              ? 'Render: Offline'
              : 'Render: Checking...'}
          </span>
        </a>

        <button className="p-2 text-slate-400 hover:text-slate-200 rounded-lg hover:bg-slate-800/50 transition relative">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-indigo-500" />
        </button>

        {onOpenNewAction && (
          <Button
            size="sm"
            variant="primary"
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={onOpenNewAction}
          >
            Create
          </Button>
        )}

        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-xs text-white shadow-md">
          H
        </div>
      </div>
    </header>
  )
}
