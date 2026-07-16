import {
  DASHBOARD_COLORS,
  PANEL_SHADOW,
  RESOURCE_TYPE_LABELS_PLURAL,
  SECTION_TITLE_CLASSES,
  STATUS_CONFIG,
} from '@/constants'
import type { DashboardSummary, ResourceType } from '@/types'

import { ApiIcon, SiteIcon, WebServiceIcon } from './icons'
import { IconChip } from './IconChip'

export interface CategoryDistributionTableProps {
  summary: DashboardSummary
}

const TYPE_ORDER: ResourceType[] = ['api', 'web-service', 'site']

const TYPE_ICONS: Record<ResourceType, typeof ApiIcon> = {
  api: ApiIcon,
  'web-service': WebServiceIcon,
  site: SiteIcon,
}

function availabilityOf(online: number, total: number): number {
  return total > 0 ? Math.round((online / total) * 10_000) / 100 : 100
}

/**
 * Última linha da hierarquia — única fonte de "qual categoria foi
 * impactada". Formato de tabela (não cards empilhados), com barra de
 * disponibilidade por linha em vez de um gráfico separado. É a única
 * linha da página com `flex-1` (ver `DashboardPage`): absorve o espaço
 * vertical que sobrar, então a tabela (só 3 linhas) é centralizada
 * verticalmente dentro do card em vez de ficar presa ao topo com um
 * vazio embaixo — as linhas em si ficam mais altas (`py-3`) e as
 * barras mais espessas para aproveitar bem esse espaço extra.
 */
export function CategoryDistributionTable({ summary }: CategoryDistributionTableProps) {
  return (
    <div
      className="flex h-full flex-col gap-3 rounded-xl p-4"
      style={{
        backgroundColor: DASHBOARD_COLORS.surface,
        border: `1px solid ${DASHBOARD_COLORS.border}`,
        boxShadow: PANEL_SHADOW,
      }}
    >
      <p className={SECTION_TITLE_CLASSES} style={{ color: DASHBOARD_COLORS.textMuted }}>
        Distribuição por Categoria
      </p>

      <div className="flex min-h-0 flex-1 flex-col justify-center">
        <table className="w-full table-fixed border-separate border-spacing-0 text-left text-sm">
          <colgroup>
            <col style={{ width: '17%' }} />
            <col style={{ width: '0.5rem' }} />
            <col style={{ width: '3rem' }} />
            <col style={{ width: '3.5rem' }} />
            <col style={{ width: '3.75rem' }} />
            <col style={{ width: '5.75rem' }} />
            <col style={{ width: '6.75rem' }} />
            <col />
          </colgroup>
          <thead>
            <tr className="text-[0.6875rem] font-semibold tracking-wider uppercase" style={{ color: DASHBOARD_COLORS.textFaint }}>
              <th className="pb-3 font-semibold">Categoria</th>
              <th aria-hidden="true" className="pb-3" />
              <th className="pb-3 text-center font-semibold whitespace-nowrap">Total</th>
              <th className="pb-3 text-center font-semibold whitespace-nowrap">Online</th>
              <th className="pb-3 text-center font-semibold whitespace-nowrap">Offline</th>
              <th className="pb-3 text-center font-semibold whitespace-nowrap">Manutenção</th>
              <th className="pb-3 text-center font-semibold whitespace-nowrap">Desconhecidos</th>
              <th className="pb-3 pl-3 font-semibold whitespace-nowrap">Disponibilidade</th>
            </tr>
          </thead>
          <tbody>
            {TYPE_ORDER.map((type) => {
              const counts = summary.byType[type]
              const TypeIcon = TYPE_ICONS[type]
              const availability = availabilityOf(counts.online, counts.total)

              return (
                <tr key={type} style={{ borderTop: `1px solid ${DASHBOARD_COLORS.border}` }}>
                  <td className="py-3 align-middle">
                    <div className="flex items-center gap-1.5">
                      <IconChip>
                        <TypeIcon className="size-3.5" />
                      </IconChip>
                      <span className="font-semibold" style={{ color: DASHBOARD_COLORS.text }}>
                        {RESOURCE_TYPE_LABELS_PLURAL[type]}
                      </span>
                    </div>
                  </td>
                  <td aria-hidden="true" className="py-3" />
                  <td className="py-3 text-center align-middle font-mono tabular-nums" style={{ color: DASHBOARD_COLORS.text }}>
                    {counts.total}
                  </td>
                  <td className="py-3 text-center align-middle font-mono tabular-nums" style={{ color: STATUS_CONFIG.online.bright }}>
                    {counts.online}
                  </td>
                  <td className="py-3 text-center align-middle font-mono tabular-nums" style={{ color: STATUS_CONFIG.offline.bright }}>
                    {counts.offline}
                  </td>
                  <td className="py-3 text-center align-middle font-mono tabular-nums" style={{ color: STATUS_CONFIG.maintenance.bright }}>
                    {counts.maintenance}
                  </td>
                  <td className="py-3 text-center align-middle font-mono tabular-nums" style={{ color: STATUS_CONFIG.unknown.bright }}>
                    {counts.unknown}
                  </td>
                  <td className="py-3 pl-3 align-middle">
                    <div className="flex items-center gap-3">
                      <div
                        className="h-3.5 min-w-0 max-w-none flex-1 overflow-hidden rounded-full"
                        style={{ backgroundColor: DASHBOARD_COLORS.surfaceElevated }}
                      >
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${availability}%`,
                            backgroundColor:
                              availability >= 99
                                ? STATUS_CONFIG.online.bright
                                : availability >= 95
                                  ? STATUS_CONFIG.maintenance.bright
                                  : STATUS_CONFIG.offline.bright,
                            transition: 'width 700ms ease',
                          }}
                        />
                      </div>
                      <span
                        className="w-12 shrink-0 text-right font-mono text-xs tabular-nums"
                        style={{ color: DASHBOARD_COLORS.textSubtle }}
                      >
                        {availability.toLocaleString('pt-BR', { maximumFractionDigits: 2 })}%
                      </span>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
