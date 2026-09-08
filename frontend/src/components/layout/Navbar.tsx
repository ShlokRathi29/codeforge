import React, { useEffect, useState } from 'react'
import {
  Globe,
  Users,
  GraduationCap,
  RefreshCw,
  Lock,
} from 'lucide-react'
import { Button } from '../ui/Button'
import { getHealthStatus, seedDemoData, API_BASE_URL } from '../../api/client'
import type { UserRole } from '../../types'

interface NavbarProps {
  currentRole: UserRole
  onToggleRole: () => void
  onSeedComplete: () => void
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRole,
  onToggleRole,
  onSeedComplete,
}) => {
  const [isBackendOnline, setIsBackendOnline] = useState<boolean | null>(null)
  const [isSeeding, setIsSeeding] = useState(false)

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

  const handleSeed = async () => {
    setIsSeeding(true)
    try {
      await seedDemoData()
      onSeedComplete()
    } catch {
      onSeedComplete()
    } finally {
      setIsSeeding(false)
    }
  }

  return (
    <header className="h-16 border-b border-slate-800 bg-slate-900/70 backdrop-blur-md sticky top-0 z-30 px-6 flex items-center justify-between">
      {/* Active Role Indicator */}
      <div className="flex items-center gap-3">
        <div
          className={`flex items-center gap-2 px-3 py-1 rounded-xl text-xs font-semibold border transition ${
            currentRole === 'student'
              ? 'bg-indigo-950/60 border-indigo-500/30 text-indigo-300'
              : 'bg-rose-950/60 border-rose-500/30 text-rose-300'
          }`}
        >
          {currentRole === 'student' ? (
            <>
              <GraduationCap className="w-4 h-4 text-indigo-400" />
              <span>Student View: Atharva Dev</span>
            </>
          ) : (
            <>
              <Lock className="w-3.5 h-3.5 text-rose-400" />
              <span>Counselor Portal: Dr. Aris Thorne</span>
            </>
          )}
        </div>

        {/* Quick Demo Role Switcher for Hackathon Judges */}
        <Button
          size="sm"
          variant="outline"
          onClick={onToggleRole}
          leftIcon={<Users className="w-3.5 h-3.5" />}
        >
          {currentRole === 'student' ? 'Switch to Staff Portal' : 'Switch to Student View'}
        </Button>
      </div>

      {/* Right Actions: Seed Demo & Live Backend Status */}
      <div className="flex items-center gap-3">
        <Button
          size="sm"
          variant="secondary"
          isLoading={isSeeding}
          onClick={handleSeed}
          leftIcon={<RefreshCw className="w-3.5 h-3.5 text-amber-400" />}
        >
          Reset Demo Data
        </Button>

        {/* Render Live Backend Badge */}
        <a
          href={`${API_BASE_URL}/docs`}
          target="_blank"
          rel="noreferrer"
          title={`Backend API: ${API_BASE_URL}`}
          className="hidden md:flex items-center gap-1.5 px-2.5 py-1 bg-emerald-950/50 border border-emerald-500/30 rounded-full text-emerald-300 text-xs font-mono hover:bg-emerald-900/40 transition"
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

        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-xs text-white shadow-md">
          {currentRole === 'student' ? 'A' : 'C'}
        </div>
      </div>
    </header>
  )
}
