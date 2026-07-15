import { useMemo } from 'react'

import {
  DASHBOARD_COLORS,
  INCIDENT_STATUS_ORDER,
  PANEL_SHADOW,
  RESOURCE_ENVIRONMENT_LABELS,
  SECTION_TITLE_CLASSES,
  STATUS_CONFIG,
} from '@/constants'
import type { DashboardIncident, ResourceType } from '@/types'
import { formatElapsed } from '@/utils/formatElapsed'

import { ApiIcon, ShieldCheckIcon, SiteIcon, WebServiceIcon } from './icons'

export interface IncidentsPanelProps {
  incidents: DashboardIncident[]
  now: number
  className?: string
}

// Cabe sem rolagem na altura reservada para este painel — o restante
// vira um resumo agregado em vez de uma lista infinita numa tela de TV.
const MAX_VISIBLE_ROWS = 6

const TIME_FORMATTER = new Intl.DateTimeFormat('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })

const TYPE_ICONS: Record<ResourceType, typeof ApiIcon> = {
  api: ApiIcon,
  'web-service': WebServiceIcon,
  site: SiteIcon,
}

function AllOperationalState() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-2">
      <span style={{ color: STATUS_CONFIG.online.bright }}>
        <ShieldCheckIcon className="size-9" />
      </span>
      <p className="text-base font-semibold" style={{ color: DASHBOARD_COLORS.text }}>
        Todos os recursos operacionais
      </p>
    </div>
  )
}

function StatusBadge({ status }: { status: DashboardIncident['status'] }) {
  const config = STATUS_CONFIG[status]
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-semibold"
      style={{ color: config.bright, backgroundColor: `${config.base}22` }}
    >
      <span className="size-1.5 rounded-full" style={{ backgroundColor: config.bright }} />
      {config.label}
    </span>
  )
}

function sortForDisplay(incidents: DashboardIncident[]): DashboardIncident[] {
  return [...incidents].sort((a, b) => {
    const diff = INCIDENT_STATUS_ORDER.indexOf(a.status) - INCIDENT_STATUS_ORDER.indexOf(b.status)
    if (diff !== 0) return diff
    return a.name.localeCompare(b.name, 'pt-BR')
  })
}

/**
 * Item 5 da hierarquia — o principal componente operacional. Formato
 * de tabela compacta, com limite de linhas visíveis (`MAX_VISIBLE_ROWS`)
 * para nunca precisar de rolagem numa tela de TV: o excedente vira um
 * resumo agregado, não uma lista truncada silenciosamente.
 */
export function IncidentsPanel({ incidents, now, className = '' }: IncidentsPanelProps) {
  const sorted = useMemo(() => sortForDisplay(incidents), [incidents])
  const visible = sorted.slice(0, MAX_VISIBLE_ROWS)
  const hiddenCount = sorted.length - visible.length

  return (
    <div
      className={`flex min-h-0 flex-col gap-3 rounded-xl p-5 ${className}`}
      style={{
        backgroundColor: DASHBOARD_COLORS.surface,
        border: `1px solid ${DASHBOARD_COLORS.border}`,
        boxShadow: PANEL_SHADOW,
      }}
    >
      <div className="flex shrink-0 items-center justify-between">
        <p className={SECTION_TITLE_CLASSES} style={{ color: DASHBOARD_COLORS.textMuted }}>
          Recursos que Exigem Atenção
        </p>
        {sorted.length > 0 && (
          <span
            className="rounded-full px-2.5 py-0.5 font-mono text-xs font-semibold tabular-nums"
            style={{ color: STATUS_CONFIG.offline.bright, backgroundColor: `${STATUS_CONFIG.offline.base}22` }}
          >
            {sorted.length}
          </span>
        )}
      </div>

      {sorted.length === 0 ? (
        <AllOperationalState />
      ) : (
        <div className="flex min-h-0 flex-1 flex-col">
          <table className="w-full table-fixed border-separate border-spacing-0 text-left text-sm">
            <colgroup>
              <col style={{ width: '2rem' }} />
              <col />
              <col style={{ width: '7rem' }} />
              <col style={{ width: '8rem' }} />
              <col style={{ width: '6.5rem' }} />
            </colgroup>
            <thead>
              <tr className="text-[0.625rem] font-semibold tracking-wider uppercase" style={{ color: DASHBOARD_COLORS.textFaint }}>
                <th className="pb-1.5" />
                <th className="pb-1.5">Recurso</th>
                <th className="pb-1.5">Ambiente</th>
                <th className="pb-1.5">Status</th>
                <th className="pb-1.5 text-right">Verificado</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((incident) => {
                const TypeIcon = TYPE_ICONS[incident.type]
                return (
                  <tr key={incident.id} style={{ borderTop: `1px solid ${DASHBOARD_COLORS.border}` }}>
                    <td className="py-2" style={{ color: DASHBOARD_COLORS.textSubtle }} title={incident.type}>
                      <TypeIcon className="size-4" />
                    </td>
                    <td className="truncate py-2 font-medium" style={{ color: DASHBOARD_COLORS.text }} title={incident.name}>
                      {incident.name}
                    </td>
                    <td className="py-2 text-xs" style={{ color: DASHBOARD_COLORS.textSubtle }}>
                      {RESOURCE_ENVIRONMENT_LABELS[incident.environment]}
                    </td>
                    <td className="py-2">
                      <StatusBadge status={incident.status} />
                    </td>
                    <td className="py-2 text-right font-mono text-xs tabular-nums" style={{ color: DASHBOARD_COLORS.textSubtle }}>
                      {incident.status === 'offline' && incident.offlineSince
                        ? formatElapsed(new Date(incident.offlineSince).getTime(), now)
                        : TIME_FORMATTER.format(new Date(incident.lastCheckedAt))}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>

          {hiddenCount > 0 && (
            <p className="mt-auto pt-2 text-center text-xs" style={{ color: DASHBOARD_COLORS.textFaint }}>
              + {hiddenCount} recurso(s) adicional(is) com atenção necessária
            </p>
          )}
        </div>
      )}
    </div>
  )
}
