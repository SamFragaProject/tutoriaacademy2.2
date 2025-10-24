import * as React from 'react'
import * as AvatarPrimitive from '@radix-ui/react-avatar'
import { cn } from './cn'

export function Avatar({ className, children }: React.ComponentProps<typeof AvatarPrimitive.Root>) {
  return (
    <AvatarPrimitive.Root className={cn('inline-flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[var(--ne-primary)] to-[var(--ne-primary-dark)] text-white font-bold shadow-card', className)}>
      {children}
    </AvatarPrimitive.Root>
  )
}

export function AvatarImage(props: React.ComponentProps<typeof AvatarPrimitive.Image>) {
  return <AvatarPrimitive.Image className="h-full w-full rounded-full object-cover" {...props} />
}

export function AvatarFallback({ children }: { children?: React.ReactNode }) {
  return <AvatarPrimitive.Fallback className="text-[16px]">{children}</AvatarPrimitive.Fallback>
}
