import React, { useContext } from 'react'
import { useLocation } from 'react-router-dom'
import { Typography } from '@mui/material'
import { Box } from '@mui/system'
import { PartyContext, TokenContext } from '../lib/context'
import { Layout } from './Shared/Layout'
import { StyledButton } from './Shared/StyledButton'
import { PartySelect } from './PartySelect'
import { URL_FE_LOGIN } from '../lib/constants'
import { useRoute } from '../hooks/useRoute'

export function Header() {
  const location = useLocation()
  const { party } = useContext(PartyContext)
  const { token } = useContext(TokenContext)
  const { routes, doesRouteAllowTwoColumnsLayout } = useRoute()

  const { PATH: btnPath, LABEL: btnLabel } = token
    ? routes.LOGOUT
    : { PATH: URL_FE_LOGIN, LABEL: 'Login' }

  return (
    <header>
      <Box>
        <Layout sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              py: 1,
            }}
          >
            <a
              href="https://www.pagopa.it/"
              target="_blank"
              rel="noreferrer"
              title="Vai al sito di PagoPA S.p.A."
              style={{ textDecoration: 'none' }}
            >
              <Typography component="span" variant="body2" fontWeight="700">
                PagoPA
              </Typography>
            </a>

            <StyledButton variant="contained" to={btnPath} size="small">
              {btnLabel}
            </StyledButton>
          </Box>
        </Layout>
      </Box>

      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Layout>
          <Box
            sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 2 }}
          >
            <Typography fontWeight={700} component="span" variant="h3">
              Interoperabilità
            </Typography>

            {doesRouteAllowTwoColumnsLayout(location) && party !== null && <PartySelect />}
          </Box>
        </Layout>
      </Box>
    </header>
  )
}
