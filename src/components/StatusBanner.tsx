import { DASHBOARD_COLORS, STATUS_CONFIG } from '@/constants'
import type { DashboardSummary } from '@/types'

import { AlertTriangleIcon, CheckCircleIcon } from './icons'

export interface StatusBannerProps {
  summary: DashboardSummary
}

/**
 * Primeiro elemento lido na hierarquia ("Estado Geral") — uma
 * sentença única, sem números para decodificar, respondendo a
 * pergunta que mais importa em até 1 segundo: está tudo bem ou não?
 * Os cards de métrica abaixo (MetricsRow) detalham o "quanto"; este
 * banner só responde o "e então?". Deliberadamente calmo quando
 * offline = 0 (sem verde vibrante, sem confete) — tranquilidade aqui
 * é a ausência de alarme, não uma celebração.
 */
export function StatusBanner({ summary }: StatusBannerProps) {
  const isOperational = summary.offline === 0
  const status = isOperational ? STATUS_CONFIG.online : STATUS_CONFIG.offline

  const attentionParts: string[] = []
  if (summary.offline > 0) {
    attentionParts.push(`${summary.offline} ${summary.offline === 1 ? 'recurso offline' : 'recursos offline'}`)
  }
  if (summary.maintenance > 0) {
    attentionParts.push(`${summary.maintenance} em manutenção`)
  }

  return (
    <div
      className="flex shrink-0 items-center gap-3 border-b px-6 py-2.5 lg:px-10"
      style={{
        backgroundColor: isOperational ? `${status.bright}0d` : `${status.bright}14`,
        borderColor: DASHBOARD_COLORS.border,
      }}
    >
      <span style={{ color: status.bright }} aria-hidden="true">
        {isOperational ? <CheckCircleIcon className="size-4" /> : <AlertTriangleIcon className="size-4" />}
      </span>
      <p className="text-sm font-medium" style={{ color: DASHBOARD_COLORS.text }}>
        {isOperational
          ? 'Todos os sistemas operacionais.'
          : `Atenção necessária — ${attentionParts.join(' · ')}.`}
      </p>
      {!isOperational && (
        <span className="font-mono text-xs tabular-nums" style={{ color: DASHBOARD_COLORS.textSubtle }}>
          {summary.online} de {summary.total} recursos saudáveis
        </span>
      )}
    </div>
  )
}
