import { api } from '@/lib/axios'
import type { HistorySnapshot } from '@/types'

export async function getHistory(): Promise<HistorySnapshot[]> {
  const { data } = await api.get<HistorySnapshot[]>('/dashboard/history')
  return data
}
