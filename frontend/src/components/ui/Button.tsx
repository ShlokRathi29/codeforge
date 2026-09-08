import React from 'react'
import { Loader2 } from 'lucide-react'
import { cn } from '../../lib/utils'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

export const Button: React.FC<ButtonProps> = ({
  children,
  className,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled,
  leftIcon,
  rightIcon,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-[#FFD84D]/60 disabled:opacity-50 disabled:pointer-events-none cursor-pointer'

  const variants = {
    primary: 'bg-[#FFD84D] hover:bg-[#FFC928] text-[#111111] font-semibold shadow-xs active:scale-[0.98]',
    secondary: 'bg-[#DFF4FF] hover:bg-[#BFEAFF] text-[#111111] border border-[#BFEAFF] active:scale-[0.98]',
    outline: 'border border-[#BFEAFF] hover:border-[#8ED8FF] bg-white text-[#111111] hover:bg-[#DFF4FF]/50 active:scale-[0.98]',
    ghost: 'text-[#111111] hover:text-[#111111] hover:bg-[#DFF4FF]/60',
    danger: 'bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 active:scale-[0.98]',
  }

  const sizes = {
    sm: 'text-xs px-2.5 py-1.5 gap-1.5',
    md: 'text-sm px-4 py-2 gap-2',
    lg: 'text-base px-5 py-2.5 gap-2.5',
  }

  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        leftIcon && <span className="shrink-0">{leftIcon}</span>
      )}
      <span>{children}</span>
      {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
    </button>
  )
}
