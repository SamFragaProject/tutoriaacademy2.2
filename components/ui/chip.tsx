import * as React from 'react'
import { cn } from './cn'

export type ChipVariant = 'default' | 'primary' | 'success' | 'warning' | 'secondary'

const variantClasses: Record<ChipVariant, string> = {
  default: 'bg-[var(--ne-accent-bg)] text-[color:var(--ne-text)]',
  primary: 'bg-[rgba(111,91,255,0.10)] text-[color:var(--ne-primary)]',
  success: 'bg-[rgba(29,190,116,0.10)] text-[#1DBE74]',
  warning: 'bg-[rgba(255,171,62,0.12)] text-[#FFAB3E]',
  secondary: 'bg-white text-[color:var(--ne-text)] border border-[color:var(--ne-border)]'
}

export function Chip({ icon: Icon, label, variant = 'default', className }: { icon?: React.ElementType; label: string; variant?: ChipVariant; className?: string; }) {
  return (
    <span className={cn('inline-flex items-center gap-2 h-10 px-4 rounded-[9999px] text-[14px] font-medium shadow-card transition-all hover:shadow-[var(--ne-shadow-2)]', variantClasses[variant], className)}>
      {Icon && <Icon size={18} className="opacity-80" />}
      {label}
    </span>
  )
}
