import React from 'react'
import { Box, Typography } from '@mui/material'
import { Layout } from './Shared/Layout'
import logo from '../assets/pagopa-logo-white.svg'
import { Link } from 'react-router-dom'
import { StyledLink } from './Shared/StyledLink'

export function Footer() {
  return (
    <Box component="footer" sx={{ bgcolor: '#01254C', color: 'common.white', py: '1.5rem' }}>
      <Layout>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ mr: '4.25rem' }}>
            <Link to="/">
              <Box component="img" src={logo} alt="Logo PagoPA" sx={{ width: '7.5rem' }} />
            </Link>
          </Box>
          <Typography variant="caption">
            PagoPA S.p.A. - società per azioni con socio unico - capitale sociale di euro 1,000,000
            interamente versato - sede legale in Roma, Piazza Colonna 370, CAP 00187 - n. di
            iscrizione a Registro Imprese di Roma, CF e P.IVA 15376371009
          </Typography>
        </Box>
        <Box>
          {[
            { label: 'Privacy policy', href: '#0' },
            { label: 'Società trasparente', href: '#0' },
            { label: 'Lavora con noi', href: '#0' },
            { label: 'Sicurezza', href: '#0' },
          ].map(({ href, label }, i) => (
            <StyledLink
              key={i}
              to={href}
              underline="none"
              color="inherit"
              sx={{ display: 'inline-block', mr: '1rem', py: '1rem' }}
              variant="caption"
            >
              {label}
            </StyledLink>
          ))}
        </Box>
      </Layout>
    </Box>
  )
}
