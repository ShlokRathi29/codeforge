'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight, LogOut, ShieldCheck, Sparkles } from 'lucide-react'

const logo = 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-UVl8uuOTaBcLektp7EuymOHDIlo7Vt.png'

export default function AccessPage() {
  const router = useRouter()
  const [signedOut, setSignedOut] = useState(false)

  function logout() {
    window.sessionStorage.removeItem('pingu-staff-session')
    window.sessionStorage.removeItem('pingu-student-session')
    setSignedOut(true)
  }

  return (
    <main className="min-h-screen bg-ice px-4 py-8 sm:px-6 sm:py-12">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-5xl items-center justify-center">
        <section className="grid w-full overflow-hidden rounded-[2rem] border border-line bg-white shadow-card lg:grid-cols-[.82fr_1.18fr]">
          <div className="relative overflow-hidden bg-ink p-7 text-white sm:p-10 lg:p-12">
            <div className="absolute -right-14 -top-14 size-48 rounded-full bg-[#1684d6]/30 blur-2xl" />
            <div className="relative">
              <div className="size-16 overflow-hidden rounded-2xl bg-[#1684d6] shadow-lg">
                <img src={logo} alt="Pingu penguin mascot" className="size-full object-cover" />
              </div>
              <p className="eyebrow mt-16 text-white/50">A kinder check-in</p>
              <h1 className="mt-3 max-w-sm font-display text-4xl font-extrabold leading-[1.02] tracking-[-.07em] sm:text-5xl">Welcome to pingu.</h1>
              <p className="mt-5 max-w-sm text-sm leading-6 text-white/65">A small, private space to notice how things are going and find the right kind of support.</p>
              <div className="mt-12 flex items-center gap-3 text-sm font-bold text-white/80"><ShieldCheck className="size-5 text-yellow" /> Privacy-first by design</div>
            </div>
          </div>

          <div className="p-7 sm:p-10 lg:p-12">
            <div className="flex items-start justify-between gap-4">
              <div><p className="eyebrow">Choose your space</p><h2 className="mt-2 font-display text-3xl font-extrabold tracking-[-.06em] text-ink">How would you like to enter?</h2></div>
              <Sparkles className="mt-1 hidden size-5 text-[#1684d6] sm:block" />
            </div>
            <div className="mt-8 flex flex-col gap-3">
              <button onClick={() => router.push('/student/login')} className="group flex items-center justify-between rounded-2xl border border-line bg-ice p-5 text-left transition hover:-translate-y-0.5 hover:border-ink hover:shadow-card"><span><span className="block text-base font-extrabold text-ink">Student login</span><span className="mt-1 block text-sm leading-5 text-muted">Check in, reflect, and see your own patterns.</span></span><ArrowRight className="size-5 text-muted transition group-hover:translate-x-1 group-hover:text-ink" /></button>
              <button onClick={() => router.push('/staff/login')} className="group flex items-center justify-between rounded-2xl border border-line p-5 text-left transition hover:-translate-y-0.5 hover:border-ink hover:shadow-card"><span><span className="block text-base font-extrabold text-ink">Staff login</span><span className="mt-1 block text-sm leading-5 text-muted">Review privacy-safe signals and offer support.</span></span><ArrowRight className="size-5 text-muted transition group-hover:translate-x-1 group-hover:text-ink" /></button>
            </div>
            <div className="mt-8 flex items-center justify-between gap-4 border-t border-line pt-5"><p className="text-xs font-semibold leading-5 text-muted">Already finished? Sign out of this demo device.</p><button onClick={logout} className="inline-flex shrink-0 items-center gap-2 rounded-full border border-line px-3 py-2 text-xs font-extrabold text-ink hover:border-ink"><LogOut className="size-3.5" /> Log out</button></div>
            {signedOut && <p role="status" className="mt-4 rounded-xl bg-[#ddf5e7] px-3 py-2 text-xs font-bold text-[#277348]">You&apos;re signed out on this device.</p>}
          </div>
        </section>
      </div>
    </main>
  )
}
