import React from 'react'

/**
 * Returns the props needed to make an input accessible.
 * @param label The label of the input (if any).
 * @param infoLabel The info label of the input (if any).
 * @param error The error of the input (if any).
 *
 * @returns the ids that should be used in the input and the input text helpers,
 * and the props that should be passed to the input (aria-describedby and aria-labelledby)
 */
export function useGetInputAriaProps({
  label,
  infoLabel,
  error,
}: {
  label?: string
  infoLabel?: string
  error?: string
}) {
  const labelId = React.useId()
  const infoLabelId = React.useId()
  const errorId = React.useId()

  const getAriaDescribedBy = () => {
    if (!infoLabel && !error) return undefined
    const ids = []
    if (infoLabel) ids.push(infoLabelId)
    if (error) ids.push(errorId)
    return ids.join(' ')
  }

  const getAriaLabelledBy = () => {
    if (!label) return undefined
    return labelId
  }

  return {
    ids: {
      labelId,
      infoLabelId,
      errorId,
    },
    inputAriaProps: {
      'aria-describedby': getAriaDescribedBy(),
      'aria-labelledby': getAriaLabelledBy(),
    },
  }
}
