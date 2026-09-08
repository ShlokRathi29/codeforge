'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import {
  ArrowRight,
  BarChart3,
  Bell,
  Check,
  ChevronRight,
  CircleHelp,
  ClipboardCheck,
  Heart,
  History,
  Home,
  LockKeyhole,
  LogOut,
  Menu,
  MessageCircleHeart,
  MoreHorizontal,
  ShieldCheck,
  Sparkles,
  UserRound,
  X,
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

const mascotFull = 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-Yzg3JToTaQFHQSRgg2U0IUWdkKvjq4.png'
const mascotLogo = 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-UVl8uuOTaBcLektp7EuymOHDIlo7Vt.png'

const trendData = [
  { day: 'Mon', mood: 62, stress: 3.1 },
  { day: 'Tue', mood: 68, stress: 2.7 },
  { day: 'Wed', mood: 54, stress: 3.8 },
  { day: 'Thu', mood: 72, stress: 2.4 },
  { day: 'Fri', mood: 78, stress: 2.1 },
  { day: 'Sat', mood: 84, stress: 1.8 },
  { day: 'Sun', mood: 76, stress: 2.2 },
]

const checkInQuestions = [
  { title: 'How are you feeling overall today?', subtitle: 'There is no right answer. Just check in with where you are.', options: ['Really low', 'A little off', 'Okay', 'Pretty good', 'Really good'] },
  { title: 'How overwhelmed did you feel today?', subtitle: 'Think about everything you had to deal with.', options: ['Not at all', 'A little', 'Somewhat', 'Quite a bit', 'Extremely'] },
  { title: 'How much energy did you have?', subtitle: 'For your usual activities, studies, and the things you care about.', options: ['No energy', 'Low energy', 'Some energy', 'Good energy', 'Full energy'] },
  { title: 'How well did you handle stressful moments?', subtitle: 'Small moments count, too.', options: ['Not well', 'A little', 'Somewhat well', 'Pretty well', 'Very well'] },
]

const navItems = [
  { label: 'Overview', icon: Home },
  { label: 'Check-in', icon: ClipboardCheck },
  { label: 'My insights', icon: BarChart3 },
  { label: 'History', icon: History },
]

function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-2.5">
      <div className="size-10 overflow-hidden rounded-xl bg-[#1684d6] shadow-[0_5px_14px_rgba(22,132,214,0.22)]">
        <img src={mascotLogo} alt="Pingu penguin mascot" className="size-full object-cover" />
      </div>
      {!compact && <span className="font-display text-[1.55rem] font-extrabold tracking-[-0.06em] text-ink">pingu</span>}
    </div>
  )
}

function Mascot({ mode = 'welcome', className = '' }: { mode?: 'welcome' | 'thinking' | 'happy' | 'supportive'; className?: string }) {
  return (
    <motion.div
      className={`relative ${className}`}
      animate={{ y: mode === 'thinking' ? [0, -5, 0] : [0, -7, 0] }}
      transition={{ duration: mode === 'thinking' ? 3.5 : 4.5, repeat: Infinity, ease: 'easeInOut' }}
    >
      <img src={mascotFull} alt="Pingu penguin illustration" className="h-full w-full object-contain" />
    </motion.div>
  )
}

function PrivacyPill() {
  return <div className="inline-flex items-center gap-1.5 rounded-full bg-white/80 px-3 py-1.5 text-xs font-semibold text-muted shadow-sm"><LockKeyhole className="size-3.5" /> Private by design</div>
}

function StatCard({ label, value, detail, accent }: { label: string; value: string; detail: string; accent: 'yellow' | 'blue' | 'green' }) {
  const accentClass = accent === 'yellow' ? 'bg-yellow' : accent === 'green' ? 'bg-[#ddf5e7]' : 'bg-ice'
  return <div className="rounded-[1.45rem] border border-line bg-white p-5 shadow-card">
    <div className="mb-5 flex items-center justify-between"><span className="text-sm font-semibold text-muted">{label}</span><span className={`size-2.5 rounded-full ${accentClass}`} /></div>
    <div className="font-display text-3xl font-extrabold tracking-[-0.05em] text-ink">{value}</div>
    <div className="mt-1 text-xs font-medium text-muted">{detail}</div>
  </div>
}

