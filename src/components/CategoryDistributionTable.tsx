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

function toneFor(availability: number): string {
  if (availability >= 99) return STATUS_CONFIG.online.bright
  if (availability >= 95) return STATUS_CONFIG.maintenance.bright
  return STATUS_CONFIG.offline.bright
}

function CategoryCountItem({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="size-1.5 shrink-0 rounded-full" style={{ backgroundColor: color }} aria-hidden="true" />
      <span className="font-mono text-xs tabular-nums" style={{ color: DASHBOARD_COLORS.textSubtle }}>
        <span className="font-semibold" style={{ color: DASHBOARD_COLORS.text }}>
          {value}
        </span>{' '}
        {label}
      </span>
    </div>
  )
}

interface CategoryCardProps {
  type: ResourceType
  counts: DashboardSummary['byType'][ResourceType]
}

function CategoryCard({ type, counts }: CategoryCardProps) {
  const TypeIcon = TYPE_ICONS[type]
  const availability = availabilityOf(counts.online, counts.total)
  const color = toneFor(availability)

  return (
    <div
      className="flex h-full flex-col gap-2.5 rounded-xl p-3"
      style={{ backgroundColor: DASHBOARD_COLORS.surfaceElevated }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <IconChip>
            <TypeIcon className="size-3.5" />
          </IconChip>
          <span className="font-semibold" style={{ color: DASHBOARD_COLORS.text }}>
            {RESOURCE_TYPE_LABELS_PLURAL[type]}
          </span>
        </div>
        <span className="font-mono text-xs tabular-nums" style={{ color: DASHBOARD_COLORS.textFaint }}>
          {counts.total} total
        </span>
      </div>

      <div className="flex flex-col gap-1">
        <div className="flex items-baseline justify-between">
          <span className="text-xs font-medium" style={{ color: DASHBOARD_COLORS.textMuted }}>
            Disponibilidade
          </span>
          <span className="font-mono text-2xl leading-none font-bold tabular-nums" style={{ color }}>
            {availability.toLocaleString('pt-BR', { maximumFractionDigits: 2 })}%
          </span>
        </div>

        <div className="h-2.5 overflow-hidden rounded-full" style={{ backgroundColor: DASHBOARD_COLORS.surfaceSunken }}>
          <div
            className="h-full rounded-full"
            style={{ width: `${availability}%`, backgroundColor: color, transition: 'width 700ms ease' }}
          />
        </div>
      </div>

      <div className="mt-auto grid grid-cols-2 gap-x-3 gap-y-1.5 pt-1">
        <CategoryCountItem label="Online" value={counts.online} color={STATUS_CONFIG.online.bright} />
        {counts.offline > 0 && (
          <CategoryCountItem label="Offline" value={counts.offline} color={STATUS_CONFIG.offline.bright} />
        )}
        {counts.maintenance > 0 && (
          <CategoryCountItem label="Manutenção" value={counts.maintenance} color={STATUS_CONFIG.maintenance.bright} />
        )}
        {counts.unknown > 0 && (
          <CategoryCountItem label="Desconhecidos" value={counts.unknown} color={STATUS_CONFIG.unknown.bright} />
        )}
      </div>
    </div>
  )
}

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

      <div className="grid min-h-0 flex-1 grid-cols-3 gap-3">
        {TYPE_ORDER.map((type) => (
          <CategoryCard key={type} type={type} counts={summary.byType[type]} />
        ))}
      </div>
    </div>
  )
}
