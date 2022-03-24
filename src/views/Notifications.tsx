import React from 'react'
import { Alert } from '@mui/material'
import { StyledIntro } from '../components/Shared/StyledIntro'

export function Notifications() {
  return (
    <React.Fragment>
      <StyledIntro>{{ title: 'Notifiche' }}</StyledIntro>
      <Alert severity="info">Le funzionalità di notifica sono attualmente in sviluppo</Alert>
    </React.Fragment>
  )
}
