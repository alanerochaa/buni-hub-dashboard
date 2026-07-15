/**
 * Espelha api/src/types/dashboard.type.ts — duplicado de propósito
 * (dashboard/ e api/ são projetos Node independentes, sem pacote
 * compartilhado).
 */
export type ResourceType = 'api' | 'web-service' | 'site'
export type ResourceEnvironment = 'homologacao' | 'producao' | 'desenvolvimento' | 'unknown'

export type DashboardResourceStatus = 'online' | 'offline' | 'maintenance' | 'unknown'

export interface DashboardCategoryCounts {
  total: number
  online: number
  offline: number
  maintenance: number
  unknown: number
}

export interface DashboardSummary {
  total: number
  online: number
  offline: number
  maintenance: number
  unknown: number
  availabilityPercentage: number
  byType: Record<ResourceType, DashboardCategoryCounts>
  lastSweepAt: string | null
}

export interface DashboardIncident {
  id: string
  name: string
  type: ResourceType
  environment: ResourceEnvironment
  status: DashboardResourceStatus
  lastCheckedAt: string
  offlineSince?: string
}

export interface DashboardResponse {
  summary: DashboardSummary
  incidents: DashboardIncident[]
}
