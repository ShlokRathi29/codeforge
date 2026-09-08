import React from 'react'
import { motion } from 'framer-motion'
import { LockKeyhole } from 'lucide-react'

export const mascotFull =
  'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-Yzg3JToTaQFHQSRgg2U0IUWdkKvjq4.png'
export const mascotLogo =
  'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-UVl8uuOTaBcLektp7EuymOHDIlo7Vt.png'

interface MascotProps {
  mode?: 'welcome' | 'thinking' | 'happy' | 'supportive'
  className?: string
}

export const Mascot: React.FC<MascotProps> = ({ mode = 'welcome', className = '' }) => {
  const isThinking = mode === 'thinking'
  const isHappy = mode === 'happy'

  return (
    <motion.div
      className={`relative select-none pointer-events-none ${className}`}
      animate={{
        y: isHappy ? [0, -10, 0] : isThinking ? [0, -5, 0] : [0, -7, 0],
        rotate: isHappy ? [0, -2, 2, 0] : 0,
      }}
      transition={{
        duration: isHappy ? 2.5 : isThinking ? 3.5 : 4.5,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    >
      <img
        src={mascotFull}
        alt="Pingu penguin illustration"
        className="h-full w-full object-contain drop-shadow-sm"
        loading="lazy"
      />
    </motion.div>
  )
}

export const Logo: React.FC<{ compact?: boolean; className?: string; subtitle?: string }> = ({
  compact = false,
  className = '',
  subtitle = 'a kinder check-in',
}) => {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <div className="w-10 h-10 overflow-hidden rounded-xl bg-[#1684d6] shadow-[0_5px_14px_rgba(22,132,214,0.22)] shrink-0 flex items-center justify-center">
        <img
          src={mascotLogo}
          alt="Pingu penguin mascot"
          className="w-full h-full object-cover"
        />
      </div>
      {!compact && (
        <div className="flex flex-col">
          <span className="font-extrabold text-xl tracking-tight text-[#111111] leading-tight">
            pingu
          </span>
          <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
            {subtitle}
          </span>
        </div>
      )}
    </div>
  )
}

export const PrivacyPill: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div
      className={`inline-flex items-center gap-1.5 rounded-full bg-white/90 backdrop-blur-xs border border-[#BFEAFF] px-3 py-1 text-xs font-semibold text-slate-700 shadow-xs ${className}`}
    >
      <LockKeyhole className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
      <span>Private by design</span>
    </div>
  )
}
