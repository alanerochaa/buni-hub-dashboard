import type { ReactNode } from 'react'

import { DASHBOARD_COLORS } from '@/constants'

export interface IconChipProps {
  children: ReactNode
  color?: string
  size?: 'sm' | 'md'
}

const SIZE_CLASSES = {
  sm: 'size-6',
  md: 'size-7',
} as const


export function IconChip({ children, color = DASHBOARD_COLORS.textMuted, size = 'md' }: IconChipProps) {
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-md ${SIZE_CLASSES[size]}`}
      style={{
        backgroundColor: DASHBOARD_COLORS.surfaceElevated,
        border: `1px solid ${DASHBOARD_COLORS.border}`,
        color,
      }}
    >
      {children}
    </span>
  )
}
