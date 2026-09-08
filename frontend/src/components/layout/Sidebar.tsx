import React from 'react'
import {
  LayoutDashboard,
  Calendar,
  ShieldAlert,
  Sliders,
  BarChart3,
  UserRound,
  Users,
  ShieldCheck,
  ClipboardCheck,
  ArrowRightLeft,
} from 'lucide-react'
import { cn } from '../../lib/utils'
import { Logo } from '../ui/Mascot'
import type { NavSection, UserRole } from '../../types'

interface SidebarProps {
  activeSection: NavSection
  setActiveSection: (section: NavSection) => void
  currentRole: UserRole
  onToggleRole?: () => void
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeSection,
  setActiveSection,
  currentRole,
  onToggleRole,
}) => {
  const isStudent = currentRole === 'student'

  return (
    <aside className="w-64 border-r border-[#BFEAFF]/60 bg-white flex flex-col justify-between shrink-0 h-screen sticky top-0 overflow-y-auto">
      <div className="p-5">
        {/* Brand Logo with Portal Title */}
        <div className="px-2 mb-7">
          <Logo subtitle={isStudent ? 'student space' : 'counselor portal'} />
        </div>

        {/* Navigation list */}
        <nav className="space-y-1">
          {/* ================= 1. STUDENT PORTAL NAVIGATION ================= */}
          {isStudent && (
            <>
              <div className="text-[10px] font-bold tracking-wider text-slate-400 uppercase px-3 mb-1.5">
                Student Navigation
              </div>

              <button
                onClick={() => setActiveSection('dashboard')}
                className={cn(
                  'w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all duration-150 cursor-pointer text-left',
                  activeSection === 'dashboard'
                    ? 'bg-[#FFD84D] text-[#111111] shadow-2xs'
                    : 'text-slate-600 hover:text-[#111111] hover:bg-[#F8FCFF]'
                )}
              >
                <div className="flex items-center gap-2.5">
                  <LayoutDashboard className="w-4 h-4 text-[#111111]" />
                  <span>Overview & Trends</span>
                </div>
              </button>

              <button
                onClick={() => setActiveSection('checkin')}
                className={cn(
                  'w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all duration-150 cursor-pointer text-left',
                  activeSection === 'checkin'
                    ? 'bg-[#FFD84D] text-[#111111] shadow-2xs'
                    : 'text-slate-600 hover:text-[#111111] hover:bg-[#F8FCFF]'
                )}
              >
                <div className="flex items-center gap-2.5">
                  <ClipboardCheck className="w-4 h-4 text-[#111111]" />
                  <span>Daily Check-in</span>
                </div>
                <span className="text-[10px] font-semibold bg-white/70 text-[#111111] px-1.5 py-0.5 rounded border border-[#BFEAFF]">
                  60s
                </span>
              </button>

              <button
                onClick={() => setActiveSection('insights')}
                className={cn(
                  'w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all duration-150 cursor-pointer text-left',
                  activeSection === 'insights'
                    ? 'bg-[#FFD84D] text-[#111111] shadow-2xs'
                    : 'text-slate-600 hover:text-[#111111] hover:bg-[#F8FCFF]'
                )}
              >
                <div className="flex items-center gap-2.5">
                  <BarChart3 className="w-4 h-4 text-[#111111]" />
                  <span>My Insights</span>
                </div>
              </button>

              <button
                onClick={() => setActiveSection('history')}
                className={cn(
                  'w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all duration-150 cursor-pointer text-left',
                  activeSection === 'history'
                    ? 'bg-[#FFD84D] text-[#111111] shadow-2xs'
                    : 'text-slate-600 hover:text-[#111111] hover:bg-[#F8FCFF]'
                )}
              >
                <div className="flex items-center gap-2.5">
                  <Calendar className="w-4 h-4 text-[#111111]" />
                  <span>Journal & History</span>
                </div>
              </button>

              <button
                onClick={() => setActiveSection('profile')}
                className={cn(
                  'w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all duration-150 cursor-pointer text-left',
                  activeSection === 'profile'
                    ? 'bg-[#FFD84D] text-[#111111] shadow-2xs'
                    : 'text-slate-600 hover:text-[#111111] hover:bg-[#F8FCFF]'
                )}
              >
                <div className="flex items-center gap-2.5">
                  <UserRound className="w-4 h-4 text-[#111111]" />
                  <span>Profile & Privacy</span>
                </div>
              </button>
            </>
          )}

          {/* ================= 2. STAFF & COUNSELOR PORTAL NAVIGATION ================= */}
          {!isStudent && (
            <>
              <div className="text-[10px] font-bold tracking-wider text-slate-400 uppercase px-3 mb-1.5">
                Counselor Command Center
              </div>

              <button
                onClick={() => setActiveSection('staff')}
                className={cn(
                  'w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all duration-150 cursor-pointer text-left',
                  activeSection === 'staff'
                    ? 'bg-[#FFD84D] text-[#111111] shadow-2xs'
                    : 'text-slate-600 hover:text-[#111111] hover:bg-[#F8FCFF]'
                )}
              >
                <div className="flex items-center gap-2.5">
                  <ShieldAlert className="w-4 h-4 text-rose-600" />
                  <span>Attention Queue</span>
                </div>
                <span className="text-[10px] font-semibold bg-rose-100 text-rose-700 px-1.5 py-0.5 rounded border border-rose-200">
                  Alerts
                </span>
              </button>

              <button
                onClick={() => setActiveSection('staff-insights')}
                className={cn(
                  'w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all duration-150 cursor-pointer text-left',
                  activeSection === 'staff-insights'
                    ? 'bg-[#FFD84D] text-[#111111] shadow-2xs'
                    : 'text-slate-600 hover:text-[#111111] hover:bg-[#F8FCFF]'
                )}
              >
                <div className="flex items-center gap-2.5">
                  <BarChart3 className="w-4 h-4 text-[#111111]" />
                  <span>Cohort Insights</span>
                </div>
              </button>

              <button
                onClick={() => setActiveSection('staff-students')}
                className={cn(
                  'w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all duration-150 cursor-pointer text-left',
                  activeSection === 'staff-students'
                    ? 'bg-[#FFD84D] text-[#111111] shadow-2xs'
                    : 'text-slate-600 hover:text-[#111111] hover:bg-[#F8FCFF]'
                )}
              >
                <div className="flex items-center gap-2.5">
                  <Users className="w-4 h-4 text-[#111111]" />
                  <span>Student Directory</span>
                </div>
              </button>

              <button
                onClick={() => setActiveSection('staff-privacy')}
                className={cn(
                  'w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all duration-150 cursor-pointer text-left',
                  activeSection === 'staff-privacy'
                    ? 'bg-[#FFD84D] text-[#111111] shadow-2xs'
                    : 'text-slate-600 hover:text-[#111111] hover:bg-[#F8FCFF]'
                )}
              >
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-700" />
                  <span>Privacy & Boundaries</span>
                </div>
              </button>

              <div className="text-[10px] font-bold tracking-wider text-slate-400 uppercase px-3 pt-4 mb-1.5">
                System & AI Engine
              </div>

              <button
                onClick={() => setActiveSection('settings')}
                className={cn(
                  'w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all duration-150 cursor-pointer text-left',
                  activeSection === 'settings'
                    ? 'bg-[#FFD84D] text-[#111111] shadow-2xs'
                    : 'text-slate-600 hover:text-[#111111] hover:bg-[#F8FCFF]'
                )}
              >
                <div className="flex items-center gap-2.5">
                  <Sliders className="w-4 h-4 text-slate-500" />
                  <span>Multi-LLM Settings</span>
                </div>
              </button>
            </>
          )}
        </nav>
      </div>

      {/* Bottom Context Info Widget */}
      <div className="p-4 border-t border-[#BFEAFF]/60 space-y-2">
        <div className="p-3 rounded-xl bg-[#F8FCFF] border border-[#BFEAFF]/60 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#111111]">
              {isStudent ? 'Student Space' : 'Counselor Portal'}
            </span>
            <span
              className={`text-[10px] border px-1.5 py-0.5 rounded font-mono font-bold ${
                isStudent
                  ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                  : 'bg-amber-100 text-amber-800 border-amber-200'
              }`}
            >
              {isStudent ? 'Private Mode' : 'FERPA Rule 07'}
            </span>
          </div>
          <p className="text-[11px] text-slate-600 leading-relaxed">
            {isStudent
              ? 'Your private notes and reflections are strictly protected.'
              : 'Minimum necessary access. Student personal journal text is never accessed.'}
          </p>
        </div>

        {/* Quick Portal Switcher Button */}
        {onToggleRole && (
          <button
            onClick={onToggleRole}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-bold border border-[#BFEAFF] bg-white hover:bg-[#DFF4FF] text-slate-700 hover:text-[#111111] transition cursor-pointer"
          >
            <ArrowRightLeft className="w-3.5 h-3.5" />
            <span>{isStudent ? 'Switch to Counselor Portal' : 'Switch to Student Portal'}</span>
          </button>
        )}
      </div>
    </aside>
  )
}
