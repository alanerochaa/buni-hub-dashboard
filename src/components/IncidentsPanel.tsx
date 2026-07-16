import { useMemo } from 'react'

import {
  DASHBOARD_COLORS,
  INCIDENT_STATUS_ORDER,
  PANEL_SHADOW,
  RESOURCE_ENVIRONMENT_LABELS,
  RESOURCE_TYPE_LABELS,
  SECTION_TITLE_CLASSES,
  STATUS_CONFIG,
} from '@/constants'
import type { DashboardIncident, ResourceType } from '@/types'
import { formatElapsed } from '@/utils/formatElapsed'

import { ApiIcon, ShieldCheckIcon, SiteIcon, WebServiceIcon } from './icons'
import { IconChip } from './IconChip'

export interface IncidentsPanelProps {
  incidents: DashboardIncident[]
  now: number
  className?: string
}

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
      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold"
      style={{ color: config.bright, backgroundColor: `${config.base}1f`, border: `1px solid ${config.base}40` }}
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
 * Item 5 da hierarquia — o principal componente operacional. Modo TV:
 * sem rolagem, nunca. A altura do card é dada pelo Grid da página (ver
 * `DashboardPage`) — normalmente definida pelo `HistoryPanel` ao lado,
 * já que a tabela costuma ser mais baixa (poucos incidentes). Por isso
 * o conteúdo é centralizado verticalmente (`justify-center`) em vez de
 * esticado do topo: com poucas linhas, sobra espaço acima/abaixo da
 * tabela — centralizar looks deliberado; esticar a tabela deixaria um
 * vazio grande só embaixo. `overflow-hidden` continua como rede de
 * segurança para um número atípico de incidentes (corta em vez de
 * rolar), não como comportamento normal.
 */
export function IncidentsPanel({ incidents, now, className = '' }: IncidentsPanelProps) {
  const sorted = useMemo(() => sortForDisplay(incidents), [incidents])

  return (
    <div
      className={`flex min-h-0 flex-col gap-2 overflow-hidden rounded-xl p-4 ${className}`}
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
        <div className="flex min-h-0 flex-1 flex-col justify-center overflow-hidden">
          <table className="w-full table-fixed border-separate border-spacing-0 text-left">
            <colgroup>
              <col style={{ width: '2.25rem' }} />
              <col />
              <col style={{ width: '7rem' }} />
              <col style={{ width: '7.5rem' }} />
              <col style={{ width: '7.5rem' }} />
              <col style={{ width: '6.5rem' }} />
            </colgroup>
            <thead>
              <tr className="text-[0.625rem] font-semibold tracking-wider uppercase" style={{ color: DASHBOARD_COLORS.textFaint }}>
                <th className="pb-2" />
                <th className="pb-2">Recurso</th>
                <th className="pb-2">Tipo</th>
                <th className="pb-2">Ambiente</th>
                <th className="pb-2">Status</th>
                <th className="pb-2 text-right">Tempo</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((incident) => {
                const TypeIcon = TYPE_ICONS[incident.type]
                return (
                  <tr key={incident.id} style={{ borderTop: `1px solid ${DASHBOARD_COLORS.border}` }}>
                    <td className="py-2.5" title={incident.type}>
                      <IconChip size="sm">
                        <TypeIcon className="size-3" />
                      </IconChip>
                    </td>
                    <td className="truncate py-2.5 text-sm font-semibold" style={{ color: DASHBOARD_COLORS.text }} title={incident.name}>
                      {incident.name}
                    </td>
                    <td className="py-2.5">
                      <span className="inline-flex items-center gap-1.5 text-xs" style={{ color: DASHBOARD_COLORS.textSubtle }}>
                        <TypeIcon className="size-3" />
                        {RESOURCE_TYPE_LABELS[incident.type]}
                      </span>
                    </td>
                    <td className="py-2.5 text-xs" style={{ color: DASHBOARD_COLORS.textSubtle }}>
                      {RESOURCE_ENVIRONMENT_LABELS[incident.environment]}
                    </td>
                    <td className="py-2.5">
                      <StatusBadge status={incident.status} />
                    </td>
                    <td className="py-2.5 text-right font-mono text-xs tabular-nums" style={{ color: DASHBOARD_COLORS.textSubtle }}>
                      {incident.status === 'offline' && incident.offlineSince
                        ? formatElapsed(new Date(incident.offlineSince).getTime(), now)
                        : TIME_FORMATTER.format(new Date(incident.lastCheckedAt))}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
