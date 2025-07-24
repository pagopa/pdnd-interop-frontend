import { ERROR_DATA_DURATION_TIME } from '@/config/env'
import { create } from 'zustand'

type ErrorDataStoreType = {
  correlationId: string | null
  errorCode: string | null
  timeoutId: NodeJS.Timeout | null
  setErrorData: (correlationId: string, errorCode: string) => void
  clearErrorData: () => void
}

export const useErrorDataStore = create<ErrorDataStoreType>((set, get) => ({
  correlationId: null,
  errorCode: null,
  timeoutId: null,
  setErrorData: (correlationId: string, errorCode?: string) => {
    const currentTimeoutId = get().timeoutId
    if (currentTimeoutId) {
      clearTimeout(currentTimeoutId)
    }

    set({ correlationId, errorCode })

    const newTimeoutId = setTimeout(() => {
      get().clearErrorData()
    }, ERROR_DATA_DURATION_TIME)

    set({ timeoutId: newTimeoutId })
  },
  clearErrorData: () => {
    const currentTimeoutId = get().timeoutId
    if (currentTimeoutId) {
      clearTimeout(currentTimeoutId)
    }
    set({ correlationId: null, errorCode: null, timeoutId: null })
  },
}))

export const useErrorData = () => {
  const correlationId = useErrorDataStore((state) => state.correlationId)
  const errorCode = useErrorDataStore((state) => state.errorCode)
  const timeoutId = useErrorDataStore((state) => state.timeoutId)
  const setErrorData = useErrorDataStore((state) => state.setErrorData)
  const clearErrorData = useErrorDataStore((state) => state.clearErrorData)

  return {
    correlationId,
    errorCode,
    timeoutId,
    setErrorData,
    clearErrorData,
  }
}
