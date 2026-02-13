import { Alert } from '@mui/material'
import React from 'react'

interface GreyAlertProps {
  children: React.ReactNode
}

export const GreyAlert: React.FC<GreyAlertProps> = ({ children }) => {
  return (
    <Alert icon={false} sx={{ p: 2, borderLeftColor: 'grey.700', backgroundColor: 'grey.50' }}>
      {children}
    </Alert>
  )
}
