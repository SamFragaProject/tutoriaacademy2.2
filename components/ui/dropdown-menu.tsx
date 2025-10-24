import * as React from 'react'
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu'
import { cn } from './cn'

export const DropdownMenu = DropdownMenuPrimitive.Root
export const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger
export const DropdownMenuContent = React.forwardRef<HTMLDivElement, React.ComponentProps<typeof DropdownMenuPrimitive.Content>>(
  ({ className, ...props }, ref) => (
    <DropdownMenuPrimitive.Content ref={ref} className={cn('z-50 min-w-[180px] overflow-hidden rounded-input border border-border bg-white p-1 shadow-card', className)} {...props} />
  )
)
DropdownMenuContent.displayName = 'DropdownMenuContent'

export const DropdownMenuItem = React.forwardRef<HTMLDivElement, React.ComponentProps<typeof DropdownMenuPrimitive.Item>>(
  ({ className, ...props }, ref) => (
    <DropdownMenuPrimitive.Item ref={ref} className={cn('flex cursor-pointer select-none items-center gap-2 rounded-input px-3 py-2 text-sm text-text hover:bg-[#FBFBFE] focus:bg-[#FBFBFE] focus:outline-none', className)} {...props} />
  )
)
DropdownMenuItem.displayName = 'DropdownMenuItem'
