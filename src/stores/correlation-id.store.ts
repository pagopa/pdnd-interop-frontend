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
    console.log('correlationId setting', Date.now(), correlationId)
    const currentTimeoutId = get().timeoutId
    if (currentTimeoutId) {
      clearTimeout(currentTimeoutId)
    }

    set({ correlationId })

    const newTimeoutId = setTimeout(() => {
      get().clearCorrelationId()
      console.log('correlationId expired', Date.now(), correlationId)
    }, 10000)

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
