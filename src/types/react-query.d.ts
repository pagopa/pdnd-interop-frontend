import '@tanstack/react-query'

declare module '@tanstack/react-query' {
  interface MutationMeta<
    TData = unknown,
    TError = unknown,
    TVariables = unknown,
    TContext = unknown,
  > {
    loadingLabel?: string | ((variables: TVariables) => string)
    successToastLabel?: string | ((data: TData, variables: TVariables, context: TContext) => string)
    errorToastLabel?: string | ((error: TError, variables: TVariables, context: TContext) => string)
    confirmationDialog?: {
      title: string | ((variables: TVariables) => string)
      description?: string | ((variables: TVariables) => string)
      proceedLabel?: string
      checkbox?: string
    }
  }
}
