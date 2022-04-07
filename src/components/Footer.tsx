import React from 'react'
import { Box, Container, Link, Typography } from '@mui/material'
import logo from '../assets/pagopa-logo.svg'
import { LangSwitch, LangSwitchProps } from './LangSwitch'
import { ButtonNaked } from '@pagopa/mui-italia'

// We need to validate this. It might be possible that the fields differ from product to product
type JwtUser = {
  id: string // the relationshipId between the user and the current institution
  name?: string
  surname?: string
  email?: string
}

type LinkType = 'internal' | 'external'

type FooterProps = LangSwitchProps & {
  loggedUser?: JwtUser
  onExit?: (href: string, linkType: LinkType) => void
}

export const Footer = ({ loggedUser, onExit, ...langProps }: FooterProps) => {
  const links = [
    {
      label: 'Privacy policy',
      href: '#0',
      ariaLabel: 'Vai al link: privacy policy',
      linkType: 'internal',
    },
    {
      label: 'Termini e condizioni',
      href: '#0',
      ariaLabel: 'Vai al link: termini e condizioni',
      linkType: 'internal',
    },
    {
      label: 'Accessibilità',
      href: '#0',
      ariaLabel: 'Vai al link: accessibilità',
      linkType: 'internal',
    },
  ]

  const wrapHandleClick =
    (href: string, linkType: 'internal' | 'external') => (e: React.SyntheticEvent) => {
      if (onExit) {
        e.preventDefault()
        onExit(href, linkType)
      }
    }

  return (
    <Box component="footer">
      {loggedUser && (
        <Container
          sx={{
            borderTop: 1,
            borderColor: 'divider',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            py: 2,
          }}
        >
          <ButtonNaked
            aria-label="Link: vai al sito di PagoPA S.p.A."
            onClick={wrapHandleClick('https://www.pagopa.it/', 'external')}
          >
            <Box component="img" src={logo} alt="Logo PagoPA" sx={{ width: 114 }} />
          </ButtonNaked>

          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {links.map(({ href, label, ariaLabel, linkType }, i) => (
              <Link
                aria-label={ariaLabel}
                component="button"
                onClick={wrapHandleClick(href, linkType as LinkType)}
                key={i}
                underline="none"
                color="inherit"
                sx={{ display: 'inline-block', mr: 2 }}
                variant="caption"
                fontWeight="700"
              >
                {label}
              </Link>
            ))}

            <LangSwitch {...langProps} />
          </Box>
        </Container>
      )}

      <Container sx={{ px: 2, py: 2, borderTop: 1, borderColor: 'divider', textAlign: 'center' }}>
        <Typography color="inherit" component="p" variant="caption">
          <Typography variant="inherit" component="span" fontWeight={700}>
            PagoPA S.p.A.
          </Typography>{' '}
          — società per azioni con socio unico - capitale sociale di euro 1,000,000 interamente
          versato - sede legale in Roma, Piazza Colonna 370,
          <br />
          CAP 00187 - n. di iscrizione a Registro Imprese di Roma, CF e P.IVA 15376371009
        </Typography>
      </Container>
    </Box>
  )
}
