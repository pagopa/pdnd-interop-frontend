import React from 'react'

/**
 * This is an utility hook to manage the drawer state.
 *
 * @returns An object containing the drawer state and the functions to open and close it.
 */
export function useDrawerState() {
  const [isOpen, setIsOpen] = React.useState(false)

  const openDrawer = React.useCallback(() => setIsOpen(true), [])
  const closeDrawer = React.useCallback(() => setIsOpen(false), [])

  return { isOpen, openDrawer, closeDrawer }
}
