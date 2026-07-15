import { useQuery } from '@tanstack/react-query'

import { getErrorMessage } from '@/lib/errors'
import { getDashboard } from '@/services/dashboard.service'
import type { DashboardResponse } from '@/types'

const POLL_INTERVAL_MS = 30_000

export interface UseDashboardResult {
  data: DashboardResponse | undefined
  isLoading: boolean
  error: string | null
  dataUpdatedAt: number
}

/**
 * Polling fixo de 30s via `refetchInterval` do React Query — não
 * depende de o usuário interagir com a página (é o próprio requisito
 * do modo TV: nenhuma ação manual necessária). `refetchIntervalInBackground`
 * garante que o polling continua mesmo com a aba em segundo plano, já
 * que este painel normalmente fica ligado numa TV, não numa aba ativa.
 */
export function useDashboard(): UseDashboardResult {
  const query = useQuery({
    queryKey: ['dashboard'],
    queryFn: getDashboard,
    refetchInterval: POLL_INTERVAL_MS,
    refetchIntervalInBackground: true,
  })

  return {
    data: query.data,
    isLoading: query.isLoading,
    error: query.isError
      ? getErrorMessage(query.error, 'Não foi possível carregar o Painel Operacional.')
      : null,
    dataUpdatedAt: query.dataUpdatedAt,
  }
}
