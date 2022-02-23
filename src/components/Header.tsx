import React, { useContext } from 'react'
import { useLocation } from 'react-router-dom'
import { Typography } from '@mui/material'
import { Box } from '@mui/system'
import { /* LangContext, */ PartyContext, TokenContext } from '../lib/context'
import { Layout } from './Shared/Layout'
import { StyledButton } from './Shared/StyledButton'
import { StyledLink } from './Shared/StyledLink'
import { PartySelect } from './PartySelect'
import logo from '../assets/pagopa-logo-white.svg'
import { URL_FE_LOGIN } from '../lib/constants'
import { useRoute } from '../hooks/useRoute'
// import { Lang } from '../../types'

export function Header() {
  const location = useLocation()
  const { party } = useContext(PartyContext)
  const { token } = useContext(TokenContext)
  const { routes, doesRouteAllowTwoColumnsLayout } = useRoute()
  // const { lang, setLang } = useContext(LangContext)

  const { PATH: btnPath, LABEL: btnLabel } = token
    ? routes.LOGOUT
    : { PATH: URL_FE_LOGIN, LABEL: 'Login' }

  // const wrapSetLang = (_lang: Lang) => () => {
  //   setLang(_lang)
  // }

  return (
    <header>
      <Box sx={{ bgcolor: 'primary.dark' }}>
        <Layout>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              py: 1,
            }}
          >
            <StyledLink to="/" sx={{ display: 'flex' }}>
              <Box component="img" src={logo} alt="Logo PagoPA" sx={{ margin: 'auto' }} />
            </StyledLink>

            {/* <Box sx={{ display: 'flex', background: 'white', px: 2, py: 1 }}>
              <StyledButton
                sx={{ py: 0.5, mr: 1 }}
                disabled={lang === 'it'}
                variant="contained"
                onClick={wrapSetLang('it')}
              >
                IT
              </StyledButton>
              <StyledButton
                sx={{ py: 0.5 }}
                disabled={lang === 'en'}
                variant="contained"
                onClick={wrapSetLang('en')}
              >
                EN
              </StyledButton>
            </Box> */}

            <StyledButton variant="contained" to={btnPath}>
              {btnLabel}
            </StyledButton>
          </Box>
        </Layout>
      </Box>

      <Box sx={{ bgcolor: 'primary.main' }}>
        <Layout>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ py: 3 }}>
              <Typography color="common.white" fontWeight={700} fontSize={24}>
                Interoperabilità
              </Typography>
              <Typography color="common.white" variant="caption">
                Il catalogo degli e-service delle PA
              </Typography>
            </Box>

            {doesRouteAllowTwoColumnsLayout(location) && party !== null && <PartySelect />}
          </Box>
        </Layout>
      </Box>
    </header>
  )
}
