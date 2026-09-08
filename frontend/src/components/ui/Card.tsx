import React from 'react'
import { cn } from '../../lib/utils'

export const Card: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  children,
  ...props
}) => {
  return (
    <div
      className={cn(
        'rounded-xl border border-[#BFEAFF]/70 bg-white p-5 shadow-xs hover:border-[#8ED8FF] transition-all duration-200',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  children,
  ...props
}) => {
  return (
    <div className={cn('flex items-center justify-between mb-3', className)} {...props}>
      {children}
    </div>
  )
}

export const CardTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({
  className,
  children,
  ...props
}) => {
  return (
    <h3 className={cn('font-semibold text-[#111111] text-lg tracking-tight', className)} {...props}>
      {children}
    </h3>
  )
}
