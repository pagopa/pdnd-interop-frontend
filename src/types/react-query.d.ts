import '@tanstack/react-query'

interface MutationMeta {
  loadingLabel?: string | ((variables: unknown) => string)
  successToastLabel?: string | ((data: unknown, variables: unknown, context: unknown) => string)
  errorToastLabel?: string | ((error: unknown, variables: unknown, context: unknown) => string)
  confirmationDialog?: {
    title: string | ((variables: unknown) => string)
    description?: string | ((variables: unknown) => string)
    proceedLabel?: string
    checkbox?: string
  }
}

declare module '@tanstack/react-query' {
  interface Register {
    queryMeta: Meta
    mutationMeta: MutationMeta
  }
}
