import type { ReactNode } from 'react'

import { DASHBOARD_COLORS } from '@/constants'
import { useCountUp } from '@/hooks/useCountUp'

export interface MetricCardProps {
  label: string
  value: number
  icon: ReactNode
  accentColor: string
  /** Percentual sobre o total — omitido quando não fizer sentido (ex.: Total). */
  percentage?: number
  /** Ativa o tratamento de alerta (usado só por Offline > 0). */
  alert?: boolean
}

/**
 * Célula de KPI compacta — número como elemento principal, mas sem
 * dominar a tela: densidade > tamanho isolado, para caber 5 destes
 * lado a lado na faixa de visão geral sem sobrar nem faltar espaço.
 */
export function MetricCard({ label, value, icon, accentColor, percentage, alert }: MetricCardProps) {
  const displayValue = useCountUp(value)

  return (
    <div
      className="flex flex-1 flex-col justify-center gap-1 rounded-lg px-4 py-2"
      style={{
        backgroundColor: alert ? `${accentColor}12` : DASHBOARD_COLORS.surfaceElevated,
        border: `1px solid ${alert ? `${accentColor}40` : DASHBOARD_COLORS.border}`,
      }}
    >
      <div className="flex items-center gap-1.5">
        <span style={{ color: accentColor }}>{icon}</span>
        <p
          className="truncate text-[0.6875rem] font-semibold tracking-wide uppercase"
          style={{ color: alert ? accentColor : DASHBOARD_COLORS.textMuted }}
        >
          {label}
        </p>
      </div>
      <div className="flex items-baseline gap-2">
        <p className="font-mono text-3xl leading-none font-bold tabular-nums" style={{ color: DASHBOARD_COLORS.text }}>
          {displayValue}
        </p>
        {percentage !== undefined && (
          <span className="font-mono text-xs tabular-nums" style={{ color: DASHBOARD_COLORS.textFaint }}>
            {percentage.toLocaleString('pt-BR', { maximumFractionDigits: 2 })}%
          </span>
        )}
      </div>
    </div>
  )
}
