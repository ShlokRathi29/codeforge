import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import confetti from 'canvas-confetti'
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Lock,
  Calendar,
  Sparkles,
  CircleHelp,
  AlertCircle,
  Edit3,
  RotateCcw,
} from 'lucide-react'
import { Button } from '../ui/Button'
import { Mascot, PrivacyPill } from '../ui/Mascot'
import { submitDailyCheckin } from '../../api/client'
import type { NavSection } from '../../types'

export const checkInQuestions = [
  {
    title: 'How well did you sleep last night?',
    subtitle: 'Think about how rested you feel after your night of sleep.',
    options: ['😫 Very Poor', '😕 Poor', '😐 Okay', '🙂 Good', '😄 Very Good'],
  },
  {
    title: 'How would you rate your eating and meals today?',
    subtitle: 'Consider how your meals and eating felt throughout the day.',
    options: ['😫 Very Poor', '😕 Poor', '😐 Okay', '🙂 Good', '😄 Very Good'],
  },
  {
    title: 'How active were you today?',
    subtitle: 'Include movement, exercise, walking, or any physical activity.',
    options: ['🛋️ Not Active', '🚶 Slightly Active', '🚶‍♂️ Moderately Active', '🏃 Very Active', '💪 Extremely Active'],
  },
  {
    title: 'How connected did you feel with your friends, classmates, or people around you today?',
    subtitle: 'Think about the quality of your social interactions and support.',
    options: ['😔 Very Disconnected', '🙁 Somewhat Disconnected', '😐 Neutral', '🙂 Connected', '😄 Very Connected'],
  },
  {
    title: 'How manageable did your studies or academic workload feel today?',
    subtitle: 'Consider how difficult or manageable your schoolwork felt.',
    options: ['😣 Very Difficult', '😟 Difficult', '😐 Manageable', '🙂 Easy', '😄 Very Easy'],
  },
]

const PHASE_ICONS = ['◌', '◔', '◑', '◕', '●']

const QUESTION_SHORT_TITLES = [
  'Sleep Quality',
  'Eating & Meals',
  'Physical Activity',
  'Social Connection',
  'Academic Workload',
]

interface DailyCheckinViewProps {
  onCheckinSuccess: () => void
  onNavigate: (section: NavSection) => void
}

