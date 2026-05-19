import '@tanstack/react-query'

declare module '@tanstack/react-query' {
  interface ConfirmationDialogMeta {
    title: string | ((variables: unknown) => string)
    description?: string | ((variables: unknown) => string)
    descriptionLink?: {
      href: string
    }
    proceedLabel?: string
    checkbox?: string
  }

  interface MutationMeta {
    loadingLabel?: string | ((variables: unknown) => string)
    successToastLabel?: string | ((data: unknown, variables: unknown, context: unknown) => string)
    errorToastLabel?: string | ((error: unknown, variables: unknown, context: unknown) => string)
    confirmationDialog?: ConfirmationDialogMeta | Array<ConfirmationDialogMeta>
  }

  interface Register {
    mutationMeta: MutationMeta
  }
}
