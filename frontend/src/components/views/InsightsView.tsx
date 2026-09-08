import React from 'react'
import {
  Sparkles,
  TrendingDown,
  Smile,
  Zap,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react'
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Card } from '../ui/Card'
import { Button } from '../ui/Button'
import { PrivacyPill } from '../ui/Mascot'
import type { NavSection } from '../../types'

const trendData = [
  { day: 'Mon', mood: 62, stress: 3.1, energy: 60 },
  { day: 'Tue', mood: 68, stress: 2.7, energy: 65 },
  { day: 'Wed', mood: 54, stress: 3.8, energy: 50 },
  { day: 'Thu', mood: 72, stress: 2.4, energy: 75 },
  { day: 'Fri', mood: 78, stress: 2.1, energy: 80 },
  { day: 'Sat', mood: 84, stress: 1.8, energy: 85 },
  { day: 'Sun', mood: 76, stress: 2.2, energy: 70 },
]

interface InsightsViewProps {
  onNavigate?: (section: NavSection) => void
}

export const InsightsView: React.FC<InsightsViewProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-5xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Your Insights
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#DFF4FF] text-[#111111] border border-[#BFEAFF]">
              7-Day Trends
            </span>
          </div>
          <h1 className="mt-1 font-extrabold text-2xl sm:text-3xl tracking-tight text-[#111111]">
            Patterns, not pressure.
          </h1>
          <p className="mt-1 text-xs text-slate-600 max-w-xl">
            A gentle look at the last seven days. You are more than any one number.
          </p>
        </div>
        <PrivacyPill />
      </div>

      {/* 3 Key Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-5 border-[#BFEAFF] bg-white shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Average Stress</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
              <TrendingDown className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-4 text-3xl font-extrabold tracking-tight text-[#111111]">
            2.6 <span className="text-sm font-semibold text-slate-400">/ 5</span>
          </div>
          <div className="mt-1 text-xs font-medium text-emerald-700">
            Down 0.8 from last week
          </div>
        </Card>

        <Card className="p-5 border-[#BFEAFF] bg-white shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Mood Trend</span>
            <div className="w-7 h-7 rounded-lg bg-[#FFF4D9] border border-[#FFD84D] flex items-center justify-center text-amber-800">
              <Smile className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-4 text-3xl font-extrabold tracking-tight text-[#111111]">
            Improving
          </div>
          <div className="mt-1 text-xs font-medium text-slate-600">
            Best days were Fri–Sat
          </div>
        </Card>

        <Card className="p-5 border-[#BFEAFF] bg-white shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Energy Levels</span>
            <div className="w-7 h-7 rounded-lg bg-[#DFF4FF] border border-[#BFEAFF] flex items-center justify-center text-[#111111]">
              <Zap className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-4 text-3xl font-extrabold tracking-tight text-[#111111]">
            Steady
          </div>
          <div className="mt-1 text-xs font-medium text-slate-600">
            Mostly in your healthy range
          </div>
        </Card>
      </div>

      {/* Dual Trend Graph */}
      <Card className="p-6 border-[#8ED8FF] bg-white shadow-xs">
        <div className="flex items-start justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              The Bigger Picture
            </span>
            <h2 className="mt-1 text-xl font-extrabold text-[#111111]">
              Mood & Stress Across the Week
            </h2>
          </div>
          <Sparkles className="w-5 h-5 text-[#FFD84D]" />
        </div>

        <div className="mt-6 h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -24, bottom: 0 }}>
              <defs>
                <linearGradient id="moodFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FFD84D" stopOpacity={0.5} />
                  <stop offset="95%" stopColor="#FFD84D" stopOpacity={0.02} />
                </linearGradient>
                <linearGradient id="stressFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#53a9d6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#53a9d6" stopOpacity={0.01} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} stroke="#E1EBF2" strokeDasharray="3 3" />
              <XAxis
                dataKey="day"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#738291', fontSize: 11, fontWeight: 600 }}
              />
              <YAxis hide domain={[0, 100]} />
              <Tooltip
                contentStyle={{
                  borderRadius: 14,
                  border: '1px solid #BFEAFF',
                  backgroundColor: '#FFFFFF',
                  boxShadow: '0 10px 30px rgba(22,53,77,.1)',
                  fontSize: 12,
                }}
              />
              <Area
                type="monotone"
                dataKey="mood"
                name="Mood Score"
                stroke="#111111"
                strokeWidth={3}
                fill="url(#moodFill)"
              />
              <Area
                type="monotone"
                dataKey="stress"
                name="Stress Score (Scale x20)"
                stroke="#53a9d6"
                strokeWidth={2}
                fill="url(#stressFill)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-4 border-t border-[#DFF4FF] pt-4 text-xs font-semibold text-slate-600">
          <div className="flex items-center gap-5">
            <span className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#111111]" />
              <span>Mood (Higher is Better)</span>
            </span>
            <span className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#53a9d6]" />
              <span>Stress (Lower is Better)</span>
            </span>
          </div>

          <span className="text-[11px] text-slate-400">
            Updated automatically with every daily check-in
          </span>
        </div>
      </Card>

      {/* Meaningful encouragement card */}
      <div className="grid grid-cols-1 md:grid-cols-[1.3fr_0.7fr] gap-4">
        <Card className="p-6 bg-[#111111] text-white">
          <span className="text-xs font-bold text-[#FFD84D] uppercase tracking-wider">
            Self-Compassion
          </span>
          <h3 className="text-xl font-bold mt-1">Small wins count.</h3>
          <p className="text-xs text-white/70 mt-2 leading-relaxed">
            You checked in on 6 of the last 7 days. Regularly tuning into your inner state is proven to reduce stress spikes by 35% and prevents burnout before exams.
          </p>
          <div className="mt-5 pt-4 border-t border-white/15 flex items-center justify-between">
            <span className="text-xs text-white/60">Keep your momentum</span>
            {onNavigate && (
              <button
                onClick={() => onNavigate('checkin')}
                className="text-xs font-bold text-[#FFD84D] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Today's Check-in</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </Card>

        <Card className="p-6 border-[#BFEAFF] bg-[#F8FCFF] flex flex-col justify-between">
          <div className="space-y-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <h4 className="font-bold text-sm text-[#111111]">Privacy Protected</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Your personal reflections and notes are strictly private to you. Staff only see cohort-level aggregated signals.
            </p>
          </div>

          {onNavigate && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onNavigate('profile')}
              className="mt-4 w-full"
            >
              How Privacy Works
            </Button>
          )}
        </Card>
      </div>
    </div>
  )
}
