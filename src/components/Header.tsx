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
import { HelpOutline as HelpOutlineIcon } from '@mui/icons-material'
import { StyledLink } from './Shared/StyledLink'

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

            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <StyledLink
                to={routes.HELP.PATH}
                color="text.primary"
                variant="caption"
                underline="none"
                sx={{ display: 'inline-flex', alignItems: 'center', mr: 4, fontWeight: 600 }}
              >
                <HelpOutlineIcon fontSize="small" color="inherit" sx={{ mr: 1 }} />
                Assistenza
              </StyledLink>

              <StyledButton variant="contained" to={btnPath} size="small">
                {btnLabel}
              </StyledButton>
            </Box>
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
