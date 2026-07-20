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


const ENVIRONMENT_BADGE_COLORS: Record<string, string> = {
  Desenvolvimento: '#60A5FA',
  Homologação: '#A78BFA',
  Produção: '#2DD4BF',
}
const ENVIRONMENT_BADGE_COLOR = ENVIRONMENT_BADGE_COLORS[MONITORED_ENVIRONMENT] ?? DASHBOARD_COLORS.textMuted

export function DashboardHeader({ dataUpdatedAt }: DashboardHeaderProps) {
  const now = useClock()

  return (
    <header
      className="flex h-20 shrink-0 items-center justify-between border-b px-6 lg:px-8"
      style={{ borderColor: DASHBOARD_COLORS.border, backgroundColor: DASHBOARD_COLORS.surfaceSunken }}
    >
      <div className="flex items-center gap-3">
        <Logo />
        <div className="border-l pl-3" style={{ borderColor: DASHBOARD_COLORS.borderStrong }}>
          <p className="text-2xl leading-tight font-bold" style={{ color: DASHBOARD_COLORS.text }}>
            Painel Operacional
          </p>
          <div className="mt-0.5 flex items-center gap-1.5">
            <span
              className="size-1.5 rounded-full animate-pulse [animation-duration:2.5s]"
              style={{ backgroundColor: STATUS_CONFIG.online.bright }}
              aria-hidden="true"
            />
            <p className="text-sm font-light tracking-wide" style={{ color: DASHBOARD_COLORS.textSubtle }}>
              Monitoramento contínuo
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="text-right">
          <p className="text-[0.625rem] font-medium tracking-wide" style={{ color: DASHBOARD_COLORS.textFaint }}>
            Ambiente
          </p>
          <span
            className="mt-0.5 inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold"
            style={{ color: ENVIRONMENT_BADGE_COLOR, backgroundColor: `${ENVIRONMENT_BADGE_COLOR}22` }}
          >
            <span className="size-1.5 rounded-full" style={{ backgroundColor: ENVIRONMENT_BADGE_COLOR }} />
            {MONITORED_ENVIRONMENT}
          </span>
        </div>

        <div className="text-right">
          <p className="text-[0.625rem] font-medium tracking-wide" style={{ color: DASHBOARD_COLORS.textFaint }}>
            Última atualização
          </p>
          <p className="font-mono text-sm tabular-nums" style={{ color: DASHBOARD_COLORS.textMuted }}>
            {TIME_FORMATTER.format(dataUpdatedAt)}
          </p>
        </div>

        <div className="text-right">
          <p className="font-mono text-xl leading-none font-semibold tabular-nums" style={{ color: DASHBOARD_COLORS.text }}>
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
