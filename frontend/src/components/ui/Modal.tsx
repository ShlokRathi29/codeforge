import React, { useEffect } from 'react'
import { X } from 'lucide-react'
import { cn } from '../../lib/utils'

export interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  className?: string
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  className,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      window.addEventListener('keydown', handleKeyDown)
    }
    return () => {
      document.body.style.overflow = 'unset'
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#111111]/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className={cn(
          'w-full max-w-lg bg-white border border-[#BFEAFF] rounded-2xl shadow-xl overflow-hidden',
          className
        )}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#DFF4FF]">
          <h3 className="text-lg font-semibold text-[#111111]">{title}</h3>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-500 hover:text-[#111111] hover:bg-[#DFF4FF]/50 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  )
}
