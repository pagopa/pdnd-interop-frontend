import { queryOptions } from '@tanstack/react-query'
import { AuthServices } from './auth.services'
import { STAGE } from '@/config/env'

function getSessionToken() {
  return queryOptions({
    queryKey: ['AuthGetSessionToken'],
    queryFn: AuthServices.getSessionToken,
    staleTime: Infinity,
    gcTime: Infinity,
    retry: false,
  })
}

function getBlacklist() {
  return queryOptions({
    queryKey: ['AuthGetBlacklist'],
    queryFn: AuthServices.getBlacklist,
    enabled: STAGE === 'PROD',
    throwOnError: false,
    staleTime: Infinity,
    gcTime: Infinity,
    retry: false,
  })
}

export const AuthQueries = {
  getSessionToken,
  getBlacklist,
}
