import { api } from '@/lib/axios'
import type { DashboardResponse } from '@/types'

export async function getDashboard(): Promise<DashboardResponse> {
  const { data } = await api.get<DashboardResponse>('/dashboard')
  return data
}
