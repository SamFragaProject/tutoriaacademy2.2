import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from './cn'

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-button text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default:
          'bg-gradient-to-b from-[#7C6CFF] to-[#5E4CFF] text-white border border-primary shadow-[0_4px_12px_rgba(111,91,255,0.15)] hover:shadow-card-2 hover:scale-[1.01]',
        secondary:
          'bg-white text-text border border-[#D5D7E3] hover:bg-[#FBFBFE] shadow-card',
        ghost:
          'bg-transparent text-text-secondary hover:bg-[var(--ne-accent-bg)]',
        destructive:
          'bg-[#EF5A5A] text-white hover:bg-[#e14d4d]'
      },
      size: {
        default: 'h-12 px-5',
        sm: 'h-10 px-4',
        lg: 'h-12 px-6',
        icon: 'h-10 w-10 p-0'
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'default'
    }
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button ref={ref} className={cn(buttonVariants({ variant, size }), className)} {...props} />
    )
  }
)
Button.displayName = 'Button'
