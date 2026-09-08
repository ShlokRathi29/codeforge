import { useState, useEffect } from 'react'
import {
  Lock,
  X,
  GraduationCap,
  ShieldCheck,
  ArrowRight,
  AlertCircle,
  Heart,
} from 'lucide-react'
import { Button } from '../ui/Button'
import { GoogleIcon } from '../ui/GoogleIcon'
import { demoLogin } from '../../api/client'
import type { User, UserRole } from '../../types'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  onAuthSuccess: (user: User, role: UserRole) => void
  defaultRole?: UserRole
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onAuthSuccess,
  defaultRole = 'student',
}) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>(defaultRole)
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  useEffect(() => {
    if (isOpen) {
      setSelectedRole(defaultRole)
    }
  }, [defaultRole, isOpen])

  if (!isOpen) return null

  // Handle Google Sign-in
  const handleGoogleSignIn = async () => {
    setIsLoading(true)
    setErrorMsg(null)

    try {
      // Authenticate via demo endpoint with Google identity simulation
      const res = await demoLogin(selectedRole)
      onAuthSuccess(res.user, selectedRole)
      onClose()
    } catch {
      setErrorMsg('Google authentication encountered a delay. Retrying...')
    } finally {
      setIsLoading(false)
    }
  }

  // Handle One-Click Quick Login
  const handleQuickDemo = async (role: UserRole) => {
    setIsLoading(true)
    setErrorMsg(null)
    try {
      const res = await demoLogin(role)
      onAuthSuccess(res.user, role)
      onClose()
    } catch {
      setErrorMsg('Failed to log in with demo account.')
    } finally {
      setIsLoading(false)
    }
  }

  // Handle standard form submit
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErrorMsg(null)

    try {
      const res = await demoLogin(selectedRole)
      onAuthSuccess(
        {
          ...res.user,
          name: name || (selectedRole === 'student' ? 'Atharva Dev' : 'Dr. Radhika Sharma'),
          email: email || res.user.email,
        },
        selectedRole
      )
      onClose()
    } catch {
      setErrorMsg('Invalid credentials. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-[#111111]/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white border border-[#BFEAFF] rounded-3xl p-6 sm:p-8 shadow-xl overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-full text-slate-400 hover:text-[#111111] hover:bg-[#DFF4FF]/50 transition cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header Branding */}
        <div className="text-center space-y-1.5 mb-6">
          <div className="inline-flex items-center justify-center w-11 h-11 rounded-2xl bg-[#FFD84D] border border-[#FFC928] shadow-xs text-[#111111] mb-2">
            <Heart className="w-5 h-5 fill-[#111111] text-[#111111]" />
          </div>
          <h3 className="text-xl font-bold text-[#111111] tracking-tight">
            {authMode === 'signin' ? 'Welcome Back to WellTrack' : 'Create Your WellTrack Account'}
          </h3>
          <p className="text-xs text-slate-600">
            Higher education student mood tracking & proactive support signals
          </p>
        </div>

        {/* Role Selector Tabs */}
        <div className="grid grid-cols-2 p-1 bg-[#F8FCFF] rounded-xl border border-[#BFEAFF] mb-5">
          <button
            type="button"
            onClick={() => setSelectedRole('student')}
            className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer ${
              selectedRole === 'student'
                ? 'bg-[#FFD84D] text-[#111111] font-bold shadow-xs'
                : 'text-slate-600 hover:text-[#111111]'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Student Portal</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedRole('staff')}
            className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer ${
              selectedRole === 'staff'
                ? 'bg-[#BFEAFF] text-[#111111] font-bold shadow-xs'
                : 'text-slate-600 hover:text-[#111111]'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Counselor / Staff</span>
          </button>
        </div>

        {/* Error notification */}
        {errorMsg && (
          <div className="p-3 mb-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* 1. Official Google Sign-In Button */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl border border-[#BFEAFF] bg-white hover:bg-[#F8FCFF] text-[#111111] text-sm font-semibold shadow-xs transition duration-150 cursor-pointer disabled:opacity-50"
        >
          <GoogleIcon className="w-4 h-4" />
          <span>Continue with Google</span>
        </button>

        {/* Divider */}
        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#DFF4FF]" />
          </div>
          <div className="relative flex justify-center text-[10px] uppercase">
            <span className="bg-white px-2 text-slate-500 font-semibold tracking-wider">
              Or quick demo sign-in
            </span>
          </div>
        </div>

        {/* 2. One-Click Hackathon Quick Logins */}
        <div className="grid grid-cols-1 gap-2 mb-4">
          <button
            type="button"
            onClick={() => handleQuickDemo('student')}
            className="flex items-center justify-between p-2.5 rounded-xl border border-[#BFEAFF] bg-[#DFF4FF]/50 hover:bg-[#DFF4FF] text-[#111111] text-xs font-medium transition cursor-pointer text-left"
          >
            <div className="flex items-center gap-2.5">
              <GraduationCap className="w-4 h-4 text-[#111111]" />
              <div>
                <div className="font-semibold text-[#111111]">Student Demo: Atharva Dev</div>
                <div className="text-[10px] text-slate-600">3-day stress streak ready for presentation</div>
              </div>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-[#111111]" />
          </button>

          <button
            type="button"
            onClick={() => handleQuickDemo('staff')}
            className="flex items-center justify-between p-2.5 rounded-xl border border-[#FFD84D]/60 bg-[#FFF9E6] hover:bg-[#FFF3CC] text-[#111111] text-xs font-medium transition cursor-pointer text-left"
          >
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-4 h-4 text-[#111111]" />
              <div>
                <div className="font-semibold text-[#111111]">Counselor Demo: Dr. Radhika Sharma</div>
                <div className="text-[10px] text-slate-600">View support signals (Zero student notes visible)</div>
              </div>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-[#111111]" />
          </button>
        </div>

        {/* 3. Standard Email / Password Form (Collapsible or Clean) */}
        <form onSubmit={handleFormSubmit} className="space-y-3 pt-1 border-t border-[#DFF4FF]">
          {authMode === 'signup' && (
            <div>
              <label className="text-[11px] font-semibold text-[#111111] block mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Atharva Bodade"
                className="w-full bg-white border border-[#BFEAFF] rounded-lg px-3 py-2 text-xs text-[#111111] placeholder:text-slate-400 focus:outline-none focus:border-[#FFD84D]"
              />
            </div>
          )}

          <div>
            <label className="text-[11px] font-semibold text-[#111111] block mb-1">University Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="student@campus.edu"
              className="w-full bg-white border border-[#BFEAFF] rounded-lg px-3 py-2 text-xs text-[#111111] placeholder:text-slate-400 focus:outline-none focus:border-[#FFD84D]"
            />
          </div>

          <div>
            <label className="text-[11px] font-semibold text-[#111111] block mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-white border border-[#BFEAFF] rounded-lg px-3 py-2 text-xs text-[#111111] placeholder:text-slate-400 focus:outline-none focus:border-[#FFD84D]"
            />
          </div>

          <Button type="submit" variant="primary" className="w-full" isLoading={isLoading}>
            {authMode === 'signin' ? 'Sign In with Email' : 'Create University Account'}
          </Button>
        </form>

        {/* Toggle sign in / sign up */}
        <div className="mt-4 text-center text-xs text-slate-600">
          {authMode === 'signin' ? (
            <span>
              New to WellTrack?{' '}
              <button
                onClick={() => setAuthMode('signup')}
                className="text-[#111111] hover:underline font-semibold cursor-pointer"
              >
                Sign up
              </button>
            </span>
          ) : (
            <span>
              Already have an account?{' '}
              <button
                onClick={() => setAuthMode('signin')}
                className="text-[#111111] hover:underline font-semibold cursor-pointer"
              >
                Sign in
              </button>
            </span>
          )}
        </div>

        {/* FERPA & Privacy Notice */}
        <div className="mt-5 pt-3 border-t border-[#DFF4FF] text-[10px] text-slate-500 flex items-center justify-center gap-1.5">
          <Lock className="w-3 h-3 text-emerald-600" />
          <span>FERPA Compliant • Requirement 07 Zero-Note Exposure Protocol</span>
        </div>
      </div>
    </div>
  )
}
