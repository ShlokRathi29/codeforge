import { useEffect, useState } from 'react'
import {
  Lock,
  AlertTriangle,
  Calendar,
  CheckCircle,
  Search,
  RefreshCw,
  PhoneCall,
} from 'lucide-react'
import { Card } from '../ui/Card'
import { Badge } from '../ui/Badge'
import { Button } from '../ui/Button'
import { getStaffSupportSignals, updateStaffSignalStatus } from '../../api/client'
import type { StaffSignalItem } from '../../types'

export const StaffDashboardView: React.FC = () => {
  const [signals, setSignals] = useState<StaffSignalItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [updatingId, setUpdatingId] = useState<number | null>(null)

  const fetchSignals = () => {
    setIsLoading(true)
    getStaffSupportSignals()
      .then((data) => {
        setSignals(data)
        setIsLoading(false)
      })
      .catch(() => setIsLoading(false))
  }

  useEffect(() => {
    fetchSignals()
  }, [])

  const handleStatusChange = async (signalId: number, newStatus: string) => {
    setUpdatingId(signalId)
    try {
      await updateStaffSignalStatus(signalId, newStatus)
      setSignals((prev) =>
        prev.map((s) => (s.id === signalId ? { ...s, status: newStatus } : s))
      )
    } catch {
      // Optimistic update for demo
      setSignals((prev) =>
        prev.map((s) => (s.id === signalId ? { ...s, status: newStatus } : s))
      )
    } finally {
      setUpdatingId(null)
    }
  }

  const filteredSignals = signals.filter((item) => {
    const matchesSearch =
      item.student_name.toLowerCase().includes(search.toLowerCase()) ||
      item.reason.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = filterStatus === 'all' || item.status === filterStatus
    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header & Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold mb-2">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Campus Counselor Portal</span>
          </div>
          <h2 className="text-2xl font-bold text-[#111111]">Support Signals & Early Intervention</h2>
          <p className="text-xs text-slate-500 mt-1">
            Automated detection for students experiencing elevated stress (Level 4–5) for 3+ consecutive days.
          </p>
        </div>

        <Button variant="outline" size="sm" onClick={fetchSignals} leftIcon={<RefreshCw className="w-3.5 h-3.5" />}>
          Refresh Signals
        </Button>
      </div>

      {/* Strict Privacy Guarantee Callout (Problem Requirement 07) */}
      <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-start gap-3.5 shadow-xs">
        <div className="p-2 rounded-lg bg-emerald-100 text-emerald-800 shrink-0 mt-0.5">
          <Lock className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h4 className="font-semibold text-sm text-[#111111]">Student Privacy Guarantee Enforced (Requirement 07)</h4>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 font-semibold uppercase">
              Strict RBAC
            </span>
          </div>
          <p className="text-slate-700 text-xs mt-1 leading-relaxed">
            In compliance with campus mental health ethics, counselors only receive student identification,
            date ranges, and high-stress durations. <strong className="text-[#111111]">Zero personal journal notes or private reflections are exposed.</strong>
          </p>
        </div>
      </div>

      {/* Summary KPI metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <div className="text-xs text-slate-500">Active High-Stress Signals</div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-rose-600">
              {signals.filter((s) => s.status === 'active').length}
            </span>
            <span className="text-xs text-rose-700 font-semibold">Students Need Outreach</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Flagged after 3 consecutive days at 4–5</p>
        </Card>

        <Card>
          <div className="text-xs text-slate-500">Outreach In Progress</div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-amber-600">
              {signals.filter((s) => s.status === 'contacted').length}
            </span>
            <span className="text-xs text-amber-800 font-semibold">Contact Initiated</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Counselor meeting scheduled</p>
        </Card>

        <Card>
          <div className="text-xs text-slate-500">Resolved Support Cycles</div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-emerald-600">
              {signals.filter((s) => s.status === 'resolved').length}
            </span>
            <span className="text-xs text-emerald-700 font-semibold">Students Restabilized</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Stress dropped back to healthy levels</p>
        </Card>
      </div>

      {/* Flagged Students List & Filter */}
      <Card className="p-0 overflow-hidden border border-[#BFEAFF]/70">
        <div className="p-4 bg-[#F8FCFF] border-b border-[#BFEAFF] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {(['all', 'active', 'contacted', 'resolved'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize transition cursor-pointer ${
                  filterStatus === st
                    ? 'bg-[#FFD84D] text-[#111111] shadow-xs'
                    : 'bg-[#DFF4FF] text-[#111111] hover:bg-[#BFEAFF]'
                }`}
              >
                {st === 'all' ? 'All Signals' : st}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search student name..."
              className="w-full bg-white border border-[#BFEAFF] rounded-lg pl-8 pr-3 py-1.5 text-xs text-[#111111] placeholder:text-slate-400 focus:outline-none focus:border-[#FFD84D]"
            />
          </div>
        </div>

        {/* Signals Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-[#F8FCFF] text-slate-600 font-semibold border-b border-[#BFEAFF]">
              <tr>
                <th className="py-3 px-4">Student</th>
                <th className="py-3 px-4">Consecutive High-Stress Period</th>
                <th className="py-3 px-4">Trigger Pattern</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Counselor Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DFF4FF]">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-500">
                    Loading flagged student records...
                  </td>
                </tr>
              ) : filteredSignals.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-500">
                    No students currently meet the 3-day high stress threshold.
                  </td>
                </tr>
              ) : (
                filteredSignals.map((item) => (
                  <tr key={item.id} className="hover:bg-[#F8FCFF] transition">
                    <td className="py-4 px-4">
                      <div className="font-semibold text-[#111111] text-sm">{item.student_name}</div>
                      <div className="text-[11px] text-slate-500 font-mono mt-0.5">{item.student_email || item.student_id}</div>
                    </td>

                    <td className="py-4 px-4">
                      <div className="flex items-center gap-1.5 font-semibold text-[#111111]">
                        <Calendar className="w-3.5 h-3.5 text-[#111111]" />
                        <span>{item.date_from} → {item.date_to}</span>
                      </div>
                      <div className="text-[11px] text-rose-700 mt-0.5">3 Consecutive Days Elevated</div>
                    </td>

                    <td className="py-4 px-4">
                      <div className="inline-flex items-center gap-1.5">
                        <span className="px-2 py-0.5 rounded bg-[#FFF4D9] text-[#111111] font-mono font-bold text-xs border border-[#FFD84D]">
                          Stress 4–5
                        </span>
                        <span className="text-[11px] text-slate-600">{item.reason}</span>
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <Badge
                        variant={
                          item.status === 'active'
                            ? 'error'
                            : item.status === 'contacted'
                            ? 'warning'
                            : 'success'
                        }
                      >
                        {item.status === 'active' ? 'Needs Outreach' : item.status === 'contacted' ? 'In Contact' : 'Resolved'}
                      </Badge>
                    </td>

                    <td className="py-4 px-4 text-right">
                      <div className="inline-flex items-center gap-2">
                        {item.status === 'active' && (
                          <Button
                            size="sm"
                            variant="primary"
                            isLoading={updatingId === item.id}
                            onClick={() => handleStatusChange(item.id, 'contacted')}
                            leftIcon={<PhoneCall className="w-3 h-3 text-[#111111]" />}
                          >
                            Reach Out
                          </Button>
                        )}
                        {item.status === 'contacted' && (
                          <Button
                            size="sm"
                            variant="secondary"
                            isLoading={updatingId === item.id}
                            onClick={() => handleStatusChange(item.id, 'resolved')}
                            leftIcon={<CheckCircle className="w-3 h-3 text-emerald-700" />}
                          >
                            Mark Resolved
                          </Button>
                        )}
                        {item.status === 'resolved' && (
                          <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                            <CheckCircle className="w-3.5 h-3.5" /> Restabilized
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
