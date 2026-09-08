import { useEffect, useState } from 'react'
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Calendar,
  Flame,
  AlertTriangle,
  Heart,
  ChevronRight,
  ShieldCheck,
  Sparkles,
} from 'lucide-react'
import { Card, CardHeader, CardTitle } from '../ui/Card'
import { Button } from '../ui/Button'
import { Badge } from '../ui/Badge'
import { AIStudentCompanionModal } from '../ui/AIStudentCompanionModal'
import { Mascot, PrivacyPill } from '../ui/Mascot'
import { getDashboardSummary, getDashboardTrends } from '../../api/client'
import type { DashboardSummary, DashboardTrends, NavSection } from '../../types'

interface StudentDashboardViewProps {
  onNavigate: (section: NavSection) => void
}

export const StudentDashboardView: React.FC<StudentDashboardViewProps> = ({ onNavigate }) => {
  const [summary, setSummary] = useState<DashboardSummary | null>(null)
  const [trends, setTrends] = useState<DashboardTrends | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showHelplineModal, setShowHelplineModal] = useState(false)
  const [showAIModal, setShowAIModal] = useState(false)

  useEffect(() => {
    let mounted = true
    Promise.all([getDashboardSummary(), getDashboardTrends()])
      .then(([s, t]) => {
        if (mounted) {
          setSummary(s)
          setTrends(t)
          setIsLoading(false)
        }
      })
      .catch(() => {
        if (mounted) setIsLoading(false)
      })
    return () => {
      mounted = false
    }
  }, [])

  const moodEmojis: Record<string, string> = {
    great: '😄',
    happy: '🙂',
    neutral: '😐',
    sad: '😔',
    very_low: '😣',
  }

  if (isLoading) {
    return (
      <div className="py-24 text-center space-y-3">
        <div className="w-8 h-8 border-2 border-[#FFD84D] border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs text-slate-500">Loading student wellbeing trends...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Welcome Banner & CTA with Pingu Mascot */}
      <div className="relative overflow-hidden rounded-3xl border border-[#BFEAFF] bg-[#cdeeff] p-6 sm:p-8 lg:p-10 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="max-w-xl">
            <PrivacyPill />
            <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/80 border border-[#BFEAFF] text-[#111111] text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-[#111111]" />
              <span>A Kinder Check-in</span>
            </div>
            <h1 className="mt-2 text-2xl sm:text-4xl font-extrabold text-[#111111] tracking-tight">
              Hey {summary?.student_name || 'Atharva'}, how are you really doing?
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-slate-700 leading-relaxed max-w-lg">
              A few honest seconds can help you notice patterns, protect your energy, and find the support you deserve.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Button
                size="lg"
                variant="primary"
                onClick={() => onNavigate('checkin')}
                leftIcon={<Heart className="w-4 h-4 text-[#111111]" />}
              >
                {summary?.today_status.completed ? 'Update Today’s Check-in' : 'Start Today’s Check-in'}
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => onNavigate('insights')}
                className="bg-white border-[#8ED8FF] hover:bg-[#DFF4FF] text-[#111111]"
              >
                View My Insights
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => setShowAIModal(true)}
                className="bg-white border-[#8ED8FF] hover:bg-[#DFF4FF] text-[#111111]"
                leftIcon={<Sparkles className="w-4 h-4 text-[#111111]" />}
              >
                AI Companion
              </Button>
            </div>
          </div>

          <div className="hidden lg:block w-64 h-64 shrink-0 relative -mr-4">
            <Mascot mode="welcome" className="h-full w-full" />
          </div>
        </div>
      </div>

      {/* Supportive Wellbeing Insight Banner */}
      {summary?.wellbeing_insight && (
        <div
          className={`p-4 rounded-xl border flex items-start gap-3.5 transition-all ${
            summary.today_status.stress_level && summary.today_status.stress_level >= 4
              ? 'bg-amber-50 border-amber-200 text-amber-900'
              : 'bg-[#DFF4FF]/50 border-[#BFEAFF] text-[#111111]'
          }`}
        >
          <div className="p-2 rounded-lg bg-amber-100 text-amber-800 shrink-0 mt-0.5">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h4 className="font-semibold text-sm text-[#111111]">Wellbeing Observation</h4>
              {trends?.support_signal_active && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 border border-rose-200 font-semibold uppercase tracking-wider">
                  Support Signal Triggered
                </span>
              )}
            </div>
            <p className="text-xs text-slate-700 mt-1 leading-relaxed">
              {summary.wellbeing_insight}
            </p>
          </div>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Today's Status */}
        <Card>
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Today's Check-in</span>
            <Calendar className="w-4 h-4 text-[#111111]" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            {summary?.today_status.completed ? (
              <div className="flex items-center gap-2">
                <span className="text-3xl">{moodEmojis[summary.today_status.mood || 'neutral']}</span>
                <div>
                  <div className="text-sm font-semibold text-[#111111]">Stress {summary.today_status.stress_level}/5</div>
                  <div className="text-[11px] text-emerald-700 font-medium">Recorded for today</div>
                </div>
              </div>
            ) : (
              <div>
                <span className="text-lg font-bold text-amber-700">Pending</span>
                <p className="text-xs text-slate-500 mt-0.5">Take 60s to log how you feel</p>
              </div>
            )}
          </div>
        </Card>

        {/* Card 2: 7-Day Average Stress */}
        <Card>
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>7-Day Avg Stress</span>
            <div className="px-1.5 py-0.5 rounded-md bg-[#DFF4FF] border border-[#BFEAFF] text-[#111111]">
              <span className="text-xs font-mono font-bold">1-5</span>
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-[#111111]">
              {summary?.average_stress ?? 3.7}
              <span className="text-xs text-slate-500 font-normal"> / 5.0</span>
            </span>
            <Badge variant={summary && summary.average_stress >= 4 ? 'error' : summary && summary.average_stress >= 3 ? 'warning' : 'success'}>
              {summary && summary.average_stress >= 4 ? 'High' : summary && summary.average_stress >= 3 ? 'Moderate' : 'Healthy'}
            </Badge>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">Based on {summary?.week_checkins_count || 7} logged days</p>
        </Card>

        {/* Card 3: Stress Trajectory */}
        <Card>
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Stress Trajectory</span>
            {summary?.stress_trend === 'increasing' ? (
              <TrendingUp className="w-4 h-4 text-rose-600" />
            ) : summary?.stress_trend === 'decreasing' ? (
              <TrendingDown className="w-4 h-4 text-emerald-600" />
            ) : (
              <Minus className="w-4 h-4 text-slate-500" />
            )}
          </div>
          <div className="mt-3">
            <span className={`text-xl font-bold capitalize ${
              summary?.stress_trend === 'increasing' ? 'text-rose-700' : summary?.stress_trend === 'decreasing' ? 'text-emerald-700' : 'text-[#111111]'
            }`}>
              {summary?.stress_trend === 'increasing' ? 'Increasing ↑' : summary?.stress_trend === 'decreasing' ? 'Improving ↓' : 'Stable →'}
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">Compared against early week baseline</p>
        </Card>

        {/* Card 4: Consecutive Streak */}
        <Card>
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Check-in Streak</span>
            <Flame className="w-4 h-4 text-amber-500" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-[#111111]">{summary?.streak_days || 7}</span>
            <span className="text-xs text-amber-700 font-semibold">Consecutive Days</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">Keep building your personal habit</p>
        </Card>
      </div>

      {/* 7-Day Visual Trend Chart Section */}
      <Card className="p-6">
        <CardHeader>
          <div>
            <CardTitle>7-Day Mood & Stress Trajectory</CardTitle>
            <p className="text-xs text-slate-500 mt-0.5">
              Visual progression of daily stress (1–5 scale) and logged mood
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-xs bg-[#8ED8FF] border border-[#8ED8FF]" />
              <span className="text-slate-600 font-medium">Stress (1–3 Normal)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-xs bg-[#FFD84D] border border-[#FFC928]" />
              <span className="text-slate-600 font-medium">Stress (4–5 Elevated)</span>
            </div>
          </div>
        </CardHeader>

        {/* Bar & Mood Curve Visualization */}
        <div className="mt-6 pt-4">
          <div className="grid grid-cols-7 gap-2 sm:gap-4 items-end h-52 pb-6 border-b border-[#BFEAFF]">
            {trends?.history_7d.map((day, idx) => {
              const isHigh = day.stress >= 4
              const barHeightPct = Math.max((day.stress / 5) * 100, 10)
              return (
                <div key={idx} className="flex flex-col items-center h-full justify-end group">
                  {/* Mood Emoji on top */}
                  <span className="text-lg sm:text-2xl mb-2 transition transform group-hover:scale-125">
                    {moodEmojis[day.mood] || '😐'}
                  </span>

                  {/* Stress Bar */}
                  <div className="w-full max-w-[3rem] bg-[#DFF4FF]/50 rounded-t-lg relative flex flex-col justify-end overflow-hidden h-36">
                    <div
                      style={{ height: `${barHeightPct}%` }}
                      className={`w-full rounded-t transition-all duration-500 flex items-center justify-center text-xs font-bold text-[#111111] shadow-xs ${
                        isHigh ? 'bg-[#FFD84D]' : 'bg-[#8ED8FF]'
                      }`}
                    >
                      {day.stress > 0 && <span>{day.stress}</span>}
                    </div>
                  </div>

                  {/* Day Name */}
                  <span className="text-xs font-semibold text-slate-800 mt-2">{day.day}</span>
                  <span className="text-[10px] text-slate-500">{day.date.slice(5)}</span>
                </div>
              )
            })}
          </div>

          <div className="mt-4 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#111111]" />
              <span>Stress threshold line at Level 4 triggers proactive support signal if maintained for 3+ days.</span>
            </span>
            <Button variant="ghost" size="sm" onClick={() => onNavigate('history')} rightIcon={<ChevronRight className="w-3.5 h-3.5" />}>
              View Full History Logs
            </Button>
          </div>
        </div>
      </Card>

      {/* Campus Helpline Modal */}
      {showHelplineModal && (
        <div className="fixed inset-0 z-50 bg-[#111111]/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#BFEAFF] rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-[#DFF4FF] pb-3">
              <h3 className="font-bold text-[#111111] text-base flex items-center gap-2">
                <Heart className="w-4 h-4 text-rose-500" />
                Campus Wellbeing Contacts
              </h3>
              <button
                onClick={() => setShowHelplineModal(false)}
                className="text-slate-400 hover:text-[#111111] text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-600">
              Your mental wellness comes first. Reach out anytime — all consultations are confidential.
            </p>

            <div className="space-y-2.5 text-xs">
              <div className="p-3 bg-[#F8FCFF] rounded-xl border border-[#BFEAFF]">
                <div className="font-semibold text-[#111111]">Campus Counseling Center</div>
                <div className="text-[#111111] font-medium mt-0.5">📞 +1 (800) 273-TALK / Ext 4402</div>
                <div className="text-slate-500 text-[11px] mt-0.5">Mon–Fri: 8:00 AM – 8:00 PM • Health Center Bldg B</div>
              </div>
              <div className="p-3 bg-[#F8FCFF] rounded-xl border border-[#BFEAFF]">
                <div className="font-semibold text-[#111111]">24/7 Crisis Helpline</div>
                <div className="text-emerald-700 font-medium mt-0.5">Text 'SUPPORT' to 741741</div>
                <div className="text-slate-500 text-[11px] mt-0.5">Free, confidential peer support available 24/7</div>
              </div>
            </div>

            <div className="pt-2">
              <Button variant="primary" className="w-full" onClick={() => setShowHelplineModal(false)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* AI Wellbeing Companion Modal (Groq RAG) */}
      <AIStudentCompanionModal
        isOpen={showAIModal}
        onClose={() => setShowAIModal(false)}
        studentName={summary?.student_name}
        recentContext={summary?.today_status}
      />
    </div>
  )
}
