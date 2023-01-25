import React from 'react'
import { AlertProps } from '@mui/material'
import { create } from 'zustand'

type ToastNotificationStoreType = {
  isShown: boolean
  message: string | React.ReactNode
  severity: AlertProps['severity']
  showToast: (message: string | React.ReactNode, severity: AlertProps['severity']) => void
  hideToast: () => void
}

export const useToastNotificationStore = create<ToastNotificationStoreType>((set) => ({
  isShown: false,
  message: '',
  severity: 'success',
  showToast: (message: string | React.ReactNode, severity: AlertProps['severity']) =>
    set(() => ({ message, severity, isShown: true })),
  hideToast: () => set({ isShown: false }),
}))

export const useToastNotification = () => {
  const showToast = useToastNotificationStore((state) => state.showToast)
  const hideToast = useToastNotificationStore((state) => state.hideToast)

  return { showToast, hideToast }
}
