import React from 'react'
import { Box } from '@mui/system'
import { StyledIntro } from '../components/Shared/StyledIntro'
import { StyledLink } from '../components/Shared/StyledLink'

type NotFoundProps = {
  errorType?: 'not-found' | 'server-error'
}

export function NotFound({ errorType = 'not-found' }: NotFoundProps) {
  const DESCRIPTIONS = {
    'not-found': 'La pagina cercata purtroppo non esiste',
    'server-error': 'Si è verificato un errore temporaneo del server',
  }

  return (
    <Box sx={{ p: 2 }} bgcolor="error.main" color="common.white">
      <StyledIntro sx={{ mb: 0, pb: 0 }}>
        {{
          title: 'Spiacenti',
          description: (
            <>
              {DESCRIPTIONS[errorType]}. Torna alla <StyledLink to="/">home</StyledLink>.
            </>
          ),
        }}
      </StyledIntro>
    </Box>
  )
}
