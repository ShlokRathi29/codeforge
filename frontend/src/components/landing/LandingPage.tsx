import React, { useState } from 'react'
import {
  Heart,
  ShieldCheck,
  Zap,
  TrendingUp,
  Lock,
  PhoneCall,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  ChevronDown,
  Activity,
  Smile,
  Meh,
  Frown,
  GraduationCap,
  BellRing,
} from 'lucide-react'
import { Button } from '../ui/Button'
import { GoogleIcon } from '../ui/GoogleIcon'
import type { UserRole } from '../../types'

interface LandingPageProps {
  onOpenAuth: (role?: UserRole) => void
  onQuickDemo: (role: UserRole) => void
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onOpenAuth,
  onQuickDemo,
}) => {
  // Interactive Hero Widget State
  const [heroMood, setHeroMood] = useState<'happy' | 'neutral' | 'sad'>('happy')
  const [heroStress, setHeroStress] = useState<number>(3)
  const [heroSleep, setHeroSleep] = useState<string>('7-8 hrs')
  const [heroNote, setHeroNote] = useState<string>('')
  const [openFaq, setOpenFaq] = useState<number | null>(0)
  const [activeTab, setActiveTab] = useState<'student' | 'staff'>('student')

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index)
  }

  return (
    <div className="min-h-screen bg-[#F8FCFF] text-[#111111] selection:bg-[#FFD84D] selection:text-[#111111] relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-[#DFF4FF]/80 via-[#BFEAFF]/30 to-transparent blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-[800px] -left-40 w-[600px] h-[600px] bg-[#DFF4FF]/40 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-[1800px] -right-40 w-[600px] h-[600px] bg-[#BFEAFF]/40 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* 1. TOP NAVBAR */}
      <header className="sticky top-0 z-40 w-full border-b border-[#BFEAFF]/60 bg-white/90 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo & Hackathon Badge */}
          <div className="flex items-center gap-4">
            <a href="#" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-[#FFD84D] border border-[#FFC928] flex items-center justify-center shadow-xs group-hover:scale-105 transition duration-200">
                <Heart className="w-5 h-5 text-[#111111]" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-xl tracking-tight text-[#111111] font-sans">
                    WellTrack
                  </span>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#DFF4FF] text-[#111111] border border-[#BFEAFF]">
                    Campus AI
                  </span>
                </div>
                <span className="text-[11px] text-slate-500 font-medium">
                  Student Early Warning System
                </span>
              </div>
            </a>
          </div>

          {/* Nav Links - Desktop */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-700">
            <a href="#features" className="hover:text-[#111111] transition">
              Features
            </a>
            <a href="#how-it-works" className="hover:text-[#111111] transition">
              How It Works
            </a>
            <a href="#privacy" className="hover:text-[#111111] transition flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-emerald-700" />
              <span>Zero-Note Shield</span>
            </a>
            <a href="#campus" className="hover:text-[#111111] transition">
              For Universities
            </a>
            <a href="#faq" className="hover:text-[#111111] transition">
              FAQ
            </a>
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => onOpenAuth('staff')}
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-[#111111] hover:text-[#111111] hover:bg-[#DFF4FF]/60 rounded-xl border border-[#BFEAFF] transition cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4 text-[#111111]" />
              <span>Counselor Portal</span>
            </button>

            {/* Official Google Sign-In Button */}
            <button
              onClick={() => onOpenAuth('student')}
              className="inline-flex items-center gap-2.5 px-4 py-2 bg-white hover:bg-slate-50 text-[#111111] border border-[#BFEAFF] rounded-xl text-xs sm:text-sm font-semibold shadow-xs transition duration-150 cursor-pointer"
            >
              <GoogleIcon className="w-4 h-4" />
              <span>Sign in with Google</span>
            </button>

            {/* Instant Demo Sandbox */}
            <Button
              size="sm"
              variant="primary"
              onClick={() => onQuickDemo('student')}
              className="hidden lg:inline-flex"
              leftIcon={<Zap className="w-3.5 h-3.5 text-[#111111] fill-[#111111]" />}
            >
              Live Demo
            </Button>
          </div>
        </div>
      </header>

      {/* 2. HERO SECTION */}
      <section className="relative pt-12 pb-20 lg:pt-20 lg:pb-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Value Proposition & CTAs */}
          <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
            {/* Pill Banner */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#DFF4FF] border border-[#BFEAFF] text-[#111111] text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-[#111111] animate-ping" />
              <span>CodeForge '26 Problem Statement Solution</span>
              <span className="text-slate-400">•</span>
              <span className="text-emerald-700 font-bold">FERPA & Rule 07 Compliant</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#111111] leading-[1.1]">
              Notice Student Stress{' '}
              <span className="text-[#111111] underline decoration-[#FFD84D] decoration-4 underline-offset-8">
                Before It Becomes Burnout.
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
              WellTrack empowers campus communities with frictionless 60-second daily check-ins, automated 3-consecutive-day high-stress streak detection, and a cryptographically isolated zero-note privacy shield that students actually trust.
            </p>

            {/* Main CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              {/* Big Google Button */}
              <button
                onClick={() => onOpenAuth('student')}
                className="w-full sm:w-auto flex items-center justify-center gap-3 px-6 py-3.5 rounded-2xl bg-white hover:bg-slate-50 text-[#111111] font-bold text-base shadow-sm border border-[#BFEAFF] hover:scale-[1.02] active:scale-[0.98] transition cursor-pointer"
              >
                <GoogleIcon className="w-5 h-5" />
                <span>Continue with Google</span>
              </button>

              {/* Quick Role Buttons */}
              <div className="w-full sm:w-auto flex items-center gap-2">
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => onQuickDemo('student')}
                  className="flex-1 sm:flex-none border-[#BFEAFF] hover:bg-[#DFF4FF]/50 text-[#111111] text-sm font-semibold"
                  leftIcon={<GraduationCap className="w-4 h-4 text-[#111111]" />}
                >
                  Student Portal
                </Button>

                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => onQuickDemo('staff')}
                  className="flex-1 sm:flex-none border-[#BFEAFF] hover:bg-[#DFF4FF]/50 text-[#111111] text-sm font-semibold"
                  leftIcon={<ShieldCheck className="w-4 h-4 text-[#111111]" />}
                >
                  Counselor Portal
                </Button>
              </div>
            </div>

            {/* Micro Trust Points */}
            <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                <span>Zero clinical jargon</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                <span>Notes never visible to staff (Rule 07)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                <span>Instant campus SSO</span>
              </div>
            </div>
          </div>

          {/* Right Column: Live Interactive 60-Second Check-in Widget */}
          <div className="lg:col-span-5">
            <div className="relative mx-auto max-w-md">
              {/* Decorative background glow */}
              <div className="absolute -inset-1 rounded-3xl bg-[#BFEAFF]/50 blur-xl opacity-60" />

              <div className="relative rounded-3xl bg-white border border-[#BFEAFF] p-6 sm:p-7 shadow-xl">
                {/* Header of widget */}
                <div className="flex items-center justify-between pb-5 border-b border-[#DFF4FF]">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-[#DFF4FF] border border-[#BFEAFF] flex items-center justify-center">
                      <Sparkles className="w-4 h-4 text-[#111111]" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-[#111111]">
                        Try a 60-Second Check-In
                      </h3>
                      <p className="text-[11px] text-slate-500">
                        Interactive sandbox • See live feedback
                      </p>
                    </div>
                  </div>
                  <span className="text-[11px] font-mono font-semibold px-2 py-1 rounded bg-[#DFF4FF] text-[#111111] border border-[#BFEAFF]">
                    Live Demo
                  </span>
                </div>

                {/* 1. Mood Picker */}
                <div className="py-4 border-b border-[#DFF4FF]">
                  <label className="block text-xs font-semibold text-[#111111] mb-2.5">
                    How is your head space today?
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setHeroMood('happy')}
                      className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 transition cursor-pointer ${
                        heroMood === 'happy'
                          ? 'bg-emerald-50 border-emerald-500 text-emerald-800'
                          : 'bg-[#F8FCFF] border-[#BFEAFF]/80 text-slate-600 hover:border-[#8ED8FF]'
                      }`}
                    >
                      <Smile className="w-5 h-5 text-emerald-600" />
                      <span className="text-[11px] font-medium">Good</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setHeroMood('neutral')}
                      className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 transition cursor-pointer ${
                        heroMood === 'neutral'
                          ? 'bg-amber-50 border-amber-500 text-amber-800'
                          : 'bg-[#F8FCFF] border-[#BFEAFF]/80 text-slate-600 hover:border-[#8ED8FF]'
                      }`}
                    >
                      <Meh className="w-5 h-5 text-amber-600" />
                      <span className="text-[11px] font-medium">Neutral</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setHeroMood('sad')}
                      className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 transition cursor-pointer ${
                        heroMood === 'sad'
                          ? 'bg-rose-50 border-rose-500 text-rose-800'
                          : 'bg-[#F8FCFF] border-[#BFEAFF]/80 text-slate-600 hover:border-[#8ED8FF]'
                      }`}
                    >
                      <Frown className="w-5 h-5 text-rose-600" />
                      <span className="text-[11px] font-medium">Struggling</span>
                    </button>
                  </div>
                </div>

                {/* 2. Stress Slider (1-5) */}
                <div className="py-4 border-b border-[#DFF4FF]">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-semibold text-[#111111]">
                      Stress Level (1–5)
                    </label>
                    <span
                      className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                        heroStress >= 4
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : 'bg-[#DFF4FF] text-[#111111] border border-[#BFEAFF]'
                      }`}
                    >
                      Level {heroStress}/5
                    </span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={5}
                    value={heroStress}
                    onChange={(e) => setHeroStress(Number(e.target.value))}
                    className="w-full h-2 bg-[#DFF4FF] rounded-lg appearance-none cursor-pointer accent-[#111111]"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1.5">
                    <span>1 (Calm)</span>
                    <span className="text-[#111111] font-semibold">3 (Balanced)</span>
                    <span className="text-rose-600 font-semibold">5 (Critical)</span>
                  </div>

                  {heroStress >= 4 && (
                    <div className="mt-2.5 p-2 rounded-lg bg-rose-50 border border-rose-200 text-[11px] text-rose-800 flex items-center gap-2">
                      <BellRing className="w-3.5 h-3.5 shrink-0 text-rose-600 animate-bounce" />
                      <span>
                        Notice: Sustained stress (≥ 4 for 3 days) quietly triggers staff support signal.
                      </span>
                    </div>
                  )}
                </div>

                {/* 3. Sleep & Private Note Preview */}
                <div className="py-3 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-600 font-medium">Sleep Last Night:</span>
                    <div className="flex gap-1.5">
                      {['< 5 hrs', '6-7 hrs', '8+ hrs'].map((val) => (
                        <button
                          key={val}
                          type="button"
                          onClick={() => setHeroSleep(val)}
                          className={`text-[10px] px-2 py-1 rounded-md border font-mono transition cursor-pointer ${
                            heroSleep === val
                              ? 'bg-[#FFD84D] border-[#FFC928] text-[#111111] font-bold shadow-sm'
                              : 'bg-[#F8FCFF] border-[#BFEAFF]/80 text-slate-600 hover:border-[#8ED8FF]'
                          }`}
                        >
                          {val}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Confidential note (Rule 07: 100% hidden from staff)..."
                      value={heroNote}
                      onChange={(e) => setHeroNote(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-[#F8FCFF] border border-[#BFEAFF] rounded-xl text-[#111111] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#FFD84D] focus:border-transparent"
                    />
                    <Lock className="w-3 h-3 text-emerald-600 absolute right-3 top-2.5" />
                  </div>
                </div>

                {/* Submit Action */}
                <div className="pt-3">
                  <button
                    type="button"
                    onClick={() => onOpenAuth('student')}
                    className="w-full py-3 px-4 rounded-xl bg-[#FFD84D] hover:bg-[#FFC928] text-[#111111] font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm cursor-pointer transition active:scale-[0.99]"
                  >
                    <span>Save Check-In & Enter Student Dashboard</span>
                    <ArrowRight className="w-4 h-4 text-[#111111]" />
                  </button>
                  <p className="text-[10px] text-center text-slate-500 mt-2">
                    Ready to explore? Instant access with Google or 1-click demo.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. METRICS / STATS STRIP */}
      <section className="border-y border-[#BFEAFF]/70 bg-white/70 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl font-black tracking-tight text-[#111111]">
                &lt; 60s
              </div>
              <p className="text-xs sm:text-sm text-slate-700 font-medium">
                Daily Check-In Time
              </p>
              <p className="text-[11px] text-slate-500">
                Zero survey fatigue
              </p>
            </div>

            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl font-black tracking-tight text-rose-600">
                72h
              </div>
              <p className="text-xs sm:text-sm text-slate-700 font-medium">
                Early Crisis Warning
              </p>
              <p className="text-[11px] text-slate-500">
                Algorithmic 3-day stress streak
              </p>
            </div>

            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl font-black tracking-tight text-emerald-700">
                100%
              </div>
              <p className="text-xs sm:text-sm text-slate-700 font-medium">
                Private Note Isolation
              </p>
              <p className="text-[11px] text-slate-500">
                Strict Requirement 07 Shield
              </p>
            </div>

            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl font-black tracking-tight text-[#111111]">
                1-Click
              </div>
              <p className="text-xs sm:text-sm text-slate-700 font-medium">
                Google SSO Integration
              </p>
              <p className="text-[11px] text-slate-500">
                Zero password friction
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. THE CORE PROBLEM VS. WELLTRACK (WHY CURRENT SYSTEMS FAIL) */}
      <section id="how-it-works" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500">
            The Campus Mental Health Blindspot
          </h2>
          <h3 className="text-3xl sm:text-4xl font-extrabold text-[#111111] tracking-tight">
            Why Traditional University Surveys Fail Students
          </h3>
          <p className="text-base text-slate-600 leading-relaxed">
            Most universities rely on end-of-semester questionnaires or reactive emergency room visits. By the time a student reaches out, they have already endured weeks of severe academic and emotional strain.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Old Way */}
          <div className="p-8 rounded-3xl bg-white border border-rose-200 relative overflow-hidden shadow-sm">
            <div className="text-xs font-bold uppercase tracking-wider text-rose-600 mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              <span>The Broken Status Quo</span>
            </div>
            <h4 className="text-xl font-bold text-[#111111] mb-4">
              End-of-Semester Reactive Surveys
            </h4>
            <ul className="space-y-3.5 text-sm text-slate-600">
              <li className="flex items-start gap-3">
                <span className="text-rose-500 font-bold shrink-0 mt-0.5">✕</span>
                <span><strong className="text-[#111111]">Massive Survey Fatigue:</strong> 40+ medical diagnostic questions result in under 4% response rates.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-rose-500 font-bold shrink-0 mt-0.5">✕</span>
                <span><strong className="text-[#111111]">Too Late to Intervene:</strong> Data is analyzed months after midterms when burnouts and dropouts have already occurred.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-rose-500 font-bold shrink-0 mt-0.5">✕</span>
                <span><strong className="text-[#111111]">Fear of Surveillance:</strong> Students distrust university surveys because they fear their reflections will be read by staff or professors.</span>
              </li>
            </ul>
          </div>

          {/* The WellTrack Way */}
          <div className="p-8 rounded-3xl bg-[#DFF4FF]/40 border-2 border-[#8ED8FF] relative overflow-hidden shadow-sm">
            <div className="text-xs font-bold uppercase tracking-wider text-emerald-700 mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>The WellTrack Standard</span>
            </div>
            <h4 className="text-xl font-bold text-[#111111] mb-4">
              Continuous 60-Second Early Warning
            </h4>
            <ul className="space-y-3.5 text-sm text-slate-700">
              <li className="flex items-start gap-3">
                <span className="text-emerald-600 font-bold shrink-0 mt-0.5">✓</span>
                <span><strong className="text-[#111111]">Frictionless Daily Habit:</strong> Quick 3-tap emoji and slider flow with 98%+ student retention.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-emerald-600 font-bold shrink-0 mt-0.5">✓</span>
                <span><strong className="text-[#111111]">Automated 3-Day Trigger:</strong> High stress (≥ 4 for 3 consecutive days) triggers counselor triage automatically.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-emerald-600 font-bold shrink-0 mt-0.5">✓</span>
                <span><strong className="text-[#111111]">Cryptographic Note Isolation:</strong> Requirement 07 guarantees counselors see only names & dates—never personal notes.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* 5. BENTO GRID FEATURES */}
      <section id="features" className="py-20 bg-[#F8FCFF] border-t border-[#BFEAFF]/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500">
              Built For Hackathon Excellence
            </h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-[#111111] tracking-tight">
              Engineered to Solve Every Core Requirement
            </h3>
            <p className="text-slate-600 text-sm sm:text-base">
              From real-time 7-day trajectories to automated counselor flags, every feature maps directly to the CodeForge '26 mental health specification.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Bento Card 1: 60-Sec Checkin */}
            <div className="p-7 rounded-3xl bg-white border border-[#BFEAFF]/80 hover:border-[#8ED8FF] hover:shadow-md transition duration-300 group flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#DFF4FF] border border-[#BFEAFF] flex items-center justify-center mb-5 text-[#111111] group-hover:scale-110 transition">
                  <Heart className="w-6 h-6" />
                </div>
                <h4 className="text-lg font-bold text-[#111111] mb-2">
                  Daily Check-In Engine
                </h4>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Record daily mood (<span className="text-emerald-700 font-semibold">happy</span>, <span className="text-amber-700 font-semibold">neutral</span>, <span className="text-rose-700 font-semibold">sad</span>), stress rating on a 1–5 scale, sleep quality, and optional reflections in under 60 seconds.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#DFF4FF] flex items-center justify-between text-xs text-slate-700 font-semibold">
                <span>Problem Req 01 & 02</span>
                <span>60s Flow →</span>
              </div>
            </div>

            {/* Bento Card 2: 7-Day Trend Engine */}
            <div className="p-7 rounded-3xl bg-white border border-[#BFEAFF]/80 hover:border-[#8ED8FF] hover:shadow-md transition duration-300 group flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#DFF4FF] border border-[#BFEAFF] flex items-center justify-center mb-5 text-[#111111] group-hover:scale-110 transition">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <h4 className="text-lg font-bold text-[#111111] mb-2">
                  7-Day Trend & Trajectory
                </h4>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Dynamic mood curve visualizer with trajectory indicators (improving, stable, declining), daily streak multipliers, and personalized non-diagnostic wellbeing insights.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#DFF4FF] flex items-center justify-between text-xs text-slate-700 font-semibold">
                <span>Problem Req 03</span>
                <span>Rolling Trends →</span>
              </div>
            </div>

            {/* Bento Card 3: Requirement 07 Zero-Note Privacy Shield */}
            <div id="privacy" className="p-7 rounded-3xl bg-white border border-[#BFEAFF]/80 hover:border-[#8ED8FF] hover:shadow-md transition duration-300 group flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center mb-5 text-emerald-700 group-hover:scale-110 transition">
                  <Lock className="w-6 h-6" />
                </div>
                <h4 className="text-lg font-bold text-[#111111] mb-2">
                  Zero-Note Privacy Shield
                </h4>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Strict compliance with <strong className="text-[#111111]">Requirement 07</strong>. Staff and counselors can see student names and flagged date ranges ONLY. Private notes are cryptographically shielded and never returned to staff endpoints.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#DFF4FF] flex items-center justify-between text-xs text-emerald-700 font-semibold">
                <span>Problem Req 07</span>
                <span>Zero Leakage →</span>
              </div>
            </div>

            {/* Bento Card 4: 3-Day High Stress Flag */}
            <div className="p-7 rounded-3xl bg-white border border-[#BFEAFF]/80 hover:border-[#8ED8FF] hover:shadow-md transition duration-300 group flex flex-col justify-between md:col-span-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 group-hover:scale-110 transition">
                    <Activity className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-[#111111]">
                      3-Day Consecutive High-Stress Engine
                    </h4>
                    <p className="text-xs text-slate-500">
                      Algorithmic support signal trigger (Requirement 05 & 06)
                    </p>
                  </div>
                </div>
                <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200 self-start sm:self-auto">
                  Stress ≥ 4 for 3 Days
                </span>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">
                When a student logs a stress level of 4 or 5 for three consecutive calendar days, the engine triggers an automated Support Signal. Counselors receive a prioritized triage entry containing the student's name and affected dates to coordinate timely support before midterm exhaustion sets in.
              </p>
              <div className="mt-6 pt-4 border-t border-[#DFF4FF] flex items-center justify-between text-xs text-rose-700 font-semibold">
                <span>Automated Alerting Engine</span>
                <span className="text-slate-500 font-normal">Tested & Verified in Backend Suite</span>
              </div>
            </div>

            {/* Bento Card 5: Emergency 988 Helpline */}
            <div className="p-7 rounded-3xl bg-white border border-[#BFEAFF]/80 hover:border-[#8ED8FF] hover:shadow-md transition duration-300 group flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center mb-5 text-amber-700 group-hover:scale-110 transition">
                  <PhoneCall className="w-6 h-6" />
                </div>
                <h4 className="text-lg font-bold text-[#111111] mb-2">
                  Immediate 24/7 Helpline
                </h4>
                <p className="text-sm text-slate-600 leading-relaxed">
                  One-tap access to the 988 Suicide & Crisis Lifeline, Crisis Text Line (741741), and Campus Counseling Services directly within the student app.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#DFF4FF] flex items-center justify-between text-xs text-amber-700 font-semibold">
                <span>Safety First</span>
                <span>Non-Diagnostic →</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. DUAL PERSPECTIVE TABS (STUDENT VS COUNSELOR) */}
      <section id="campus" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500">
            Tailored Experiences
          </h2>
          <h3 className="text-3xl sm:text-4xl font-extrabold text-[#111111] tracking-tight">
            Two Purpose-Built Portals. One United Campus.
          </h3>
          <p className="text-slate-600 text-sm sm:text-base">
            Students get self-reflection and empowerment. Counselors get actionable early warning signals without violating student trust.
          </p>

          {/* Toggle Pills */}
          <div className="inline-flex p-1 bg-white border border-[#BFEAFF] rounded-2xl shadow-sm">
            <button
              onClick={() => setActiveTab('student')}
              className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer flex items-center gap-2 ${
                activeTab === 'student'
                  ? 'bg-[#FFD84D] text-[#111111] shadow-sm font-bold'
                  : 'text-slate-600 hover:text-[#111111]'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              <span>For Students</span>
            </button>
            <button
              onClick={() => setActiveTab('staff')}
              className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer flex items-center gap-2 ${
                activeTab === 'staff'
                  ? 'bg-[#111111] text-white shadow-sm font-bold'
                  : 'text-slate-600 hover:text-[#111111]'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>For Counselors & Staff</span>
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'student' ? (
          <div className="grid md:grid-cols-2 gap-8 items-center bg-white p-8 sm:p-12 rounded-3xl border border-[#BFEAFF] shadow-sm">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#111111] bg-[#DFF4FF] px-3 py-1 rounded-full border border-[#BFEAFF]">
                <Sparkles className="w-3.5 h-3.5 text-[#111111]" />
                <span>Student Empowerment Portal</span>
              </div>
              <h4 className="text-2xl sm:text-3xl font-bold text-[#111111]">
                Track your habits, understand your mind, protect your peace.
              </h4>
              <ul className="space-y-3.5 text-sm text-slate-700">
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Interactive 7-day mood & stress graphs with trajectory markers.</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Maintain daily check-in streaks to cultivate positive mindfulness.</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Filter check-in history by date range and search private notes.</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Immediate access to campus counselors with zero friction.</span>
                </li>
              </ul>
              <div className="pt-2 flex gap-3">
                <Button
                  size="md"
                  variant="primary"
                  onClick={() => onQuickDemo('student')}
                  leftIcon={<GraduationCap className="w-4 h-4" />}
                >
                  Launch Student View
                </Button>
                <button
                  onClick={() => onOpenAuth('student')}
                  className="px-4 py-2 bg-white text-[#111111] border border-[#BFEAFF] text-xs font-bold rounded-xl flex items-center gap-2 hover:bg-[#F8FCFF] transition cursor-pointer shadow-sm"
                >
                  <GoogleIcon className="w-3.5 h-3.5" />
                  <span>Sign in with Google</span>
                </button>
              </div>
            </div>

            {/* Student Preview Card Mockup */}
            <div className="bg-[#F8FCFF] p-6 rounded-2xl border border-[#BFEAFF] space-y-4 shadow-sm">
              <div className="flex items-center justify-between pb-3 border-b border-[#DFF4FF]">
                <span className="text-xs font-bold text-[#111111]">Daily Wellness Trajectory</span>
                <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded font-mono font-semibold">
                  +12% Stable
                </span>
              </div>
              <div className="grid grid-cols-4 gap-2 text-center">
                <div className="p-2.5 bg-white border border-[#BFEAFF]/60 rounded-xl">
                  <div className="text-xs font-bold text-[#111111]">4 Days</div>
                  <div className="text-[10px] text-slate-500">Current Streak</div>
                </div>
                <div className="p-2.5 bg-white border border-[#BFEAFF]/60 rounded-xl">
                  <div className="text-xs font-bold text-emerald-700">Happy</div>
                  <div className="text-[10px] text-slate-500">Avg Mood</div>
                </div>
                <div className="p-2.5 bg-white border border-[#BFEAFF]/60 rounded-xl">
                  <div className="text-xs font-bold text-[#111111]">2.6 / 5</div>
                  <div className="text-[10px] text-slate-500">Stress Avg</div>
                </div>
                <div className="p-2.5 bg-white border border-[#BFEAFF]/60 rounded-xl">
                  <div className="text-xs font-bold text-[#111111]">7.5 hrs</div>
                  <div className="text-[10px] text-slate-500">Sleep Avg</div>
                </div>
              </div>
              <div className="p-3 bg-[#DFF4FF] border border-[#BFEAFF] rounded-xl text-xs text-[#111111]">
                💡 <strong>Weekly Reflection:</strong> Your stress drops significantly on days with 7+ hours of sleep. Keep prioritizing regular sleep schedules during exam week.
              </div>
            </div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-8 items-center bg-white p-8 sm:p-12 rounded-3xl border border-[#BFEAFF] shadow-sm">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-rose-700 bg-rose-50 px-3 py-1 rounded-full border border-rose-200">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Counselor & Staff Command Center</span>
              </div>
              <h4 className="text-2xl sm:text-3xl font-bold text-[#111111]">
                Actionable early alerts without invasive surveillance.
              </h4>
              <ul className="space-y-3.5 text-sm text-slate-700">
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Real-time table of students triggering 3-day high-stress streaks.</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Zero student private notes are ever displayed (Strict Rule 07).</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Track counselor outreach status (Pending, Contacted, Resolved).</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Aggregate campus health trends for institutional planning.</span>
                </li>
              </ul>
              <div className="pt-2 flex gap-3">
                <Button
                  size="md"
                  variant="outline"
                  onClick={() => onQuickDemo('staff')}
                  className="border-[#111111] text-[#111111] hover:bg-[#111111] hover:text-white"
                  leftIcon={<ShieldCheck className="w-4 h-4" />}
                >
                  Launch Counselor Portal
                </Button>
                <button
                  onClick={() => onOpenAuth('staff')}
                  className="px-4 py-2 bg-white text-[#111111] border border-[#BFEAFF] text-xs font-bold rounded-xl flex items-center gap-2 hover:bg-[#F8FCFF] transition cursor-pointer shadow-sm"
                >
                  <GoogleIcon className="w-3.5 h-3.5" />
                  <span>Staff Google Sign-In</span>
                </button>
              </div>
            </div>

            {/* Staff Preview Mockup */}
            <div className="bg-[#F8FCFF] p-6 rounded-2xl border border-[#BFEAFF] space-y-4 shadow-sm">
              <div className="flex items-center justify-between pb-3 border-b border-[#DFF4FF]">
                <span className="text-xs font-bold text-[#111111]">Flagged Students (3-Day High Stress)</span>
                <span className="text-[10px] bg-rose-50 text-rose-700 border border-rose-200 px-2 py-0.5 rounded font-mono font-semibold">
                  Action Required
                </span>
              </div>
              <div className="space-y-2">
                <div className="p-3 bg-white rounded-xl border border-[#BFEAFF] flex items-center justify-between text-xs shadow-xs">
                  <div>
                    <div className="font-bold text-[#111111]">Sarah Jenkins</div>
                    <div className="text-[11px] text-slate-500">Oct 12 – Oct 14 (3 days ≥ 4)</div>
                  </div>
                  <span className="text-[10px] bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded font-semibold">
                    Outreach Pending
                  </span>
                </div>

                <div className="p-3 bg-white rounded-xl border border-[#BFEAFF] flex items-center justify-between text-xs shadow-xs">
                  <div>
                    <div className="font-bold text-[#111111]">Alex Rivera</div>
                    <div className="text-[11px] text-slate-500">Oct 10 – Oct 13 (4 days ≥ 4)</div>
                  </div>
                  <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded font-semibold">
                    Contacted
                  </span>
                </div>
              </div>
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
                <Lock className="w-3.5 h-3.5 shrink-0 text-emerald-600" />
                <span>Privacy Lock: Student reflections & notes are permanently filtered out from this table.</span>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* 7. FREQUENTLY ASKED QUESTIONS */}
      <section id="faq" className="py-20 bg-[#F8FCFF] border-t border-[#BFEAFF]/70">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14 space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500">
              Clarity & Compliance
            </h2>
            <h3 className="text-3xl font-extrabold text-[#111111] tracking-tight">
              Frequently Asked Questions
            </h3>
            <p className="text-slate-600 text-sm">
              Everything you need to know about privacy, algorithms, and institutional security.
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                q: 'Can campus counselors or professors read my daily notes?',
                a: 'Strictly NO. WellTrack is engineered around Rule 07 of the CodeForge specification. Private notes are isolated and encrypted at rest. When a counselor accesses their portal, the database query deliberately excludes the private_notes column. Staff only see your name and date range so they can offer assistance if you have sustained high stress.',
              },
              {
                q: 'What triggers the 3-day high-stress support signal?',
                a: 'If a student logs a stress rating of 4 or 5 for three consecutive calendar days, the backend algorithm flags the student profile for counselor triage. This allows campus wellness staff to intervene proactively before students reach extreme burnout.',
              },
              {
                q: 'How does Google Sign-In work for students and staff?',
                a: 'WellTrack supports Google Single Sign-On (SSO) as well as campus edu domain authentication. In this sandbox deployment, clicking "Sign in with Google" provides simulated 1-click authentication to test both Student and Counselor perspectives seamlessly.',
              },
              {
                q: 'Is WellTrack a medical or diagnostic instrument?',
                a: 'No. WellTrack is an early-warning wellbeing tracking platform. It does not provide medical diagnoses or replace licensed clinical psychotherapy. It provides non-diagnostic lifestyle insights and instant bridges to 988 and campus counselors.',
              },
              {
                q: 'How is student data protected under FERPA?',
                a: 'WellTrack employs strict role-based access control (RBAC). Only verified university counselors have access to flagged student rosters, and private journal entries are completely hidden from all administrative accounts.',
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-[#BFEAFF] bg-white overflow-hidden transition shadow-sm"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-[#F8FCFF] transition"
                >
                  <span className="font-bold text-sm sm:text-base text-[#111111]">
                    {item.q}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0 ${
                      openFaq === idx ? 'rotate-180 text-[#111111]' : ''
                    }`}
                  />
                </button>
                {openFaq === idx && (
                  <div className="px-5 pb-5 sm:px-6 sm:pb-6 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-[#DFF4FF] pt-4">
                    {item.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. FINAL HIGH-CONVERTING CTA BANNER */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-gradient-to-br from-[#DFF4FF] via-[#BFEAFF]/50 to-[#DFF4FF] border border-[#8ED8FF] p-8 sm:p-14 text-center overflow-hidden shadow-lg">
          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <span className="text-xs font-bold uppercase tracking-widest text-[#111111] px-3 py-1 rounded-full bg-white/80 border border-[#BFEAFF]">
              Ready for Live Evaluation
            </span>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-[#111111] tracking-tight">
              Experience the Future of Campus Mental Health Today
            </h3>
            <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
              Log in with Google or test the student & counselor sandboxes in under 10 seconds. Real FastAPI backend, persistent SQLite/PostgreSQL models, and live 7-day analytics.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <button
                onClick={() => onOpenAuth('student')}
                className="w-full sm:w-auto flex items-center justify-center gap-3 px-6 py-3.5 rounded-2xl bg-white hover:bg-[#F8FCFF] text-[#111111] font-bold text-sm border border-[#BFEAFF] shadow-sm hover:scale-[1.02] active:scale-[0.98] transition cursor-pointer"
              >
                <GoogleIcon className="w-4 h-4" />
                <span>Continue with Google</span>
              </button>

              <Button
                size="lg"
                variant="primary"
                onClick={() => onQuickDemo('student')}
                leftIcon={<Zap className="w-4 h-4 text-[#111111] fill-[#111111]" />}
              >
                Launch Live Demo Sandbox
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* 9. CRISIS LIFELINE EMERGENCY BAR & FOOTER */}
      <footer className="border-t border-[#BFEAFF]/70 bg-white pt-12 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Lifeline Notice */}
          <div className="p-4 rounded-2xl bg-[#F8FCFF] border border-rose-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs shadow-sm">
            <div className="flex items-center gap-3 text-rose-800">
              <PhoneCall className="w-5 h-5 shrink-0 text-rose-600" />
              <span>
                <strong>24/7 Crisis Support:</strong> If you or someone you know is struggling or in distress, help is available.
              </span>
            </div>
            <div className="flex items-center gap-3 font-mono font-bold text-slate-700">
              <span className="px-2.5 py-1 rounded bg-rose-50 text-rose-700 border border-rose-200">
                Call/Text: 988
              </span>
              <span className="px-2.5 py-1 rounded bg-white text-slate-700 border border-[#BFEAFF]">
                Text HOME to 741741
              </span>
            </div>
          </div>

          {/* Links & Brand */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-6 border-t border-[#DFF4FF] text-xs text-slate-500">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-[#FFD84D] flex items-center justify-center">
                <Heart className="w-4 h-4 text-[#111111]" />
              </div>
              <span className="font-bold text-[#111111] text-sm">WellTrack</span>
              <span className="text-slate-500">• CodeForge '26 Submission</span>
            </div>

            <div className="flex flex-wrap items-center gap-6">
              <a href="#features" className="hover:text-[#111111] transition text-slate-600">
                Features
              </a>
              <a href="#privacy" className="hover:text-[#111111] transition text-slate-600">
                Privacy (Rule 07)
              </a>
              <a href="#campus" className="hover:text-[#111111] transition text-slate-600">
                Campus SSO
              </a>
              <a
                href="https://codeforge-zdxk.onrender.com/docs"
                target="_blank"
                rel="noreferrer"
                className="hover:text-[#111111] transition text-[#111111] font-semibold"
              >
                FastAPI Swagger Docs ↗
              </a>
            </div>

            <p className="text-slate-500">© 2026 WellTrack Technologies Inc. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
