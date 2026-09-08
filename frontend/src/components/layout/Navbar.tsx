import { useEffect, useState } from 'react'
import {
  Globe,
  Users,
  GraduationCap,
  RefreshCw,
  Lock,
  LogOut,
} from 'lucide-react'
import { Button } from '../ui/Button'
import { getHealthStatus, seedDemoData, API_BASE_URL } from '../../api/client'
import type { User, UserRole } from '../../types'

interface NavbarProps {
  currentRole: UserRole
  currentUser?: User | null
  onToggleRole: () => void
  onSeedComplete: () => void
  onLogout?: () => void
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRole,
  currentUser,
  onToggleRole,
  onSeedComplete,
  onLogout,
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

  const isStudent = currentRole === 'student'
  const displayName =
    currentUser && currentUser.role === currentRole
      ? currentUser.name
      : isStudent
      ? 'Atharva Dev'
      : 'Dr. Radhika Sharma'

  return (
    <header className="h-16 border-b border-[#BFEAFF]/60 bg-white/90 backdrop-blur-md sticky top-0 z-30 px-6 flex items-center justify-between">
      {/* Active Role Indicator */}
      <div className="flex items-center gap-3">
        <div
          className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold border transition ${
            isStudent
              ? 'bg-[#DFF4FF] border-[#BFEAFF] text-[#111111]'
              : 'bg-[#FFF4D9] border-[#FFD84D]/60 text-[#111111]'
          }`}
        >
          {isStudent ? (
            <>
              <GraduationCap className="w-4 h-4 text-[#111111]" />
              <span>Student Portal • {displayName}</span>
            </>
          ) : (
            <>
              <Lock className="w-3.5 h-3.5 text-amber-700" />
              <span>Counselor Command Center • {displayName}</span>
            </>
          )}
        </div>

        {/* Quick Demo Role Switcher */}
        <Button
          size="sm"
          variant="outline"
          onClick={onToggleRole}
          leftIcon={<Users className="w-3.5 h-3.5 text-[#111111]" />}
        >
          {isStudent ? 'Switch to Counselor Portal' : 'Switch to Student Portal'}
        </Button>
      </div>

      {/* Right Actions: Seed Demo & Live Backend Status */}
      <div className="flex items-center gap-3">
        <Button
          size="sm"
          variant="secondary"
          isLoading={isSeeding}
          onClick={handleSeed}
          leftIcon={<RefreshCw className="w-3.5 h-3.5 text-[#111111]" />}
        >
          Reset Demo Data
        </Button>

        {/* Render Live Backend Badge */}
        <a
          href={`${API_BASE_URL}/docs`}
          target="_blank"
          rel="noreferrer"
          title={`Backend API: ${API_BASE_URL}`}
          className="hidden md:flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 border border-emerald-200 rounded-full text-emerald-800 text-xs font-mono hover:bg-emerald-100 transition"
        >
          <Globe className="w-3.5 h-3.5 text-emerald-600" />
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>
            {isBackendOnline === true
              ? 'Render: Online'
              : isBackendOnline === false
              ? 'Render: Offline'
              : 'Render: Checking...'}
          </span>
        </a>

        <div
          className="w-8 h-8 rounded-full bg-[#FFD84D] border border-[#FFC928] flex items-center justify-center font-bold text-xs text-[#111111] shadow-xs uppercase"
          title={`Logged in as ${displayName} (${isStudent ? 'Student Space' : 'Counselor Portal'})`}
        >
          {displayName ? displayName[0] : isStudent ? 'A' : 'R'}
        </div>

        {onLogout && (
          <button
            onClick={onLogout}
            title="Exit to Landing Page / Sign Out"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-600 hover:text-rose-700 hover:bg-rose-50 rounded-xl border border-[#BFEAFF]/60 transition cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Exit</span>
          </button>
        )}
      </div>
    </header>
  )
}
