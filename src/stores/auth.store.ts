import { STORAGE_KEY_SESSION_TOKEN } from '@/config/constants'
import { create } from 'zustand'

type AuthStoreType = {
  sessionToken: string | null
  setSessionToken: (token: string) => void
  clearSessionToken: VoidFunction
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
}))

export const useAuth = () => {
  const setSessionToken = useAuthStore((state) => state.setSessionToken)
  const clearSessionToken = useAuthStore((state) => state.clearSessionToken)
  const sessionToken = useAuthStore((state) => state.sessionToken)

  return { sessionToken, setSessionToken, clearSessionToken }
}
