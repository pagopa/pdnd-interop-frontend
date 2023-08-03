import type {
  QueryFunction,
  QueryKey,
  UseQueryOptions,
  UseQueryResult,
} from '@tanstack/react-query'
import type { useQueryWrapper } from './useQueryWrapper'

export type UseQueryWrapper = <
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey
>(
  queryKey: TQueryKey,
  queryFn: QueryFunction<TQueryFnData, TQueryKey>,
  options?: Omit<
    UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>,
    'queryKey' | 'queryFn' | 'initialData'
  > & {
    initialData?: () => undefined
  } & {
    skipThrowOn404Error?: boolean
  }
) => UseQueryResult<TData, TError>

export type UseQueryWrapperOptions<TData> = Parameters<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  typeof useQueryWrapper<TData, unknown, TData, any>
>[2]
