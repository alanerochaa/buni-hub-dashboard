import axios from 'axios'

import { resolveApiErrorMessage } from './apiErrorMessage'

export function getErrorMessage(error: unknown, fallback?: string): string {
  if (axios.isAxiosError(error)) {
    const withFriendlyMessage = error as { friendlyMessage?: string }
    return withFriendlyMessage.friendlyMessage ?? resolveApiErrorMessage(error)
  }
  return fallback ?? resolveApiErrorMessage(error)
}
