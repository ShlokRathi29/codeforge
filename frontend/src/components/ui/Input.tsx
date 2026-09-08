import React from 'react'
import { cn } from '../../lib/utils'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined)

    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-xs font-semibold text-[#111111]">
            {label}
          </label>
        )}
        <input
          id={inputId}
          ref={ref}
          className={cn(
            'w-full px-3.5 py-2 text-sm bg-white border border-[#BFEAFF] rounded-lg text-[#111111] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#FFD84D]/50 focus:border-[#FFD84D] transition duration-150 disabled:opacity-50 disabled:bg-[#F8FCFF]',
            error && 'border-rose-400 focus:ring-rose-400/30 focus:border-rose-400',
            className
          )}
          {...props}
        />
        {error && <span className="text-xs text-rose-600">{error}</span>}
        {!error && helperText && <span className="text-xs text-slate-500">{helperText}</span>}
      </div>
    )
  }
)
Input.displayName = 'Input'
