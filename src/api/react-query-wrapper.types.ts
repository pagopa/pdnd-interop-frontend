import {
  MutationFunction,
  QueryFunction,
  QueryKey,
  UseMutationOptions,
  UseMutationResult,
  UseQueryOptions,
  UseQueryResult,
} from '@tanstack/react-query'

// export type UseQueryWrapper = <
//   TQueryFnData = unknown,
//   TError = unknown,
//   TData = TQueryFnData,
//   TQueryKey extends QueryKey = QueryKey
// >(
//   key: TQueryKey,
//   queryFn: QueryFunction<TQueryFnData, TQueryKey>,
//   options?: Omit<
//     UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>,
//     'queryKey' | 'queryFn' | 'initialData'
//   > & {
//     initialData?: () => undefined
//   } & {
//     skipJwtSessionExpirationCheck?: boolean
//   }
// ) => UseQueryResult<TData, TError>

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
    skipJwtSessionExpirationCheck?: boolean
  }
) => UseQueryResult<TData, TError>

type MutationWrapperOptions<TData, TError, TVariables, TContext> = Omit<
  UseMutationOptions<TData, TError, TVariables, TContext>,
  'mutationFn'
> &
  OverlayConfig &
  SuccessNotificationConfig &
  ErrorNotificationConfig &
  DialogConfig

type OverlayConfig =
  | {
      suppressLoadingOverlay?: false | undefined
      loadingLabel: string
    }
  | { suppressLoadingOverlay: true }

type SuccessNotificationConfig =
  | {
      suppressSuccessToast?: false | undefined
      successToastLabel: string
    }
  | { suppressSuccessToast: true }

type ErrorNotificationConfig =
  | {
      suppressErrorToast?: false | undefined
      errorToastLabel: string
    }
  | { suppressErrorToast: true }

type DialogConfig =
  | {
      showConfirmationDialog?: false | undefined
    }
  | {
      showConfirmationDialog: true
      dialogConfig: {
        title: string
        description: string
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
