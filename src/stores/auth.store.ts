import { STORAGE_KEY_SESSION_TOKEN } from '@/config/constants'
import { create } from 'zustand'

type AuthStoreType = {
  sessionToken: string | null
  setSessionToken: (token: string) => void
  clearSessionToken: VoidFunction
  isLoadingSessionToken: boolean
  setIsLoadingSessionToken: (isLoading: boolean) => void
}

export const useAuthStore = create<AuthStoreType>((set) => ({
  sessionToken: null,
  setSessionToken: (sessionToken: string) =>
    set(() => {
      localStorage.setItem(STORAGE_KEY_SESSION_TOKEN, sessionToken)
      return { sessionToken }
    }),
  clearSessionToken: () =>
    set(() => {
      localStorage.removeItem(STORAGE_KEY_SESSION_TOKEN)
      return { sessionToken: null }
    }),
  isLoadingSessionToken: true,
  setIsLoadingSessionToken: (isLoadingSessionToken: boolean) => set({ isLoadingSessionToken }),
}))

export const useAuth = () => {
  const sessionToken = useAuthStore((state) => state.sessionToken)
  const setSessionToken = useAuthStore((state) => state.setSessionToken)
  const clearSessionToken = useAuthStore((state) => state.clearSessionToken)
  const isLoadingSessionToken = useAuthStore((state) => state.isLoadingSessionToken)
  const setIsLoadingSessionToken = useAuthStore((state) => state.setIsLoadingSessionToken)

  return {
    sessionToken,
    setSessionToken,
    clearSessionToken,
    isLoadingSessionToken,
    setIsLoadingSessionToken,
  }
}
