'use client'

import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, LockKeyhole } from 'lucide-react'

const logo = 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-UVl8uuOTaBcLektp7EuymOHDIlo7Vt.png'

export default function StudentLogin() {
  const router = useRouter()
  const [name, setName] = useState('')
  function submit(event: FormEvent) { event.preventDefault(); window.sessionStorage.setItem('pingu-student-session', name.trim() || 'demo-student'); router.push('/') }
  return <main className="flex min-h-screen items-center justify-center bg-ice px-4 py-10"><section className="w-full max-w-md rounded-[2rem] border border-line bg-white p-7 shadow-card sm:p-10"><Link href="/login" className="inline-flex items-center gap-2 text-sm font-bold text-muted hover:text-ink"><ArrowLeft className="size-4" /> Back to access</Link><div className="mt-10 flex size-16 overflow-hidden rounded-2xl bg-[#1684d6] shadow-lg"><img src={logo} alt="Pingu penguin mascot" className="size-full object-cover" /></div><p className="eyebrow mt-10">Your private space</p><h1 className="mt-2 font-display text-4xl font-extrabold tracking-[-.07em] text-ink">Student login</h1><p className="mt-3 text-sm leading-6 text-muted">Enter a name or nickname to start the demo check-in. Your reflections stay yours.</p><form onSubmit={submit} className="mt-8 flex flex-col gap-4"><label className="flex flex-col gap-2 text-sm font-bold text-ink">Name or nickname<input value={name} onChange={(event) => setName(event.target.value)} className="h-12 rounded-xl border border-line bg-[#fbfdff] px-4 font-semibold outline-none focus:border-ink" placeholder="Sam" autoComplete="off" /></label><button type="submit" className="flex h-12 items-center justify-center gap-2 rounded-xl bg-ink px-4 text-sm font-extrabold text-white hover:bg-[#27313b]">Continue <ArrowRight className="size-4" /></button></form><div className="mt-7 flex items-start gap-2 rounded-xl bg-ice p-3 text-xs font-semibold leading-5 text-muted"><LockKeyhole className="mt-0.5 size-4 shrink-0 text-ink" /> This demo uses a temporary session on this device.</div></section></main>
}
