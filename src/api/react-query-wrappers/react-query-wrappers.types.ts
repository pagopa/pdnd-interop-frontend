import {
  MutationFunction,
  QueryFunction,
  QueryKey,
  UseMutationOptions,
  UseMutationResult,
  UseQueryOptions,
  UseQueryResult,
} from '@tanstack/react-query'
import { useQueryWrapper } from './useQueryWrapper'

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

type MutationWrapperOptions<TData, TError, TVariables, TContext> = Omit<
  UseMutationOptions<TData, TError, TVariables, TContext>,
  'mutationFn'
> &
  OverlayConfig<TVariables> &
  SuccessNotificationConfig<TData, TVariables, TContext> &
  ErrorNotificationConfig<TVariables, TContext> &
  DialogConfig<TVariables>

type OverlayConfig<TVariables> =
  | {
      suppressLoadingOverlay?: boolean | undefined
      loadingLabel: string | ((variables: TVariables) => string)
    }
  | { suppressLoadingOverlay: true }

type SuccessNotificationConfig<TData, TVariables, TContext> =
  | {
      suppressSuccessToast?: boolean | undefined
      successToastLabel:
        | string
        | ((data: TData, variables: TVariables, context: TContext | undefined) => string)
    }
  | { suppressSuccessToast: true }

type ErrorNotificationConfig<TVariables, TContext> =
  | {
      suppressErrorToast?: boolean | undefined
      errorToastLabel: string | ((variables: TVariables, context: TContext | undefined) => string)
    }
  | { suppressErrorToast: true }

type DialogConfig<TVariables> = {
  showConfirmationDialog?: boolean
  dialogConfig?: {
    title: string | ((variables: TVariables) => string)
    description: string | ((variables: TVariables) => string)
    proceedLabel?: string
  }
}

export type UseMutationWrapper = <
  TData = unknown,
  TError = unknown,
  TVariables = void,
  TContext = unknown
>(
  mutationFn: MutationFunction<TData, TVariables>,
  options: MutationWrapperOptions<TData, TError, TVariables, TContext>
) => UseMutationResult<TData, TError, TVariables, TContext>

export type UseQueryWrapperOptions<TData> = Parameters<
  typeof useQueryWrapper<TData, unknown, TData, any>
>[2]

export type Paginated<T> = {
  results: Array<T>
  pagination: {
    offset: number
    limit: number
    totalCount: number
  }
}
