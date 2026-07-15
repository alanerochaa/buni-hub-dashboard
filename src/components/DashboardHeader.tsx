import { env } from '@/config/env'
import { DASHBOARD_COLORS, STATUS_CONFIG } from '@/constants'
import { useClock } from '@/hooks/useClock'
import { resolveEnvironmentLabel } from '@/utils/resolveEnvironmentLabel'

import { Logo } from './Logo'

export interface DashboardHeaderProps {
  dataUpdatedAt: number
}

const DATE_FORMATTER = new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })
const TIME_FORMATTER = new Intl.DateTimeFormat('pt-BR', {
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hour12: false,
})

const MONITORED_ENVIRONMENT = resolveEnvironmentLabel(env.apiBaseUrl)

/**
 * Uma única linha, altura mínima — logo, ambiente monitorado e
 * horário, nada além disso (sem status, sem contagens: ambos vivem na
 * faixa de visão geral logo abaixo).
 */
export function DashboardHeader({ dataUpdatedAt }: DashboardHeaderProps) {
  const now = useClock()

  return (
    <header
      className="flex h-16 shrink-0 items-center justify-between border-b px-6 lg:px-8"
      style={{ borderColor: DASHBOARD_COLORS.border, backgroundColor: DASHBOARD_COLORS.surfaceSunken }}
    >
      <div className="flex items-center gap-3">
        <Logo />
        <div className="border-l pl-3" style={{ borderColor: DASHBOARD_COLORS.borderStrong }}>
          <p className="text-base leading-tight font-semibold" style={{ color: DASHBOARD_COLORS.text }}>
            Painel Operacional
          </p>
          <div className="flex items-center gap-1.5">
            <span
              className="size-1.5 rounded-full animate-pulse [animation-duration:2.5s]"
              style={{ backgroundColor: STATUS_CONFIG.online.bright }}
              aria-hidden="true"
            />
            <p className="text-[0.6875rem] tracking-[0.16em] uppercase" style={{ color: DASHBOARD_COLORS.textSubtle }}>
              Monitoramento contínuo
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-8">
        <div className="text-right">
          <p className="text-[0.625rem] tracking-[0.14em] uppercase" style={{ color: DASHBOARD_COLORS.textFaint }}>
            Ambiente
          </p>
          <p className="text-sm font-semibold" style={{ color: DASHBOARD_COLORS.text }}>
            {MONITORED_ENVIRONMENT}
          </p>
        </div>

        <div className="text-right">
          <p className="text-[0.625rem] tracking-[0.14em] uppercase" style={{ color: DASHBOARD_COLORS.textFaint }}>
            Última atualização
          </p>
          <p className="font-mono text-sm tabular-nums" style={{ color: DASHBOARD_COLORS.textMuted }}>
            {TIME_FORMATTER.format(dataUpdatedAt)}
          </p>
        </div>

        <div className="text-right">
          <p className="font-mono text-2xl leading-none font-bold tabular-nums" style={{ color: DASHBOARD_COLORS.text }}>
            {TIME_FORMATTER.format(now)}
          </p>
          <p className="text-[0.6875rem] tabular-nums" style={{ color: DASHBOARD_COLORS.textSubtle }}>
            {DATE_FORMATTER.format(now)}
          </p>
        </div>
      </div>
    </header>
  )
}
