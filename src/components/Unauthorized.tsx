import React from 'react'
import { Box } from '@mui/system'
import { StyledIntro } from './Shared/StyledIntro'
import { StyledButton } from './Shared/StyledButton'
import { useHistory } from 'react-router-dom'
import { IllusError } from '@pagopa/mui-italia'

export function Unauthorized() {
  const history = useHistory()

  const goHome = () => {
    history.push('/')
  }

  return (
    <Box sx={{ py: 10, px: 4, height: '100%', display: 'flex' }}>
      <Box sx={{ m: 'auto' }}>
        <Box sx={{ mx: 'auto', textAlign: 'center', mb: 4 }}>
          <IllusError />
        </Box>
        <StyledIntro sx={{ textAlign: 'center', mx: 'auto' }} centered>
          {{
            title: 'Autorizzazione insufficiente',
            description:
              'Spiacenti, non hai permessi sufficienti per accedere alla funzionalità richiesta',
          }}
        </StyledIntro>
        <Box sx={{ mx: 'auto', textAlign: 'center', mt: 5 }}>
          <StyledButton variant="contained" onClick={goHome}>
            Torna alla home
          </StyledButton>
        </Box>
      </Box>
    </Box>
  )
}