export const DailyCheckinView: React.FC<DailyCheckinViewProps> = ({
  onCheckinSuccess,
  onNavigate,
}) => {
  const today = new Date().toISOString().slice(0, 10)

  // Step state: 0..4 are the 5 questions, 5 is the final review & private reflection step
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<number[]>([])

  // Final reflection state
  const [date, setDate] = useState(today)
  const [privateNote, setPrivateNote] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const isReviewStep = step >= checkInQuestions.length
  const question = checkInQuestions[step]
  const progress = isReviewStep
    ? 100
    : ((step + (answers[step] !== undefined ? 1 : 0)) / checkInQuestions.length) * 100

  // Calculate derived stress for the preview and alert
  const totalPositive = answers.reduce((acc, curr) => acc + (curr ?? 2), 0)
  let derivedStress = Math.min(5, Math.max(1, Math.round(5 - totalPositive / 4.5)))
  if (answers[4] !== undefined && answers[4] <= 1) {
    derivedStress = Math.max(derivedStress, 4)
  }

  // Select an option for the current question
  const handleChooseOption = (index: number) => {
    const nextAnswers = [...answers]
    nextAnswers[step] = index
    setAnswers(nextAnswers)

    // Smooth transition to next step
    window.setTimeout(() => {
      setStep((curr) => curr + 1)
    }, 240)
  }

  // Handle final submission to backend
  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    setIsSubmitting(true)
    setErrorMsg(null)

    // 1. Sleep: 0..4 mapped to 1 (Poor), 2 (Okay), 3 (Good)
    const sleepQuality = (answers[0] ?? 2) <= 1 ? 1 : answers[0] === 2 ? 2 : 3

    // 2. Nutrition: 0..4 mapped to 1..5
    const nutrition = (answers[1] ?? 2) + 1

    // 3. Physical Activity: 0..4 mapped to 1..5
    const physicalActivity = (answers[2] ?? 2) + 1

    // 4. Social Connection: 0..4 mapped to 1..5
    const socialInteraction = (answers[3] ?? 2) + 1

    // 5. Academic Pressure: 0..4 (Very Difficult -> Very Easy) mapped to 5 down to 1
    const academicPressure = 5 - (answers[4] ?? 2)

    // Mood mapping from total positive score (0 to 20)
    const positiveScore =
      (answers[0] ?? 2) +
      (answers[1] ?? 2) +
      (answers[2] ?? 2) +
      (answers[3] ?? 2) +
      (answers[4] ?? 2)

    const chosenMood =
      positiveScore >= 16
        ? 'great'
        : positiveScore >= 12
        ? 'happy'
        : positiveScore >= 8
        ? 'neutral'
        : positiveScore >= 4
        ? 'sad'
        : 'very_low'

    try {
      await submitDailyCheckin({
        date,
        mood: chosenMood,
        stress_level: derivedStress,
        sleep_quality: sleepQuality,
        nutrition,
        physical_activity: physicalActivity,
        academic_pressure: academicPressure,
        social_interaction: socialInteraction,
        private_note: privateNote.trim() || undefined,
      })

      // Trigger celebratory confetti
      try {
        confetti({
          particleCount: 85,
          spread: 80,
          origin: { y: 0.6 },
        })
      } catch {
        // ignore
      }

      setSubmitted(true)
      onCheckinSuccess()
    } catch (err: any) {
      setErrorMsg(
        err.response?.data?.detail || 'Failed to submit check-in. Please try again.'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  // Restart flow
  const handleRestart = () => {
    setStep(0)
    setAnswers([])
    setPrivateNote('')
    setSubmitted(false)
    setErrorMsg(null)
  }

  // ================= 1. CELEBRATION / COMPLETED STATE =================
  if (submitted) {
    return (
      <div className="max-w-xl mx-auto py-12 px-4 text-center space-y-6 animate-in fade-in duration-300">
        <div className="h-56 w-64 mx-auto">
          <Mascot mode="happy" className="h-full" />
        </div>
        <div className="space-y-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Check-in Complete
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#111111] tracking-tight">
            You showed up for yourself.
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
            That small pause matters. Your answers are saved privately, and you can explore your
            week's trends anytime.
          </p>
        </div>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button
            variant="primary"
            onClick={() => onNavigate('insights')}
            rightIcon={<ArrowRight className="w-4 h-4 text-[#111111]" />}
          >
            See My Insights
          </Button>
          <Button variant="outline" onClick={() => onNavigate('dashboard')}>
            Back to Overview
          </Button>
          <button
            onClick={handleRestart}
            className="text-xs font-bold text-slate-500 hover:text-[#111111] transition flex items-center gap-1.5 py-2 px-3 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Redo Check-in</span>
          </button>
        </div>
      </div>
    )
  }

  // ================= 2. STEP-BY-STEP QUESTION OR REVIEW FLOW =================
  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
            <Sparkles className="w-3.5 h-3.5 text-[#111111]" />
            <span>Daily Check-in</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-[#111111] tracking-tight">
            A small moment for you.
          </h1>
        </div>
        <div className="hidden sm:block">
          <PrivacyPill />
        </div>
      </div>

      {/* Progress Bar */}
      <div className="h-2.5 overflow-hidden rounded-full bg-white border border-[#BFEAFF]/80">
        <motion.div
          className="h-full rounded-full bg-[#FFD84D]"
          animate={{ width: `${Math.max(progress, 8)}%` }}
          transition={{ duration: 0.35 }}
        />
      </div>

      {/* Question Counter & Status */}
      <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-500">
        <span>
          {isReviewStep
            ? 'Final Step: Reflection & Save'
            : `Question ${step + 1} of ${checkInQuestions.length}`}
        </span>
        <span>{Math.round(Math.max(progress, 8))}% complete</span>
      </div>

      {/* Error alert if any */}
      {errorMsg && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-700 text-xs flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Main Container: Split Layout (Mascot Left + Question/Review Card Right) */}
      <div className="grid items-center gap-8 lg:grid-cols-[0.85fr_1.15fr]">
        {/* Left Mascot Column */}
        <div className="hidden min-h-[420px] rounded-3xl bg-[#cdeeff] p-6 sm:flex flex-col items-center justify-center border border-[#BFEAFF] shadow-xs relative overflow-hidden">
          <div className="absolute top-4 left-4">
            <span className="text-[10px] font-bold uppercase tracking-wider bg-white/80 px-2.5 py-1 rounded-full text-slate-600 border border-[#BFEAFF]">
              Take your time
            </span>
          </div>
          <Mascot mode={isReviewStep ? 'welcome' : 'thinking'} className="h-64 w-full" />
          <p className="text-center text-xs font-semibold text-slate-700 mt-3 max-w-xs leading-relaxed">
            {isReviewStep
              ? 'Great job checking in. Everything you enter remains 100% confidential under Rule 07.'
              : 'A few honest seconds help you notice subtle patterns and protect your energy.'}
          </p>
        </div>

        {/* Right Dynamic Card: Interactive Questions or Final Review */}
        <AnimatePresence mode="wait">
          {!isReviewStep ? (
            /* ================= QUESTION CARDS (1 TO 5) ================= */
            <motion.section
              key={step}
              initial={{ opacity: 0, x: 18 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -18 }}
              transition={{ duration: 0.22 }}
              className="rounded-3xl border border-[#BFEAFF] bg-white p-6 sm:p-9 shadow-xs space-y-6"
            >
              {/* Question Header */}
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="mb-2 text-3xl font-mono text-[#111111]">
                    {PHASE_ICONS[step]}
                  </p>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-[#111111] leading-tight tracking-tight">
                    {question.title}
                  </h2>
                  <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {question.subtitle}
                  </p>
                </div>
                <CircleHelp className="mt-1 hidden size-5 text-slate-400 sm:block shrink-0" />
              </div>

              {/* Options List */}
              <div className="flex flex-col gap-3">
                {question.options.map((option, index) => {
                  const isSelected = answers[step] === index
                  return (
                    <button
                      key={option}
                      onClick={() => handleChooseOption(index)}
                      className={`group flex min-h-14 items-center justify-between rounded-2xl border px-4 text-left text-xs sm:text-sm font-bold transition duration-150 cursor-pointer ${
                        isSelected
                          ? 'border-[#111111] bg-[#FFD84D] text-[#111111] shadow-[0_4px_0_#111]'
                          : 'border-[#BFEAFF] bg-[#F8FCFF] text-[#111111] hover:border-[#111111] hover:bg-white hover:-translate-y-0.5 hover:shadow-[0_4px_0_#111]'
                      }`}
                    >
                      <span className="flex items-center gap-2">{option}</span>
                      <span
                        className={`flex size-7 items-center justify-center rounded-full border text-xs font-extrabold transition ${
                          isSelected
                            ? 'border-[#111111] bg-white text-[#111111]'
                            : 'border-[#BFEAFF] text-slate-500 group-hover:border-[#111111] group-hover:text-[#111111]'
                        }`}
                      >
                        {index + 1}
                      </span>
                    </button>
                  )
                })}
              </div>

              {/* Footer Controls */}
              <div className="flex items-center justify-between pt-4 border-t border-[#DFF4FF]">
                {step > 0 ? (
                  <button
                    onClick={() => setStep((curr) => curr - 1)}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-[#111111] cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Previous Question</span>
                  </button>
                ) : (
                  <span className="text-[11px] text-slate-400">Question 1 of 5</span>
                )}

                {answers[step] !== undefined && (
                  <button
                    onClick={() => setStep((curr) => curr + 1)}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#111111] hover:underline cursor-pointer"
                  >
                    <span>Next</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <p className="text-center text-[11px] font-medium text-slate-400">
                Choose the answer that feels closest. You can change it anytime before saving.
              </p>
            </motion.section>
          ) : (
            /* ================= FINAL STEP: REVIEW & REFLECTION NOTE ================= */
            <motion.section
              key="review"
              initial={{ opacity: 0, x: 18 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -18 }}
              transition={{ duration: 0.22 }}
              className="rounded-3xl border border-[#BFEAFF] bg-white p-6 sm:p-8 shadow-xs space-y-5"
            >
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold uppercase mb-2">
                  <Check className="w-3 h-3" />
                  <span>All 5 Questions Answered</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-[#111111] tracking-tight">
                  Review & Personal Reflection
                </h2>
                <p className="text-xs text-slate-600 mt-1">
                  Here is a snapshot of your check-in across 5 holistic wellbeing dimensions.
                </p>
              </div>

              {/* 5 Answers Summary Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {checkInQuestions.map((q, idx) => {
                  const answerIdx = answers[idx]
                  const answerLabel =
                    answerIdx !== undefined ? q.options[answerIdx] : 'Not answered'
                  return (
                    <div
                      key={idx}
                      className="p-3 rounded-xl border border-[#BFEAFF] bg-[#F8FCFF] flex items-center justify-between text-xs"
                    >
                      <div className="space-y-0.5 pr-2">
                        <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">
                          {QUESTION_SHORT_TITLES[idx]}
                        </p>
                        <p className="font-extrabold text-[#111111]">{answerLabel}</p>
                      </div>
                      <button
                        onClick={() => setStep(idx)}
                        className="p-1.5 rounded-lg hover:bg-[#DFF4FF] text-slate-500 hover:text-[#111111] transition cursor-pointer"
                        title="Edit answer"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )
                })}
              </div>

              {/* Elevated Stress Alert Banner if derived stress is >= 4 */}
              {derivedStress >= 4 && (
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <p className="leading-relaxed">
                    <strong>Support Notice:</strong> Reporting elevated stress (≥ 4 for 3 consecutive
                    days) quietly alerts campus counseling so you receive proactive support before
                    burnout. Your journal reflection below is 100% private.
                  </p>
                </div>
              )}

              {/* Date Picker */}
              <div className="flex items-center justify-between p-3 rounded-xl border border-[#BFEAFF] bg-[#F8FCFF]">
                <div className="flex items-center gap-2 text-xs font-bold text-[#111111]">
                  <Calendar className="w-3.5 h-3.5 text-[#111111]" />
                  <span>Check-in Date</span>
                </div>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  max={today}
                  className="bg-white border border-[#BFEAFF] rounded-lg px-2.5 py-1 text-xs text-[#111111] focus:outline-none focus:border-[#FFD84D]"
                />
              </div>

              {/* Confidential Private Note */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-[#111111] flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Optional Private Reflection</span>
                  </label>
                  <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-100 border border-emerald-200 px-2 py-0.5 rounded-full">
                    Rule 07 Isolation
                  </span>
                </div>
                <textarea
                  rows={3}
                  value={privateNote}
                  onChange={(e) => setPrivateNote(e.target.value)}
                  placeholder="Capture how today felt, or leave blank. Notes are cryptographically isolated and never sent to counselors."
                  className="w-full bg-[#F8FCFF] border border-[#BFEAFF] rounded-xl p-3 text-xs text-[#111111] placeholder:text-slate-400 focus:outline-none focus:border-[#FFD84D] transition"
                />
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-3 border-t border-[#DFF4FF]">
                <button
                  type="button"
                  onClick={() => setStep(checkInQuestions.length - 1)}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-[#111111] cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Questions</span>
                </button>

                <Button
                  type="button"
                  variant="primary"
                  size="md"
                  isLoading={isSubmitting}
                  onClick={() => handleSubmit()}
                  leftIcon={<Check className="w-4 h-4 text-[#111111]" />}
                >
                  Save Daily Check-in
                </Button>
              </div>
            </motion.section>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default DailyCheckinView
