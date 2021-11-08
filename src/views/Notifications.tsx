import React, { useState } from 'react'
import { Info as InfoIcon, Warning as WarningIcon } from '@mui/icons-material'
import { Typography } from '@mui/material'
import { Box } from '@mui/system'
import { StyledIntro } from '../components/Shared/StyledIntro'

type Notification = {
  type: 'info' | 'action-required'
  date: string
  title: string
  message: string
}

const mockNotifications: { [key in 'p' | 's']: Notification[] } = {
  p: [
    {
      type: 'info',
      date: '02/09/2021, h. 14:46',
      title: 'Nuova versione di e-service',
      message:
        "La tua organizzazione ha pubblicato la versione 3 dell'e-service TARI Trento (sola lettura)",
    },
    {
      type: 'info',
      date: '08/08/2021, h. 15:12',
      title: 'Nuovo accordo richiesto',
      message:
        "Ti è stata richiesta l'adesione a un accordo per l'e-service TARI Campobasso (sola lettura), versione 2 da parte dell'organizzazione Comune di Bologna",
    },
    {
      type: 'info',
      date: '05/05/2021, h. 09:55',
      title: 'Nuova chiave caricata',
      message:
        "Un'operatore di sicurezza del client IBM per l'e-service Anagrafe di Torino (sola lettura) ha caricato una nuova chiave di sicurezza",
    },
  ],
  s: [
    {
      type: 'info',
      date: '06/09/2021, h. 16:34',
      title: 'Nuovo attributo riconosciuto',
      message: "L'erogatore Comune di Venezia ti ha riconosciuto un nuovo attributo",
    },
    {
      type: 'info',
      date: '20/08/2021, h. 12:28',
      title: 'Accordo attivato',
      message:
        "Il tuo accordo per l'e-service Anagrafe di Torino (sola lettura) è stato attivato. Puoi ora creare dei client",
    },
    {
      type: 'info',
      date: '10/08/2021, h. 09:22',
      title: 'Accordo sospeso',
      message:
        "L'accordo per l'e-service Anagrafe di Milano (sola lettura), versione 2 è stato sospeso dall'Erogatore",
    },
  ],
}

export function Notifications() {
  const [view, setView] = useState<'p' | 's'>('p')

  const ICON_TYPES = {
    'action-required': WarningIcon,
    info: InfoIcon,
  }

  const wrapSetView = (v: 'p' | 's') => (_: any) => {
    setView(v)
  }

  return (
    <React.Fragment>
      <StyledIntro>{{ title: 'Notifiche' }}</StyledIntro>

      <Box className="fakeData fakeDataStart" sx={{ position: 'relative' }}>
        <button
          onClick={wrapSetView('p')}
          style={{
            opacity: 0,
            background: 'red',
            position: 'absolute',
            right: 0,
            top: 0,
            zIndex: 1,
          }}
        >
          erogatore
        </button>
        <button
          onClick={wrapSetView('s')}
          style={{
            opacity: 0,
            background: 'red',
            position: 'absolute',
            right: 0,
            bottom: 0,
            zIndex: 1,
          }}
        >
          fruitore
        </button>

        {mockNotifications[view].map(({ date, type, title, message }, i) => {
          const Icon = ICON_TYPES[type]

          return (
            <Box sx={{ my: 2, p: 2, border: 1, borderColor: 'divider' }} key={i}>
              <Typography
                sx={{ display: 'flex', alignItems: 'center', my: 0 }}
                color="primary.main"
              >
                <Icon fontSize="small" sx={{ mr: 1 }} />
                <Typography component="span" sx={{ fontWeight: 600, mr: 1 }}>
                  {title}
                </Typography>{' '}
                —{' '}
                <Typography component="span" sx={{ fontWeight: 600, ml: 1 }}>
                  {date}
                </Typography>
              </Typography>
              <Typography sx={{ my: 1 }}>{message}</Typography>
            </Box>
          )
        })}
      </Box>
    </React.Fragment>
  )
}
