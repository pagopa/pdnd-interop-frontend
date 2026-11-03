import React from 'react'
import isEqual from 'lodash/isEqual'
import { useFormState, useWatch } from 'react-hook-form'
import type { Control, FieldValues } from 'react-hook-form'

type PageContainerFormDirtyStateContextValue = {
  updateOwner: (ownerId: string, stepKey: string | number | undefined, isDirty: boolean) => void
  unregisterOwner: (ownerId: string) => void
  stepKey: string | number | undefined
}

export const PageContainerFormDirtyStateContext =
  React.createContext<PageContainerFormDirtyStateContextValue>({
    updateOwner: () => {},
    unregisterOwner: () => {},
    stepKey: undefined,
  })

export const usePageContainerFormDirtyState = <TFieldValues extends FieldValues>(
  control: Control<TFieldValues>
) => {
  const { updateOwner, unregisterOwner, stepKey } = React.useContext(
    PageContainerFormDirtyStateContext
  )
  const ownerId = React.useId()
  const { isDirty, defaultValues } = useFormState({ control })
  const values = useWatch({ control })
  const hasUnsavedChanges = isDirty || !isEqual(values, defaultValues)

  React.useEffect(() => {
    updateOwner(ownerId, stepKey, hasUnsavedChanges)
  }, [hasUnsavedChanges, ownerId, stepKey, updateOwner])

  React.useEffect(() => () => unregisterOwner(ownerId), [ownerId, unregisterOwner])
}