function CheckIn({ onDone }: { onDone: () => void }) {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<number[]>([])
  const question = checkInQuestions[step]
  const progress = ((step + (answers.length > step ? 1 : 0)) / checkInQuestions.length) * 100

  function choose(index: number) {
    const next = [...answers]
    next[step] = index
    setAnswers(next)
    if (step === checkInQuestions.length - 1) {
      window.setTimeout(onDone, 420)
    } else {
      window.setTimeout(() => setStep((value) => value + 1), 280)
    }
  }

  return <main className="min-h-[calc(100vh-80px)] bg-ice px-4 py-8 sm:px-8 lg:px-12">
    <div className="mx-auto max-w-5xl">
      <div className="mb-8 flex items-center justify-between"><div><p className="eyebrow">Daily check-in</p><h1 className="mt-2 font-display text-3xl font-extrabold tracking-[-0.05em] text-ink sm:text-4xl">A small moment for you.</h1></div><div className="hidden sm:block"><PrivacyPill /></div></div>
      <div className="mb-6 h-2 overflow-hidden rounded-full bg-white"><motion.div className="h-full rounded-full bg-yellow" animate={{ width: `${Math.max(progress, 8)}%` }} transition={{ duration: .35 }} /></div>
      <div className="mb-7 flex items-center justify-between text-xs font-bold uppercase tracking-[0.12em] text-muted"><span>Question {step + 1} of {checkInQuestions.length}</span><span>{Math.round(Math.max(progress, 8))}% complete</span></div>
      <div className="grid items-center gap-8 lg:grid-cols-[0.85fr_1.15fr]">
        <div className="hidden min-h-[360px] rounded-[2rem] bg-[#cdeeff] p-5 sm:block"><Mascot mode="thinking" className="h-full" /></div>
        <AnimatePresence mode="wait"><motion.section key={step} initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -18 }} className="rounded-[2rem] border border-line bg-white p-6 shadow-card sm:p-9">
          <div className="mb-8 flex items-start justify-between gap-4"><div><p className="mb-3 text-4xl">{['◌', '◒', '◓', '●'][step]}</p><h2 className="max-w-lg font-display text-2xl font-extrabold leading-tight tracking-[-0.04em] text-ink sm:text-3xl">{question.title}</h2><p className="mt-3 max-w-lg text-sm leading-6 text-muted">{question.subtitle}</p></div><CircleHelp className="mt-1 hidden size-5 text-muted sm:block" /></div>
          <div className="flex flex-col gap-3">{question.options.map((option, index) => <button key={option} onClick={() => choose(index)} className={`group flex min-h-14 items-center justify-between rounded-2xl border px-4 text-left text-sm font-bold transition hover:-translate-y-0.5 hover:border-ink hover:shadow-[0_8px_0_#111] ${answers[step] === index ? 'border-ink bg-yellow shadow-[0_5px_0_#111]' : 'border-line bg-[#fbfdff] text-ink'}`}><span>{option}</span><span className="flex size-7 items-center justify-center rounded-full border border-line text-xs text-muted group-hover:border-ink group-hover:text-ink">{index + 1}</span></button>)}</div>
          <p className="mt-6 text-center text-xs font-medium text-muted">Choose the answer that feels closest. You can change it until you move on.</p>
        </motion.section></AnimatePresence>
      </div>
    </div>
  </main>
}

