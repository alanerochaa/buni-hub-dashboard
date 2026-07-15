import { useEffect, useState } from 'react'

/**
 * Relógio local ao segundo — independente do polling de 30s dos dados
 * (o Painel Operacional precisa exibir a hora atual sempre em
 * movimento, mesmo entre uma atualização e outra da API).
 */
export function useClock(): Date {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(interval)
  }, [])

  return now
}
