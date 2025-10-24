import * as React from 'react'
import { cn } from './cn'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, ...props }, ref) => {
  return (
    <input
      ref={ref}
      className={cn(
        'h-12 w-full rounded-input border border-border bg-white px-4 text-[14px] text-text placeholder:text-text-secondary/70 outline-none transition focus:border-primary focus:ring-2 focus:ring-[rgba(111,91,255,0.2)]',
        className
      )}
      {...props}
    />
  )
})
Input.displayName = 'Input'