function Overview({ onStart }: { onStart: () => void }) {
  return <main className="min-h-[calc(100vh-80px)] bg-ice px-4 py-8 sm:px-8 lg:px-12"><div className="mx-auto max-w-6xl">
    <section className="relative overflow-hidden rounded-[2rem] bg-[#cdeeff] px-6 py-7 sm:px-10 sm:py-10 lg:min-h-[320px] lg:px-12"><div className="relative z-10 max-w-xl"><PrivacyPill /><p className="eyebrow mt-8">Sunday, September 8</p><h1 className="mt-3 max-w-lg font-display text-4xl font-extrabold leading-[.98] tracking-[-0.07em] text-ink sm:text-5xl">Hey Maya, how are you really doing?</h1><p className="mt-5 max-w-md text-sm leading-6 text-muted">A few honest seconds can help you notice patterns, protect your energy, and find the support you deserve.</p><button onClick={onStart} className="mt-6 inline-flex items-center gap-2 rounded-full bg-yellow px-5 py-3 text-sm font-extrabold text-ink shadow-[0_5px_0_#111] transition hover:-translate-y-0.5 hover:shadow-[0_7px_0_#111]">Start today&apos;s check-in <ArrowRight className="size-4" /></button></div><div className="absolute -bottom-10 right-0 hidden h-[370px] w-[430px] lg:block"><Mascot mode="welcome" className="h-full" /></div></section>
    <div className="mt-8 grid gap-5 md:grid-cols-3"><StatCard label="Mood this week" value="Feeling good" detail="Up 12% from last week" accent="yellow" /><StatCard label="Average stress" value="2.6 / 5" detail="Your calmest week yet" accent="blue" /><StatCard label="Check-in streak" value="6 days" detail="One more for a full week" accent="green" /></div>
    <div className="mt-8 grid gap-5 lg:grid-cols-[1.35fr_.65fr]"><section className="rounded-[1.7rem] border border-line bg-white p-6 shadow-card sm:p-7"><div className="flex items-start justify-between"><div><p className="eyebrow">Your week</p><h2 className="mt-2 font-display text-2xl font-extrabold tracking-[-0.05em] text-ink">A little more steady</h2></div><button className="text-sm font-bold text-muted transition hover:text-ink">View insights <ChevronRight className="inline size-4" /></button></div><div className="mt-6 h-[220px] w-full"><ResponsiveContainer width="100%" height="100%"><AreaChart data={trendData} margin={{ top: 10, right: 0, left: -24, bottom: 0 }}><defs><linearGradient id="moodFill" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#ffd84d" stopOpacity={0.5} /><stop offset="95%" stopColor="#ffd84d" stopOpacity={0.02} /></linearGradient></defs><CartesianGrid vertical={false} stroke="#e1ebf2" /><XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#738291', fontSize: 11, fontWeight: 600 }} /><YAxis hide domain={[0, 100]} /><Tooltip contentStyle={{ borderRadius: 14, border: '1px solid #dce7ee', boxShadow: '0 10px 30px rgba(22,53,77,.1)' }} /><Area type="monotone" dataKey="mood" stroke="#111111" strokeWidth={3} fill="url(#moodFill)" /></AreaChart></ResponsiveContainer></div></section>
    <section className="flex flex-col justify-between rounded-[1.7rem] bg-ink p-6 text-white shadow-card sm:p-7"><div><div className="flex size-10 items-center justify-center rounded-xl bg-yellow text-ink"><Heart className="size-5 fill-current" /></div><h2 className="mt-7 font-display text-2xl font-extrabold tracking-[-0.05em]">Small wins count.</h2><p className="mt-3 text-sm leading-6 text-white/65">You checked in on 6 of the last 7 days. That&apos;s a meaningful way to look after yourself.</p></div><button onClick={onStart} className="mt-8 flex items-center justify-between border-t border-white/15 pt-4 text-sm font-bold text-white">Keep the streak <ArrowRight className="size-4" /></button></section></div>
    <section className="mt-8 flex flex-col gap-5 rounded-[1.7rem] border border-line bg-white p-6 shadow-card sm:flex-row sm:items-center sm:justify-between sm:p-7"><div className="flex items-start gap-4"><div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-[#fff4bf]"><ShieldCheck className="size-5 text-ink" /></div><div><h3 className="font-display text-lg font-extrabold tracking-[-0.03em] text-ink">Your check-ins are yours.</h3><p className="mt-1 max-w-xl text-sm leading-6 text-muted">Private notes stay private. Staff only see a pattern when it may help them offer support.</p></div></div><button className="shrink-0 text-sm font-extrabold text-ink underline decoration-yellow decoration-4 underline-offset-4">How privacy works</button></section>
  </div></main>
}

function Insights() {
  return <main className="min-h-[calc(100vh-80px)] bg-ice px-4 py-8 sm:px-8 lg:px-12"><div className="mx-auto max-w-6xl"><p className="eyebrow">Your insights</p><h1 className="mt-2 font-display text-4xl font-extrabold tracking-[-0.06em] text-ink">Patterns, not pressure.</h1><p className="mt-3 max-w-xl text-sm leading-6 text-muted">A gentle look at the last seven days. You are more than any one number.</p><div className="mt-8 grid gap-5 md:grid-cols-3"><StatCard label="Average stress" value="2.6 / 5" detail="Down 0.8 from last week" accent="green" /><StatCard label="Mood trend" value="Improving" detail="Your best days were Fri–Sat" accent="yellow" /><StatCard label="Energy" value="Steady" detail="Mostly in your usual range" accent="blue" /></div><div className="mt-6 rounded-[1.7rem] border border-line bg-white p-6 shadow-card sm:p-8"><div className="flex items-start justify-between"><div><p className="eyebrow">The bigger picture</p><h2 className="mt-2 font-display text-2xl font-extrabold tracking-[-0.05em] text-ink">Your mood across the week</h2></div><Sparkles className="size-5 text-[#e3b900]" /></div><div className="mt-8 h-[260px] w-full"><ResponsiveContainer width="100%" height="100%"><AreaChart data={trendData} margin={{ top: 10, right: 0, left: -24, bottom: 0 }}><CartesianGrid vertical={false} stroke="#e1ebf2" /><XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#738291', fontSize: 11, fontWeight: 600 }} /><YAxis hide domain={[0, 100]} /><Tooltip /><Area type="monotone" dataKey="mood" stroke="#111111" strokeWidth={3} fill="#fff4bf" /><Area type="monotone" dataKey="stress" stroke="#53a9d6" strokeWidth={2} fill="transparent" /></AreaChart></ResponsiveContainer></div><div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-xs font-semibold text-muted"><span className="flex items-center gap-2"><i className="size-2 rounded-full bg-ink" /> Mood</span><span className="flex items-center gap-2"><i className="size-2 rounded-full bg-[#53a9d6]" /> Stress level</span></div></div></div></main>
}

function HistoryView() {
  const entries = [{ date: 'Sunday, Sep 8', mood: 'Pretty good', stress: '2 / 5', note: 'Took a proper break before studying.' }, { date: 'Saturday, Sep 7', mood: 'Really good', stress: '1 / 5', note: 'Went for a long walk and called Mum.' }, { date: 'Friday, Sep 6', mood: 'Okay', stress: '3 / 5', note: 'A busy day, but I got through it.' }]
  return <main className="min-h-[calc(100vh-80px)] bg-ice px-4 py-8 sm:px-8 lg:px-12"><div className="mx-auto max-w-4xl"><p className="eyebrow">Your history</p><h1 className="mt-2 font-display text-4xl font-extrabold tracking-[-0.06em] text-ink">Your check-in journal.</h1><p className="mt-3 text-sm leading-6 text-muted">Only you can see the private notes you leave here.</p><div className="mt-8 flex flex-col gap-4">{entries.map((entry) => <article key={entry.date} className="rounded-[1.5rem] border border-line bg-white p-5 shadow-card sm:p-6"><div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"><div><p className="text-sm font-extrabold text-ink">{entry.date}</p><p className="mt-1 text-xs font-semibold text-muted">Daily check-in completed</p></div><div className="flex gap-2"><span className="rounded-full bg-[#fff4bf] px-3 py-1.5 text-xs font-bold text-ink">Mood: {entry.mood}</span><span className="rounded-full bg-ice px-3 py-1.5 text-xs font-bold text-ink">Stress: {entry.stress}</span></div></div><div className="mt-5 flex items-start gap-3 rounded-xl bg-[#f7fafc] p-4"><LockKeyhole className="mt-0.5 size-4 shrink-0 text-muted" /><p className="text-sm leading-6 text-muted">{entry.note}</p></div></article>)}</div></div></main>
}

function Profile() {
  return <main className="min-h-[calc(100vh-80px)] bg-ice px-4 py-8 sm:px-8 lg:px-12"><div className="mx-auto max-w-4xl"><p className="eyebrow">Profile & privacy</p><h1 className="mt-2 font-display text-4xl font-extrabold tracking-[-0.06em] text-ink">A safe space to be honest.</h1><div className="mt-8 grid gap-5 lg:grid-cols-[.8fr_1.2fr]"><section className="rounded-[1.7rem] bg-ink p-6 text-white sm:p-8"><div className="flex size-16 items-center justify-center rounded-2xl bg-yellow text-ink"><UserRound className="size-7" /></div><h2 className="mt-6 font-display text-2xl font-extrabold tracking-[-0.05em]">Maya Chen</h2><p className="mt-1 text-sm text-white/60">Student account · Year 2</p><button className="mt-10 flex w-full items-center justify-between border-t border-white/15 pt-4 text-sm font-bold">Account settings <ChevronRight className="size-4" /></button></section><section className="rounded-[1.7rem] border border-line bg-white p-6 shadow-card sm:p-8"><div className="flex items-start gap-4"><div className="flex size-11 items-center justify-center rounded-2xl bg-[#ddf5e7]"><ShieldCheck className="size-5" /></div><div><h2 className="font-display text-xl font-extrabold tracking-[-0.04em] text-ink">Privacy, in plain English</h2><p className="mt-2 text-sm leading-6 text-muted">Your wellbeing belongs to you. Pingu is built to help you notice patterns, not label you.</p></div></div><div className="mt-7 flex flex-col gap-4">{['Your responses and private notes belong to you.', 'Staff never see the private notes you write.', 'Only predefined patterns can create a support alert.', 'You can ask to export or delete your data.'].map((item) => <div key={item} className="flex gap-3 text-sm font-semibold text-ink"><Check className="size-4 shrink-0 text-[#2b9a63]" />{item}</div>)}</div><button className="mt-8 rounded-full border border-line px-4 py-2.5 text-sm font-extrabold text-ink transition hover:border-ink">Download my data</button></section></div></div></main>
}

export default function PinguApp() {
  const router = useRouter()
  const [active, setActive] = useState('Overview')
  const [mobileOpen, setMobileOpen] = useState(false)
  const [showComplete, setShowComplete] = useState(false)
  const content = useMemo(() => {
    if (active === 'Check-in') return <CheckIn onDone={() => setShowComplete(true)} />
    if (active === 'My insights') return <Insights />
    if (active === 'History') return <HistoryView />
    if (active === 'Profile') return <Profile />
    return <Overview onStart={() => { setShowComplete(false); setActive('Check-in') }} />
  }, [active])

  if (showComplete) return <div className="min-h-screen bg-ice px-5 py-10"><div className="mx-auto flex min-h-[75vh] max-w-2xl flex-col items-center justify-center text-center"><div className="mb-3 h-64 w-72"><Mascot mode="happy" className="h-full" /></div><p className="eyebrow">Check-in complete</p><h1 className="mt-3 font-display text-5xl font-extrabold tracking-[-0.07em] text-ink">You showed up for yourself.</h1><p className="mt-5 max-w-md text-sm leading-6 text-muted">That small pause matters. Your answers are saved privately, and you can come back to your week whenever you need.</p><div className="mt-8 flex flex-col gap-3 sm:flex-row"><button onClick={() => { setShowComplete(false); setActive('My insights') }} className="rounded-full bg-yellow px-6 py-3 text-sm font-extrabold text-ink shadow-[0_5px_0_#111]">See my week</button><button onClick={() => { setShowComplete(false); setActive('Overview') }} className="rounded-full border border-line bg-white px-6 py-3 text-sm font-extrabold text-ink">Back to overview</button></div></div></div>

  return <div className="min-h-screen bg-ice"><header className="sticky top-0 z-30 border-b border-line/80 bg-[#f8fcff]/90 backdrop-blur"><div className="mx-auto flex h-20 max-w-[1400px] items-center justify-between px-4 sm:px-8 lg:px-12"><button onClick={() => setActive('Overview')} aria-label="Go to overview"><Logo /></button><nav className="hidden items-center gap-1 md:flex">{navItems.map(({ label, icon: Icon }) => <button key={label} onClick={() => setActive(label)} className={`flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-bold transition ${active === label ? 'bg-yellow text-ink' : 'text-muted hover:bg-white hover:text-ink'}`}><Icon className="size-4" />{label}</button>)} </nav><div className="flex items-center gap-3"><button className="hidden size-10 items-center justify-center rounded-full border border-line bg-white text-muted sm:flex"><Bell className="size-4" /></button><button onClick={() => setActive('Profile')} className="flex items-center gap-2 rounded-full border border-line bg-white py-1.5 pl-1.5 pr-3 text-left"><span className="flex size-8 items-center justify-center rounded-full bg-ink text-xs font-extrabold text-white">MC</span><span className="hidden text-xs font-bold text-ink sm:block">Maya</span></button><button onClick={() => { window.sessionStorage.removeItem('pingu-student-session'); router.push('/login') }} className="hidden items-center gap-2 rounded-full border border-line bg-white px-3 py-2 text-xs font-extrabold text-ink hover:border-ink sm:flex" aria-label="Log out"><span className="hidden lg:inline">Log out</span><span className="lg:hidden">Exit</span></button><button onClick={() => setMobileOpen((value) => !value)} className="flex size-10 items-center justify-center rounded-full border border-line bg-white md:hidden" aria-label="Toggle menu">{mobileOpen ? <X className="size-4" /> : <Menu className="size-4" />}</button></div></div>{mobileOpen && <div className="border-t border-line bg-white px-4 py-3 md:hidden">{navItems.map(({ label, icon: Icon }) => <button key={label} onClick={() => { setActive(label); setMobileOpen(false) }} className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-bold ${active === label ? 'bg-yellow' : 'text-muted'}`}><Icon className="size-4" />{label}</button>)}<button onClick={() => { setActive('Profile'); setMobileOpen(false) }} className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-bold text-muted"><UserRound className="size-4" />Profile & privacy</button></div>}</header><AnimatePresence mode="wait"><motion.div key={active} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .25 }}>{content}</motion.div></AnimatePresence><footer className="border-t border-line bg-[#f8fcff] px-4 py-8 sm:px-8 lg:px-12"><div className="mx-auto flex max-w-6xl flex-col gap-3 text-xs font-semibold text-muted sm:flex-row sm:items-center sm:justify-between"><span>pingu · a kinder check-in</span><span className="flex items-center gap-2"><LockKeyhole className="size-3.5" /> Your wellbeing data stays yours</span></div></footer></div>
}

export { mascotFull, mascotLogo }

void MoreHorizontal
void MessageCircleHeart
