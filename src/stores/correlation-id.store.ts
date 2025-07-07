import { CLEAR_CORRELATION_ID_TIMEOUT } from '@/config/constants'
import { create } from 'zustand'

type CorrelationIdStoreType = {
  correlationId: string | null
  timeoutId: NodeJS.Timeout | null
  setCorrelationId: (correlationId: string) => void
  clearCorrelationId: () => void
}

export const useCorrelationIdStore = create<CorrelationIdStoreType>((set, get) => ({
  correlationId: null,
  timeoutId: null,
  setCorrelationId: (correlationId: string) => {
    const currentTimeoutId = get().timeoutId
    if (currentTimeoutId) {
      clearTimeout(currentTimeoutId)
    }

    set({ correlationId })

    const newTimeoutId = setTimeout(() => {
      get().clearCorrelationId()
      console.log('correlationId expired', Date.now(), correlationId)
    }, CLEAR_CORRELATION_ID_TIMEOUT)

    set({ timeoutId: newTimeoutId })
  },
  clearCorrelationId: () => {
    const currentTimeoutId = get().timeoutId
    if (currentTimeoutId) {
      clearTimeout(currentTimeoutId)
    }
    set({ correlationId: null, timeoutId: null })
  },
}))

export const useCorrelationId = () => {
  const correlationId = useCorrelationIdStore((state) => state.correlationId)
  const timeoutId = useCorrelationIdStore((state) => state.timeoutId)
  const setCorrelationId = useCorrelationIdStore((state) => state.setCorrelationId)
  const clearCorrelationId = useCorrelationIdStore((state) => state.clearCorrelationId)

  return {
    correlationId,
    timeoutId,
    setCorrelationId,
    clearCorrelationId,
  }
}
