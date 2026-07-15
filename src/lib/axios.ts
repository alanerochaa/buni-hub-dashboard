import Axios from 'axios'

import { env } from '@/config/env'

import { resolveApiErrorMessage } from './apiErrorMessage'

export const api = Axios.create({
  baseURL: env.apiBaseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
})

/**
 * Tratamento global de erros de API: toda resposta com falha passa
 * por aqui uma única vez, que resolve a mensagem amigável (ver
 * lib/apiErrorMessage.ts) e a anexa ao próprio erro antes de propagar
 * — quem consome (getErrorMessage) só lê o resultado já pronto, sem
 * recalcular nem duplicar a lógica de interpretação por status HTTP.
 */
api.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (error && typeof error === 'object') {
      Object.assign(error, { friendlyMessage: resolveApiErrorMessage(error) })
    }
    return Promise.reject(error)
  },
)
