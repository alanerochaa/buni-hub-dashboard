import axios from 'axios'

import { resolveApiErrorMessage } from './apiErrorMessage'

/**
 * Mensagem amigável para exibir ao usuário — nunca texto técnico.
 * O interceptor global (lib/axios.ts) já resolve e anexa
 * `friendlyMessage` a todo erro de requisição; esta função só lê esse
 * resultado (ou recalcula, para erros que não passaram pelo axios).
 * `fallback` só é usado no caso raro de um erro que não é do Axios
 * (ex.: exceção síncrona local) — para erros de API, a mensagem do
 * Backend ou o mapa por status HTTP sempre têm prioridade.
 */
export function getErrorMessage(error: unknown, fallback?: string): string {
  if (axios.isAxiosError(error)) {
    const withFriendlyMessage = error as { friendlyMessage?: string }
    return withFriendlyMessage.friendlyMessage ?? resolveApiErrorMessage(error)
  }
  return fallback ?? resolveApiErrorMessage(error)
}
