import React, { useState } from 'react'
import {
  ShieldCheck,
  Check,
  Download,
  LockKeyhole,
  UserRound,
} from 'lucide-react'
import { Card } from '../ui/Card'
import { Button } from '../ui/Button'
import { PrivacyPill } from '../ui/Mascot'
import type { User } from '../../types'

interface ProfilePrivacyViewProps {
  currentUser: User | null
}

const PRIVACY_PRINCIPLES = [
  'Your responses and private reflections belong strictly to you.',
  'Staff and counselors NEVER see the private notes you write (Rule 07 Isolation).',
  'Only predefined patterns (e.g. 3 consecutive days of severe stress) create support invitations.',
  'You can export or request full deletion of your check-in journal anytime.',
]

export const ProfilePrivacyView: React.FC<ProfilePrivacyViewProps> = ({ currentUser }) => {
  const [downloaded, setDownloaded] = useState(false)

  const handleExportData = () => {
    const data = {
      exported_at: new Date().toISOString(),
      student_id: currentUser?.id || 'usr-student-01',
      student_name: currentUser?.name || 'Atharva Dev',
      privacy_standard: 'Rule 07 & FERPA Compliant',
      checkin_records: [
        { date: '2026-09-08', mood: 'neutral', stress: 3, sleep_quality: 2, note: 'Exam preparations ongoing' },
        { date: '2026-09-07', mood: 'happy', stress: 2, sleep_quality: 3, note: 'Productive study group' },
        { date: '2026-09-06', mood: 'great', stress: 1, sleep_quality: 3, note: 'Relaxing weekend' },
      ],
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `pingu-wellness-export-${currentUser?.id || 'student'}.json`
    a.click()
    URL.revokeObjectURL(url)

    setDownloaded(true)
    setTimeout(() => setDownloaded(false), 3000)
  }

  return (
    <div className="max-w-4xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Account & Security
          </span>
          <h1 className="mt-1 font-extrabold text-2xl sm:text-3xl tracking-tight text-[#111111]">
            A safe space to be honest.
          </h1>
          <p className="mt-1 text-xs text-slate-600 max-w-xl">
            Your wellbeing belongs to you. Pingu is built to help you notice patterns, not label or judge you.
          </p>
        </div>
        <PrivacyPill />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[0.8fr_1.2fr] gap-5">
        {/* Profile Card */}
        <Card className="p-6 bg-[#111111] text-white flex flex-col justify-between">
          <div>
            <div className="w-14 h-14 rounded-2xl bg-[#FFD84D] text-[#111111] flex items-center justify-center shadow-xs">
              <UserRound className="w-7 h-7" />
            </div>

            <h2 className="mt-6 font-extrabold text-2xl tracking-tight">
              {currentUser?.name || 'Atharva Dev'}
            </h2>
            <p className="text-xs text-white/60 mt-1">
              Student Account · Computer Science Year 2
            </p>
            <p className="text-xs text-[#FFD84D] font-mono mt-1">
              {currentUser?.email || 'student@codeforge.local'}
            </p>

            <div className="mt-6 pt-5 border-t border-white/15 space-y-2 text-xs text-white/80">
              <div className="flex items-center justify-between">
                <span>Active Streak:</span>
                <span className="font-bold text-[#FFD84D]">6 Days</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Check-in Status:</span>
                <span className="text-emerald-400 font-semibold">Today Complete</span>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-white/15 flex items-center justify-between text-xs text-white/70">
            <span>Authentication:</span>
            <span className="font-mono text-white">OAuth2 Sandbox</span>
          </div>
        </Card>

        {/* Privacy in Plain English */}
        <Card className="p-6 border-[#8ED8FF] bg-white shadow-xs space-y-6">
          <div className="flex items-start gap-4">
            <div className="w-11 h-11 rounded-2xl bg-[#ddf5e7] flex items-center justify-center shrink-0 text-emerald-800">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-extrabold text-xl text-[#111111]">
                Privacy, in plain English
              </h2>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Trust is the prerequisite of authentic care. Here is our unambiguous commitment to your data:
              </p>
            </div>
          </div>

          <div className="space-y-3.5">
            {PRIVACY_PRINCIPLES.map((principle, idx) => (
              <div key={idx} className="flex items-start gap-3 text-xs text-[#111111]">
                <div className="w-4 h-4 rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-2.5 h-2.5 text-emerald-800" />
                </div>
                <span className="leading-relaxed font-medium">{principle}</span>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-xl bg-[#F8FCFF] border border-[#BFEAFF] flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <LockKeyhole className="w-4 h-4 text-slate-600 shrink-0" />
              <div className="text-xs">
                <span className="font-bold text-[#111111] block">Data Portability</span>
                <span className="text-slate-500">Download your verified check-in history as JSON</span>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportData}
              leftIcon={<Download className="w-3.5 h-3.5" />}
            >
              {downloaded ? 'Exported!' : 'Export Data'}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}
