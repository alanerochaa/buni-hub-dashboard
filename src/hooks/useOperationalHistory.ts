import { useQuery } from '@tanstack/react-query'

import { getErrorMessage } from '@/lib/errors'
import { getHistory } from '@/services/history.service'
import type { AvailabilityPoint } from '@/types'

const POLL_INTERVAL_MS = 30_000

export interface UseOperationalHistoryResult {
  points: AvailabilityPoint[]
  isLoading: boolean
  error: string | null
}

/**
 * Histórico Operacional — substitui o antigo histórico de sessão
 * (acumulado em memória do navegador, perdido a cada reload). Os
 * snapshots já vêm persistidos e prontos do Backend (`GET
 * /dashboard/history`); este hook só mapeia `HistorySnapshot` para o
 * formato que `HistoryPanel` já consumia (`AvailabilityPoint`), sem
 * alterar o componente visual. Mesmo padrão de polling de
 * `useDashboard` — dados de servidor, não client-side.
 */
export function useOperationalHistory(): UseOperationalHistoryResult {
  const query = useQuery({
    queryKey: ['dashboard', 'history'],
    queryFn: getHistory,
    refetchInterval: POLL_INTERVAL_MS,
    refetchIntervalInBackground: true,
  })

  const points: AvailabilityPoint[] =
    query.data?.map((snapshot) => ({
      timestamp: new Date(snapshot.timestamp).getTime(),
      value: snapshot.availabilityPercentage,
    })) ?? []

  return {
    points,
    isLoading: query.isLoading,
    error: query.isError
      ? getErrorMessage(query.error, 'Não foi possível carregar o histórico operacional.')
      : null,
  }
}
