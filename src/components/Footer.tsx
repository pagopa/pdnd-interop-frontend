import React from 'react'
import { Box, Typography } from '@mui/material'
import { Layout } from './Shared/Layout'
import logo from '../assets/pagopa-logo.svg'
import { StyledLink } from './Shared/StyledLink'
import { LangSelect } from './LangSelect'

export function Footer() {
  return (
    <Box component="footer">
      <Layout
        sx={{
          borderTop: 1,
          borderColor: 'divider',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          py: 2,
        }}
      >
        <a
          href="https://www.pagopa.it/"
          target="_blank"
          rel="noreferrer"
          title="Vai al sito di PagoPA S.p.A."
          style={{ display: 'flex' }}
        >
          <Box component="img" src={logo} alt="Logo PagoPA" sx={{ width: 114 }} />
        </a>

        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {[
            { label: 'Privacy policy', href: '#0' },
            { label: 'Termini e condizioni', href: '#0' },
            { label: 'Accessibilità', href: '#0' },
          ].map(({ href, label }, i) => (
            <StyledLink
              key={i}
              to={href}
              underline="none"
              color="inherit"
              sx={{ display: 'inline-block', mr: 2, py: 2 }}
              variant="caption"
            >
              {label}
            </StyledLink>
          ))}

          <LangSelect />
        </Box>
      </Layout>

      <Layout sx={{ px: 2, py: 2, borderTop: 1, borderColor: 'divider', textAlign: 'center' }}>
        <Typography color="inherit" component="p" variant="caption">
          <Typography variant="inherit" component="span" fontWeight={700}>
            PagoPA S.p.A.
          </Typography>{' '}
          — società per azioni con socio unico - capitale sociale di euro 1,000,000 interamente
          versato - sede legale in Roma, Piazza Colonna 370,
          <br />
          CAP 00187 - n. di iscrizione a Registro Imprese di Roma, CF e P.IVA 15376371009
        </Typography>
      </Layout>
    </Box>
  )
}
