import React, { useState } from 'react'
import {
  Lock,
  AlertTriangle,
  Search,
  Sparkles,
  Users,
  Bell,
  CheckCircle2,
  BarChart3,
  ShieldCheck,
  ChevronRight,
  Check,
  MessageCircleHeart,
  FileText,
  X,
  HeartPulse,
  ClipboardCheck,
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
import { AICounselorSuggestionModal } from '../ui/AICounselorSuggestionModal'
import { PrivacyPill } from '../ui/Mascot'

export type StaffTab = 'alerts' | 'insights' | 'students' | 'privacy'

export interface StaffDashboardViewProps {
  initialTab?: StaffTab
  onTabChange?: (tab: StaffTab) => void
}

interface DetailedAlert {
  id: string
  studentId: string
  studentName: string
  kind: string
  status: 'new' | 'reviewed' | 'follow-up' | 'dismissed'
  createdAt: string
  lastCheckIn: string
  reason: string
  bullets: string[]
  trend: { day: string; wellbeing: number; stress: number }[]
}

const SAMPLE_ALERTS: DetailedAlert[] = [
  {
    id: 'ALT-1042',
    studentId: 'PG-2048',
    studentName: 'Atharva Dev',
    kind: 'Persistent Stress Pattern',
    status: 'new',
    createdAt: 'Today, 9:42 AM',
    lastCheckIn: 'Today',
    reason: 'Stress responses have remained elevated (Level 5) across 3 consecutive check-ins.',
    bullets: [
      'Stress above the review threshold 4 of 5 times',
      'Wellbeing has remained below the student’s baseline',
      'Human check-in recommended (Rule 07 Isolation enforced)',
    ],
    trend: [
      { day: 'Mon', wellbeing: 68, stress: 3.5 },
      { day: 'Tue', wellbeing: 61, stress: 4.1 },
      { day: 'Wed', wellbeing: 58, stress: 4.3 },
      { day: 'Thu', wellbeing: 55, stress: 4.8 },
      { day: 'Fri', wellbeing: 52, stress: 5.0 },
    ],
  },
  {
    id: 'ALT-1041',
    studentId: 'PG-1981',
    studentName: 'Jordan Lee',
    kind: 'Declining Wellbeing',
    status: 'follow-up',
    createdAt: 'Yesterday, 3:18 PM',
    lastCheckIn: 'Yesterday',
    reason: 'Recent wellbeing responses show a downward pattern before midterm assessments.',
    bullets: [
      'Wellbeing has declined for 3 consecutive check-ins',
      'Check-in streak is still active (6 days)',
      'Consider offering a low-pressure conversation or walk',
    ],
    trend: [
      { day: 'Mon', wellbeing: 81, stress: 2.1 },
      { day: 'Tue', wellbeing: 76, stress: 2.7 },
      { day: 'Wed', wellbeing: 71, stress: 3.2 },
      { day: 'Thu', wellbeing: 66, stress: 3.8 },
      { day: 'Fri', wellbeing: 62, stress: 4.2 },
    ],
  },
  {
    id: 'ALT-1038',
    studentId: 'PG-1764',
    studentName: 'Taylor Rivera',
    kind: 'Wellbeing Check Recommended',
    status: 'reviewed',
    createdAt: 'Sep 6, 11:06 AM',
    lastCheckIn: 'Sep 6',
    reason: 'The student may benefit from a timely human check-in.',
    bullets: [
      'Elevated stress indicated on Friday & Saturday',
      'Earlier responses suggested increased workload pressure',
      'Zero private journal reflections are included here',
    ],
    trend: [
      { day: 'Mon', wellbeing: 73, stress: 2.8 },
      { day: 'Tue', wellbeing: 69, stress: 3.1 },
      { day: 'Wed', wellbeing: 64, stress: 3.8 },
      { day: 'Thu', wellbeing: 60, stress: 4.0 },
      { day: 'Fri', wellbeing: 60, stress: 4.0 },
    ],
  },
  {
    id: 'ALT-1036',
    studentId: 'PG-2137',
    studentName: 'Casey Smith',
    kind: 'Persistent Stress Pattern',
    status: 'dismissed',
    createdAt: 'Sep 5, 2:40 PM',
    lastCheckIn: 'Sep 5',
    reason: 'Stress responses were consistently higher than baseline but resolved post-project.',
    bullets: [
      'Stress above threshold 3 times last week',
      'Pattern marked dismissed following counselor sync',
      'Dismissal can be revisited if new signals appear',
    ],
    trend: [
      { day: 'Mon', wellbeing: 62, stress: 4.2 },
      { day: 'Tue', wellbeing: 65, stress: 3.8 },
      { day: 'Wed', wellbeing: 70, stress: 3.2 },
      { day: 'Thu', wellbeing: 72, stress: 2.8 },
      { day: 'Fri', wellbeing: 75, stress: 2.4 },
    ],
  },
]

const STUDENT_ROSTER = Array.from({ length: 18 }, (_, i) => {
  const id = `PG-${String(1800 + i * 37).padStart(4, '0')}`
  const names = [
    'Atharva Dev', 'Jordan Lee', 'Taylor Rivera', 'Casey Smith', 'Sam Wilson',
    'Morgan Bailey', 'Robin Vance', 'Alex Chen', 'Priya Patel', 'Marcus Aurel',
    'Elena Rostova', 'David Kim', 'Sophie Martin', 'Lucas Rossi', 'Zoe Adams',
    'Liam Wright', 'Mia Tanaka', 'Noah Clark'
  ]
  const flagged = ['PG-2048', 'PG-1981', 'PG-1764', 'PG-2137'].includes(id)
  return {
    id,
    name: names[i % names.length],
    year: i % 3 === 0 ? 'Year 1' : i % 3 === 1 ? 'Year 2' : 'Year 3',
    lastCheckIn: i % 5 === 0 ? '5 days ago' : 'Today',
    status: flagged ? (i % 2 ? 'Watch' : 'Support recommended') : 'Steady',
    trend: flagged ? (i % 2 ? 'Declining' : 'Stable') : 'Improving',
    checkIns: 3 + (i % 7),
  }
})

const COMMUNITY_TREND = [
  { day: 'Mon', completion: 74, wellbeing: 71, stress: 2.8 },
  { day: 'Tue', completion: 78, wellbeing: 73, stress: 2.7 },
  { day: 'Wed', completion: 76, wellbeing: 70, stress: 3.0 },
  { day: 'Thu', completion: 82, wellbeing: 75, stress: 2.6 },
  { day: 'Fri', completion: 80, wellbeing: 77, stress: 2.4 },
  { day: 'Sat', completion: 59, wellbeing: 79, stress: 2.2 },
  { day: 'Sun', completion: 64, wellbeing: 76, stress: 2.5 },
]

export const StaffDashboardView: React.FC<StaffDashboardViewProps> = ({
  initialTab = 'alerts',
  onTabChange,
}) => {
  const [activeTab, setActiveTab] = useState<StaffTab>(initialTab)
  const [alerts, setAlerts] = useState<DetailedAlert[]>(SAMPLE_ALERTS)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')

  // Sync with initialTab if parent changes activeSection
  React.useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab)
    }
  }, [initialTab])

  const handleTabSelect = (tab: StaffTab) => {
    setActiveTab(tab)
    if (onTabChange) {
      onTabChange(tab)
    }
  }

  // Detailed Alert View Modal
  const [activeAlertDetail, setActiveAlertDetail] = useState<DetailedAlert | null>(null)

  // AI Counselor Outreach Modal
  const [selectedForOutreach, setSelectedForOutreach] = useState<{
    name: string
    streakDays: number
    stressLevel: number
    affectedDates: string
    id?: number
  } | null>(null)

  const handleUpdateStatus = (id: string, nextStatus: DetailedAlert['status']) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: nextStatus } : a))
    )
    if (activeAlertDetail?.id === id) {
      setActiveAlertDetail((prev) => (prev ? { ...prev, status: nextStatus } : null))
    }
  }

  const filteredAlerts = alerts.filter((a) => {
    const matchesSearch =
      a.studentName.toLowerCase().includes(search.toLowerCase()) ||
      a.studentId.toLowerCase().includes(search.toLowerCase()) ||
      a.reason.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = filterStatus === 'all' || a.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const newCount = alerts.filter((a) => a.status === 'new').length
  const followUpCount = alerts.filter((a) => a.status === 'follow-up').length

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header & Sub-Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Staff Portal
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
              Trauma-Informed Triage
            </span>
          </div>
          <h1 className="mt-1 font-extrabold text-2xl sm:text-3xl tracking-tight text-[#111111]">
            A clearer view of care.
          </h1>
          <p className="mt-1 text-xs text-slate-600 max-w-xl">
            Review privacy-safe patterns, keep context human, and decide what support may be useful.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <PrivacyPill />
        </div>
      </div>

      {/* Staff Tab Switcher */}
      <div className="flex items-center gap-1.5 p-1 bg-white border border-[#BFEAFF] rounded-2xl w-fit shadow-2xs">
        <button
          onClick={() => handleTabSelect('alerts')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-2 ${
            activeTab === 'alerts'
              ? 'bg-[#FFD84D] text-[#111111] shadow-2xs'
              : 'text-slate-600 hover:text-[#111111]'
          }`}
        >
          <Bell className="w-3.5 h-3.5" />
          <span>Attention Queue</span>
          {newCount > 0 && (
            <span className="w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] flex items-center justify-center font-extrabold">
              {newCount}
            </span>
          )}
        </button>

        <button
          onClick={() => handleTabSelect('insights')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-2 ${
            activeTab === 'insights'
              ? 'bg-[#FFD84D] text-[#111111] shadow-2xs'
              : 'text-slate-600 hover:text-[#111111]'
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5" />
          <span>Cohort Insights</span>
        </button>

        <button
          onClick={() => handleTabSelect('students')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-2 ${
            activeTab === 'students'
              ? 'bg-[#FFD84D] text-[#111111] shadow-2xs'
              : 'text-slate-600 hover:text-[#111111]'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Student Directory</span>
        </button>

        <button
          onClick={() => handleTabSelect('privacy')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-2 ${
            activeTab === 'privacy'
              ? 'bg-[#FFD84D] text-[#111111] shadow-2xs'
              : 'text-slate-600 hover:text-[#111111]'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Privacy & Boundaries</span>
        </button>
      </div>

      {/* ================= TAB 1: ATTENTION QUEUE ================= */}
      {activeTab === 'alerts' && (
        <div className="space-y-6">
          {/* 4 Key Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="p-4 border-[#BFEAFF] bg-white shadow-2xs">
              <div className="flex items-center justify-between text-xs font-bold text-slate-500">
                <span>Active Students</span>
                <Users className="w-4 h-4 text-slate-400" />
              </div>
              <div className="mt-3 text-2xl font-extrabold text-[#111111]">184</div>
              <div className="mt-1 text-[11px] font-medium text-slate-500">82% checked in this week</div>
            </Card>

            <Card className="p-4 border-[#BFEAFF] bg-white shadow-2xs">
              <div className="flex items-center justify-between text-xs font-bold text-slate-500">
                <span>New Alerts</span>
                <Bell className="w-4 h-4 text-rose-500" />
              </div>
              <div className="mt-3 text-2xl font-extrabold text-[#111111]">{newCount}</div>
              <div className="mt-1 text-[11px] font-medium text-rose-600">Need a first look</div>
            </Card>

            <Card className="p-4 border-[#BFEAFF] bg-white shadow-2xs">
              <div className="flex items-center justify-between text-xs font-bold text-slate-500">
                <span>Follow-up Queue</span>
                <AlertTriangle className="w-4 h-4 text-amber-500" />
              </div>
              <div className="mt-3 text-2xl font-extrabold text-[#111111]">{followUpCount}</div>
              <div className="mt-1 text-[11px] font-medium text-amber-700">Human support recommended</div>
            </Card>

            <Card className="p-4 border-[#BFEAFF] bg-white shadow-2xs">
              <div className="flex items-center justify-between text-xs font-bold text-slate-500">
                <span>Reviewed This Week</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="mt-3 text-2xl font-extrabold text-[#111111]">31</div>
              <div className="mt-1 text-[11px] font-medium text-emerald-700">Audit trail up to date</div>
            </Card>
          </div>

          {/* Attention Queue Card List */}
          <Card className="p-6 border-[#8ED8FF] bg-white shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Attention Queue
                </span>
                <h2 className="mt-1 text-xl font-extrabold text-[#111111]">
                  Patterns worth a human look
                </h2>
              </div>

              {/* Filters */}
              <div className="flex items-center gap-2">
                <div className="relative w-60">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search alert or student..."
                    className="w-full pl-8 pr-3 py-1.5 text-xs bg-[#F8FCFF] border border-[#BFEAFF] rounded-xl text-[#111111] focus:outline-none focus:border-[#FFD84D]"
                  />
                </div>

                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-1.5 text-xs bg-[#F8FCFF] border border-[#BFEAFF] rounded-xl text-[#111111] font-bold outline-none"
                >
                  <option value="all">All Statuses</option>
                  <option value="new">New</option>
                  <option value="follow-up">Needs Follow-up</option>
                  <option value="reviewed">Reviewed</option>
                  <option value="dismissed">Dismissed</option>
                </select>
              </div>
            </div>

            {/* List of Alerts */}
            <div className="space-y-3 pt-2">
              {filteredAlerts.length === 0 ? (
                <div className="py-12 text-center text-xs text-slate-500">
                  No alerts match your current filter.
                </div>
              ) : (
                filteredAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    className="p-5 rounded-2xl border border-[#BFEAFF] bg-[#F8FCFF] hover:bg-white transition space-y-3 shadow-2xs"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#FFD84D] text-[#111111] flex items-center justify-center shrink-0">
                          <AlertTriangle className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-sm font-extrabold text-[#111111]">
                              {alert.kind}
                            </h3>
                            <span
                              className={`rounded-full px-2 py-0.5 text-[10px] font-extrabold ${
                                alert.status === 'new'
                                  ? 'bg-[#FFD84D] text-[#111111]'
                                  : alert.status === 'follow-up'
                                  ? 'bg-rose-100 text-rose-800 border border-rose-200'
                                  : alert.status === 'reviewed'
                                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                  : 'bg-slate-100 text-slate-600'
                              }`}
                            >
                              {alert.status === 'new'
                                ? 'New'
                                : alert.status === 'follow-up'
                                ? 'Needs Follow-up'
                                : alert.status === 'reviewed'
                                ? 'Reviewed'
                                : 'Dismissed'}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 mt-0.5">
                            {alert.studentName} ({alert.studentId}) · {alert.createdAt}
                          </p>
                          <p className="text-xs text-slate-700 mt-2 leading-relaxed max-w-2xl">
                            {alert.reason}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => setActiveAlertDetail(alert)}
                        className="inline-flex items-center gap-1 text-xs font-bold text-[#111111] hover:underline shrink-0 cursor-pointer self-start sm:self-auto"
                      >
                        <span>View Trend</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Action Bar */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#DFF4FF]">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleUpdateStatus(alert.id, 'reviewed')}
                          className="px-3 py-1.5 rounded-lg border border-[#BFEAFF] bg-white text-xs font-bold text-slate-700 hover:border-[#111111] transition cursor-pointer flex items-center gap-1"
                        >
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span>Mark Reviewed</span>
                        </button>

                        <button
                          onClick={() => handleUpdateStatus(alert.id, 'follow-up')}
                          className="px-3 py-1.5 rounded-lg border border-[#BFEAFF] bg-white text-xs font-bold text-slate-700 hover:border-[#111111] transition cursor-pointer"
                        >
                          Needs Follow-up
                        </button>

                        <button
                          onClick={() => handleUpdateStatus(alert.id, 'dismissed')}
                          className="px-3 py-1.5 rounded-lg text-xs font-bold text-slate-400 hover:text-slate-600 hover:bg-[#DFF4FF]/40 transition cursor-pointer"
                        >
                          Dismiss
                        </button>
                      </div>

                      {/* AI Outreach Assistant button */}
                      <Button
                        size="sm"
                        variant="primary"
                        onClick={() =>
                          setSelectedForOutreach({
                            name: alert.studentName,
                            streakDays: 3,
                            stressLevel: 5,
                            affectedDates: 'Recent 3 days',
                          })
                        }
                        leftIcon={<Sparkles className="w-3.5 h-3.5 text-[#111111]" />}
                      >
                        Generate AI Outreach Draft
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>
      )}

      {/* ================= TAB 2: COHORT INSIGHTS ================= */}
      {activeTab === 'insights' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="p-5 border-[#BFEAFF] bg-white shadow-2xs">
              <div className="flex items-center justify-between text-xs font-bold text-slate-500">
                <span>Weekly Completion</span>
                <ClipboardCheck className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="mt-3 text-3xl font-extrabold text-[#111111]">76%</div>
              <div className="mt-1 text-xs text-emerald-700 font-medium">Across active students</div>
            </Card>

            <Card className="p-5 border-[#BFEAFF] bg-white shadow-2xs">
              <div className="flex items-center justify-between text-xs font-bold text-slate-500">
                <span>Average Wellbeing</span>
                <HeartPulse className="w-4 h-4 text-[#111111]" />
              </div>
              <div className="mt-3 text-3xl font-extrabold text-[#111111]">72 / 100</div>
              <div className="mt-1 text-xs text-slate-500 font-medium">Within expected baseline</div>
            </Card>

            <Card className="p-5 border-[#BFEAFF] bg-white shadow-2xs">
              <div className="flex items-center justify-between text-xs font-bold text-slate-500">
                <span>Average Stress</span>
                <BarChart3 className="w-4 h-4 text-amber-600" />
              </div>
              <div className="mt-3 text-3xl font-extrabold text-[#111111]">2.7 / 5</div>
              <div className="mt-1 text-xs text-emerald-700 font-medium">Slightly down this week</div>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_0.7fr] gap-5">
            <Card className="p-6 border-[#8ED8FF] bg-white shadow-xs">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Seven Day View
              </span>
              <h2 className="mt-1 text-xl font-extrabold text-[#111111]">
                Wellbeing & Completion Across the Community
              </h2>

              <div className="mt-6 h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={COMMUNITY_TREND} margin={{ top: 10, right: 10, left: -24, bottom: 0 }}>
                    <defs>
                      <linearGradient id="commWellbeing" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#FFD84D" stopOpacity={0.5} />
                        <stop offset="95%" stopColor="#FFD84D" stopOpacity={0.02} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid vertical={false} stroke="#E1EBF2" strokeDasharray="3 3" />
                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#738291', fontSize: 11, fontWeight: 600 }} />
                    <YAxis hide domain={[0, 100]} />
                    <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #BFEAFF', fontSize: 12 }} />
                    <Area type="monotone" dataKey="wellbeing" name="Avg Wellbeing" stroke="#111111" strokeWidth={3} fill="url(#commWellbeing)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-4 flex items-center gap-4 text-xs font-semibold text-slate-600 border-t border-[#DFF4FF] pt-4">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#111111]" />
                  <span>Wellbeing Score</span>
                </span>
                <span className="text-[11px] text-slate-400">
                  Aggregated and anonymized across all check-ins
                </span>
              </div>
            </Card>

            <Card className="p-6 bg-[#111111] text-white flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-[#FFD84D] uppercase tracking-wider">
                  Read with Care
                </span>
                <h3 className="text-xl font-bold mt-1">Common patterns, not conclusions.</h3>
                <p className="text-xs text-white/70 mt-3 leading-relaxed">
                  Completion tends to be higher midweek, while average stress is gently lower on weekends. This is a cohort planning signal, not an individual diagnosis or algorithmic prediction.
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-white/15 text-xs text-white/80 font-bold">
                Use cohort signals to ask better questions in support meetings.
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* ================= TAB 3: STUDENT DIRECTORY ================= */}
      {activeTab === 'students' && (
        <Card className="p-6 border-[#8ED8FF] bg-white shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Student Directory
              </span>
              <h2 className="mt-1 text-xl font-extrabold text-[#111111]">
                Permitted Identifiers & Trend Indicators
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Reflections remain strictly private. Staff only see permitted roster status.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {STUDENT_ROSTER.map((student) => (
              <div
                key={student.id}
                className="p-4 rounded-xl border border-[#BFEAFF] bg-[#F8FCFF] space-y-2 shadow-2xs"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-[#DFF4FF] border border-[#BFEAFF] flex items-center justify-center text-[#111111]">
                      <Users className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-[#111111]">{student.name}</h4>
                      <p className="text-[10px] text-slate-500 font-mono">{student.id} · {student.year}</p>
                    </div>
                  </div>

                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                      student.status === 'Steady'
                        ? 'bg-emerald-100 text-emerald-800'
                        : student.status === 'Watch'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {student.status}
                  </span>
                </div>

                <div className="pt-2 border-t border-[#DFF4FF] flex items-center justify-between text-[11px] text-slate-500">
                  <span>Last: {student.lastCheckIn}</span>
                  <span className="font-semibold text-[#111111]">Trend: {student.trend}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* ================= TAB 4: PRIVACY & BOUNDARIES ================= */}
      {activeTab === 'privacy' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="p-6 border-[#BFEAFF] bg-white space-y-3">
              <div className="w-9 h-9 rounded-xl bg-[#FFF4D9] border border-[#FFD84D] flex items-center justify-center text-[#111111]">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-extrabold text-[#111111]">Minimum Necessary Access</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Staff see permitted identifiers, broad trend categories, and generated early intervention alerts only.
              </p>
            </Card>

            <Card className="p-6 border-[#BFEAFF] bg-white space-y-3">
              <div className="w-9 h-9 rounded-xl bg-[#FFF4D9] border border-[#FFD84D] flex items-center justify-center text-[#111111]">
                <Lock className="w-5 h-5 text-emerald-700" />
              </div>
              <h3 className="text-base font-extrabold text-[#111111]">Private Reflections Stay Private</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Journal text, reflections, and personal diary notes never appear in the staff portal (Rule 07 Isolation).
              </p>
            </Card>

            <Card className="p-6 border-[#BFEAFF] bg-white space-y-3">
              <div className="w-9 h-9 rounded-xl bg-[#FFF4D9] border border-[#FFD84D] flex items-center justify-center text-[#111111]">
                <FileText className="w-5 h-5 text-amber-700" />
              </div>
              <h3 className="text-base font-extrabold text-[#111111]">Non-Diagnostic Language</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Alerts describe stress patterns and support options, not psychiatric diagnoses, labels, or clinical conclusions.
              </p>
            </Card>

            <Card className="p-6 border-[#BFEAFF] bg-white space-y-3">
              <div className="w-9 h-9 rounded-xl bg-[#FFF4D9] border border-[#FFD84D] flex items-center justify-center text-[#111111]">
                <MessageCircleHeart className="w-5 h-5 text-indigo-700" />
              </div>
              <h3 className="text-base font-extrabold text-[#111111]">Human Judgment Stays Central</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Every alert is an invitation to consider a warm, low-pressure conversation—never an algorithmic penalty.
              </p>
            </Card>
          </div>

          <Card className="p-6 bg-[#111111] text-white space-y-3">
            <span className="text-xs font-bold text-[#FFD84D] uppercase tracking-wider">
              Auditable Actions Log
            </span>
            <h3 className="text-xl font-bold">What staff actions are recorded?</h3>
            <p className="text-xs text-white/70 max-w-2xl leading-relaxed">
              Reviewing, marking follow-up, or dismissing an alert records a simple audit timestamp and counselor ID. This guarantees accountability without compromising student confidentiality.
            </p>
          </Card>
        </div>
      )}

      {/* ================= DETAILED ALERT TREND MODAL ================= */}
      {activeAlertDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#111111]/50 backdrop-blur-xs">
          <div className="relative w-full max-w-3xl bg-white border border-[#BFEAFF] rounded-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-[#DFF4FF] bg-[#F8FCFF] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#FFD84D] flex items-center justify-center text-[#111111]">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm sm:text-base text-[#111111]">
                    {activeAlertDetail.kind}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    {activeAlertDetail.studentName} ({activeAlertDetail.studentId}) · {activeAlertDetail.createdAt}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setActiveAlertDetail(null)}
                className="p-1.5 rounded-xl hover:bg-[#DFF4FF] text-slate-500 hover:text-[#111111] transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 p-6 overflow-y-auto space-y-6">
              {/* Pattern Summary */}
              <div className="p-4 rounded-2xl bg-[#F8FCFF] border border-[#BFEAFF] space-y-3">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Pattern Evaluation
                </span>
                <p className="text-xs text-slate-700 leading-relaxed">
                  {activeAlertDetail.reason}
                </p>
                <div className="space-y-1.5 pt-1">
                  {activeAlertDetail.bullets.map((bullet, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-[#111111] font-medium">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{bullet}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 5-Day Trend AreaChart */}
              <div className="p-4 rounded-2xl border border-[#BFEAFF] bg-white space-y-3">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Recent 5-Day Trend (Aggregated Scores)
                </span>
                <div className="h-56 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={activeAlertDetail.trend} margin={{ top: 10, right: 10, left: -24, bottom: 0 }}>
                      <CartesianGrid vertical={false} stroke="#E1EBF2" strokeDasharray="3 3" />
                      <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#738291', fontSize: 11 }} />
                      <YAxis hide domain={[0, 100]} />
                      <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #BFEAFF', fontSize: 12 }} />
                      <Area type="monotone" dataKey="wellbeing" name="Wellbeing" stroke="#111111" strokeWidth={2} fill="#FFD84D" fillOpacity={0.3} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Recommended Action Box */}
              <div className="p-4 rounded-2xl bg-[#DFF4FF]/50 border border-[#BFEAFF] flex items-start gap-3">
                <MessageCircleHeart className="w-5 h-5 text-[#111111] shrink-0 mt-0.5" />
                <div className="text-xs text-slate-700 leading-relaxed">
                  <span className="font-bold text-[#111111] block mb-1">Recommended Human Action</span>
                  Offer a low-pressure check-in (e.g. coffee walk or email check-in). Never lead with algorithmic alerts or assume clinical diagnosis.
                </div>
              </div>
            </div>

            {/* Modal Footer Actions */}
            <div className="p-4 border-t border-[#DFF4FF] bg-white flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleUpdateStatus(activeAlertDetail.id, 'reviewed')}
                  className="px-3 py-1.5 rounded-xl border border-[#BFEAFF] text-xs font-bold text-slate-700 hover:border-[#111111] transition cursor-pointer"
                >
                  Mark Reviewed
                </button>
                <button
                  onClick={() => handleUpdateStatus(activeAlertDetail.id, 'follow-up')}
                  className="px-3 py-1.5 rounded-xl border border-[#BFEAFF] text-xs font-bold text-slate-700 hover:border-[#111111] transition cursor-pointer"
                >
                  Needs Follow-up
                </button>
              </div>

              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  setSelectedForOutreach({
                    name: activeAlertDetail.studentName,
                    streakDays: 3,
                    stressLevel: 5,
                    affectedDates: 'Recent 3 days',
                  })
                }}
                leftIcon={<Sparkles className="w-3.5 h-3.5 text-[#111111]" />}
              >
                Generate AI Outreach Draft
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ================= AI COUNSELOR SUGGESTION MODAL ================= */}
      {selectedForOutreach && (
        <AICounselorSuggestionModal
          isOpen={Boolean(selectedForOutreach)}
          onClose={() => setSelectedForOutreach(null)}
          studentName={selectedForOutreach.name}
          streakDays={selectedForOutreach.streakDays}
          stressLevel={selectedForOutreach.stressLevel}
          affectedDates={selectedForOutreach.affectedDates}
        />
      )}
    </div>
  )
}
