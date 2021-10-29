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
    <Box sx={{ px: '1.5rem', py: '1.5rem', bgcolor: 'error.main' }}>
      <StyledIntro variant="h1">
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
