import axios from 'axios'

import {
  DEFAULT_ERROR_MESSAGE,
  HTTP_STATUS_MESSAGES,
  NETWORK_ERROR_MESSAGE,
  TIMEOUT_ERROR_MESSAGE,
} from './httpStatusMessages'

interface ApiErrorBody {
  status?: number
  code?: string
  message?: string
}

/**
 * Fonte única de verdade para "qual mensagem mostrar ao usuário" —
 * nunca "Request failed with status code 409", "AxiosError" ou
 * "Network Error". Prioridade: mensagem do Backend (envelope
 * { status, code, message } de errorHandler.ts) > mapa genérico por
 * status HTTP > mensagem padrão. Chamada pelo interceptor global em
 * lib/axios.ts (uma vez por erro) e por getErrorMessage.
 */
export function resolveApiErrorMessage(error: unknown): string {
  if (!axios.isAxiosError(error)) {
    return DEFAULT_ERROR_MESSAGE
  }

  if (error.code === 'ECONNABORTED' || /timeout/i.test(error.message)) {
    return TIMEOUT_ERROR_MESSAGE
  }

  if (!error.response) {
    return NETWORK_ERROR_MESSAGE
  }

  const body = error.response.data as ApiErrorBody | undefined
  if (typeof body?.message === 'string' && body.message.trim()) {
    return body.message
  }

  return HTTP_STATUS_MESSAGES[error.response.status] ?? DEFAULT_ERROR_MESSAGE
}
