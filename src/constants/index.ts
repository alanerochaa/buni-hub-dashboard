import type { DashboardResourceStatus, ResourceEnvironment, ResourceType } from '../types'

export const DASHBOARD_COLORS = {
  bg: '#0B0F17',
  surface: '#131A24',
  surfaceElevated: '#1B2432',
  surfaceSunken: '#0E131C',
  border: 'rgba(255,255,255,0.07)',
  borderStrong: 'rgba(255,255,255,0.14)',
  text: '#E7E9ED',
  textMuted: '#9AA3B0',
  textSubtle: '#8892A2',
  textFaint: '#5B6472',
} as const

export const PANEL_SHADOW =
  '0 1px 0 0 rgba(255,255,255,0.04) inset, 0 12px 32px -16px rgba(0,0,0,0.6)'

export const SECTION_TITLE_CLASSES = 'text-sm font-semibold'


export const STATUS_CONFIG: Record<
  DashboardResourceStatus,
  { label: string; base: string; bright: string }
> = {
  online: { label: 'Online', base: '#1F7A5C', bright: '#3FB88A' },
  offline: { label: 'Offline', base: '#B91C1C', bright: '#F0645C' },
  maintenance: { label: 'Em Manutenção', base: '#A66A1E', bright: '#E0A63E' },
  unknown: { label: 'Desconhecido', base: '#64748B', bright: '#94A3B8' },
}

export const INCIDENT_STATUS_ORDER: DashboardResourceStatus[] = [
  'offline',
  'maintenance',
  'unknown',
]

export const STATUS_CHART_ORDER: DashboardResourceStatus[] = [
  'online',
  'offline',
  'maintenance',
  'unknown',
]

export const RESOURCE_TYPE_LABELS: Record<ResourceType, string> = {
  api: 'API',
  'web-service': 'Web Service',
  site: 'Site',
}

export const RESOURCE_TYPE_LABELS_PLURAL: Record<ResourceType, string> = {
  api: 'APIs',
  'web-service': 'Web Services',
  site: 'Sites',
}

export const RESOURCE_ENVIRONMENT_LABELS: Record<ResourceEnvironment, string> = {
  homologacao: 'Homologação',
  producao: 'Produção',
  desenvolvimento: 'Desenvolvimento',
  unknown: 'Desconhecido',
}

export const RESOURCE_ENVIRONMENT_SHORT_LABELS: Record<ResourceEnvironment, string> = {
  homologacao: 'HML',
  producao: 'PRD',
  desenvolvimento: 'DEV',
  unknown: '—',
}
