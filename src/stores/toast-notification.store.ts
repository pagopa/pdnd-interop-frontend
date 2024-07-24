import type React from 'react'
import type { AlertProps } from '@mui/material'
import { create } from 'zustand'

type ToastNotificationStoreType = {
  isShown: boolean
  message: string | React.ReactNode
  severity: AlertProps['severity']
  correlationId?: string
  showToast: (
    message: string | React.ReactNode,
    severity: AlertProps['severity'],
    correlationId?: string
  ) => void
  hideToast: () => void
}

export const useToastNotificationStore = create<ToastNotificationStoreType>((set) => ({
  isShown: false,
  message: '',
  severity: 'success',
  showToast: (
    message: string | React.ReactNode,
    severity: AlertProps['severity'],
    correlationId?: string
  ) => set(() => ({ message, severity, isShown: true, correlationId })),
  hideToast: () => set({ isShown: false }),
}))

export const useToastNotification = () => {
  const showToast = useToastNotificationStore((state) => state.showToast)
  const hideToast = useToastNotificationStore((state) => state.hideToast)

  return { showToast, hideToast }
}
