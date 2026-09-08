import React from 'react'
import {
  LayoutDashboard,
  Heart,
  Calendar,
  ShieldAlert,
  Sliders,
} from 'lucide-react'
import { cn } from '../../lib/utils'
import type { NavSection, UserRole } from '../../types'

interface SidebarProps {
  activeSection: NavSection
  setActiveSection: (section: NavSection) => void
  currentRole: UserRole
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeSection,
  setActiveSection,
  currentRole,
}) => {
  return (
    <aside className="w-64 border-r border-[#BFEAFF]/60 bg-white flex flex-col justify-between shrink-0 h-screen sticky top-0">
      <div className="p-5">
        {/* Brand Logo */}
        <div className="flex items-center gap-3 px-2 mb-8">
          <div className="w-9 h-9 rounded-xl bg-[#FFD84D] border border-[#FFC928] flex items-center justify-center shadow-xs">
            <Heart className="w-5 h-5 text-[#111111]" />
          </div>
          <div>
            <h1 className="font-bold text-[#111111] text-base tracking-tight leading-none">
              WellTrack
            </h1>
            <p className="text-[11px] text-slate-500 font-semibold tracking-wide uppercase mt-1">
              Mood & Stress Tracker
            </p>
          </div>
        </div>

        {/* Navigation list */}
        <nav className="space-y-1.5">
          <div className="text-[10px] font-bold tracking-wider text-slate-400 uppercase px-3 mb-2">
            Student Wellness
          </div>

          <button
            onClick={() => setActiveSection('dashboard')}
            className={cn(
              'w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 cursor-pointer text-left',
              activeSection === 'dashboard'
                ? 'bg-[#DFF4FF] text-[#111111] font-semibold border border-[#BFEAFF]'
                : 'text-slate-600 hover:text-[#111111] hover:bg-[#F8FCFF]'
            )}
          >
            <div className="flex items-center gap-3">
              <LayoutDashboard className="w-4 h-4 text-[#111111]" />
              <span>Dashboard & Trends</span>
            </div>
          </button>

          <button
            onClick={() => setActiveSection('checkin')}
            className={cn(
              'w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 cursor-pointer text-left',
              activeSection === 'checkin'
                ? 'bg-[#DFF4FF] text-[#111111] font-semibold border border-[#BFEAFF]'
                : 'text-slate-600 hover:text-[#111111] hover:bg-[#F8FCFF]'
            )}
          >
            <div className="flex items-center gap-3">
              <Heart className="w-4 h-4 text-rose-500" />
              <span>Daily Check-in</span>
            </div>
            <span className="text-[10px] font-semibold bg-[#FFD84D]/40 text-[#111111] px-2 py-0.5 rounded-full border border-[#FFD84D]">
              60s
            </span>
          </button>

          <button
            onClick={() => setActiveSection('history')}
            className={cn(
              'w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 cursor-pointer text-left',
              activeSection === 'history'
                ? 'bg-[#DFF4FF] text-[#111111] font-semibold border border-[#BFEAFF]'
                : 'text-slate-600 hover:text-[#111111] hover:bg-[#F8FCFF]'
            )}
          >
            <div className="flex items-center gap-3">
              <Calendar className="w-4 h-4 text-emerald-600" />
              <span>History & Filter</span>
            </div>
          </button>

          <div className="text-[10px] font-bold tracking-wider text-slate-400 uppercase px-3 pt-5 mb-2">
            Campus Staff & Admin
          </div>

          <button
            onClick={() => setActiveSection('staff')}
            className={cn(
              'w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 cursor-pointer text-left',
              activeSection === 'staff'
                ? 'bg-[#FFF4D9] text-[#111111] font-semibold border border-[#FFD84D]/60'
                : 'text-slate-600 hover:text-[#111111] hover:bg-[#F8FCFF]'
            )}
          >
            <div className="flex items-center gap-3">
              <ShieldAlert className="w-4 h-4 text-rose-500" />
              <span>Support Signals</span>
            </div>
            <span className="text-[10px] font-semibold bg-rose-100 text-rose-700 px-1.5 py-0.5 rounded border border-rose-200">
              3-Day Flag
            </span>
          </button>

          <div className="text-[10px] font-bold tracking-wider text-slate-400 uppercase px-3 pt-5 mb-2">
            System
          </div>

          <button
            onClick={() => setActiveSection('settings')}
            className={cn(
              'w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 cursor-pointer text-left',
              activeSection === 'settings'
                ? 'bg-[#DFF4FF] text-[#111111] font-semibold border border-[#BFEAFF]'
                : 'text-slate-600 hover:text-[#111111] hover:bg-[#F8FCFF]'
            )}
          >
            <div className="flex items-center gap-3">
              <Sliders className="w-4 h-4 text-slate-500" />
              <span>API Configuration</span>
            </div>
          </button>
        </nav>
      </div>

      {/* Bottom info widget */}
      <div className="p-4 border-t border-[#BFEAFF]/60">
        <div className="p-3.5 rounded-xl bg-[#F8FCFF] border border-[#BFEAFF]/60 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#111111] capitalize">{currentRole} Session</span>
            <span className="text-[10px] bg-emerald-100 text-emerald-800 border border-emerald-200 px-1.5 py-0.5 rounded font-mono font-semibold">
              Privacy Mode
            </span>
          </div>
          <p className="text-[11px] text-slate-600 leading-relaxed">
            Private notes are strictly isolated and never shown on staff pages.
          </p>
        </div>
      </div>
    </aside>
  )
}
