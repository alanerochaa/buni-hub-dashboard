import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

import { queryClient } from '@/lib/queryClient'
import { DashboardPage } from '@/pages/DashboardPage'

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <DashboardPage />
      {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  )
}
