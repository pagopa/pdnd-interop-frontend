import {
  type QueryFunction,
  type UseQueryOptions,
  useQuery,
  type QueryKey,
} from '@tanstack/react-query'
import { useJwt } from '@/hooks/useJwt'

/**
 * This hook is a wrapper around react-query's useQuery hook.
 * It will only execute the query if the user is authenticated.
 * The user is considered authenticated if the jwt is thruty.
 */
export const useAuthenticatedQuery = <
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey
>(
  queryKey: TQueryKey,
  queryFn: QueryFunction<TQueryFnData, TQueryKey>,
  options?: UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>
) => {
  const { jwt } = useJwt()

  return useQuery({
    ...options,
    queryKey: queryKey,
    queryFn: queryFn,
    enabled: !!jwt && (options?.enabled ?? true),
  })
}
