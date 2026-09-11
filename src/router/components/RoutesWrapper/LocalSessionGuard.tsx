import React from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Navigate, useLocation } from 'react-router-dom'
import { AuthQueries, AuthServices } from '@/api/auth'
import { FirstLoadingSpinner } from '@/components/shared/FirstLoadingSpinner'

export const LocalSessionGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const queryClient = useQueryClient()
  const { pathname } = useLocation()
  const selectionPath = `/${pathname.startsWith('/en/') ? 'en' : 'it'}/local-identity-selection/`
  const { data, isPending, isError } = useQuery({
    ...AuthQueries.getSessionToken(),
    retry: true,
    retryDelay: 2000,
    throwOnError: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  })

  React.useEffect(() => {
    if (!data) return
    const controller = new AbortController()
    let checking = false
    let retryTimeout: ReturnType<typeof setTimeout> | undefined

    const checkSession = async () => {
      if (checking || document.visibilityState === 'hidden' || controller.signal.aborted) return
      clearTimeout(retryTimeout)
      checking = true
      try {
        const token = await AuthServices.getSessionToken(controller.signal)
        if (controller.signal.aborted) return
        if (token === data) {
          void queryClient.refetchQueries({ type: 'active', stale: true })
          return
        }
        // Reload only when the identity changed: discard queries and component state
        // from the previous environment, without disrupting normal focus changes.
        queryClient.clear()
        if (token) window.location.reload()
        else window.location.replace(`/ui${selectionPath}`)
      } catch {
        if (!controller.signal.aborted) retryTimeout = setTimeout(checkSession, 2000)
      } finally {
        checking = false
      }
    }

    window.addEventListener('focus', checkSession)
    window.addEventListener('online', checkSession)
    document.addEventListener('visibilitychange', checkSession)
    return () => {
      controller.abort()
      clearTimeout(retryTimeout)
      window.removeEventListener('focus', checkSession)
      window.removeEventListener('online', checkSession)
      document.removeEventListener('visibilitychange', checkSession)
    }
  }, [data, queryClient, selectionPath])

  if (isPending || isError) return <FirstLoadingSpinner />
  if (!data) return <Navigate to={selectionPath} replace />
  return <>{children}</>
}
