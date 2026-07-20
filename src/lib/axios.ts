import Axios from 'axios'

import { env } from '@/config/env'

import { resolveApiErrorMessage } from './apiErrorMessage'

export const api = Axios.create({
  baseURL: env.apiBaseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (error && typeof error === 'object') {
      Object.assign(error, { friendlyMessage: resolveApiErrorMessage(error) })
    }
    return Promise.reject(error)
  },
)
