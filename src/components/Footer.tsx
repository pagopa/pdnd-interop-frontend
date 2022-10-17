import React from 'react'
import { Stack, Box, Container, Link } from '@mui/material'
import {
  CompanyLinkType,
  FooterLegal,
  FooterLinksType,
  LangSwitch,
  LangSwitchProps,
  LogoPagoPACompany,
  PreLoginFooterLinksType,
} from '@pagopa/mui-italia'

type FooterPostLoginProps = LangSwitchProps & {
  companyLink: CompanyLinkType
  links: Array<FooterLinksType>
}

const FooterPostLogin = ({
  companyLink,
  links,
  ...langProps
}: FooterPostLoginProps): JSX.Element => (
  <Box
    sx={{
      borderTop: 1,
      borderColor: 'divider',
      backgroundColor: 'background.paper',
    }}
  >
    <Container maxWidth={false} sx={{ py: { xs: 3, md: 2 } }}>
      <Stack
        spacing={{ xs: 4, md: 3 }}
        direction={{ xs: 'column', md: 'row' }}
        justifyContent="space-between"
        sx={{ alignItems: 'center' }}
      >
        {companyLink && (
          <Link
            component="button"
            aria-label={companyLink?.ariaLabel}
            href={companyLink?.href}
            onClick={companyLink.onClick}
            sx={{ display: 'inline-flex' }}
          >
            <LogoPagoPACompany />
          </Link>
        )}

        <Stack
          spacing={{ xs: 1, md: 3 }}
          direction={{ xs: 'column', md: 'row' }}
          sx={{ alignItems: 'center' }}
        >
          {links.map(({ href, label, ariaLabel, onClick }, i) => (
            <Link
              aria-label={ariaLabel}
              component={href ? 'a' : 'button'}
              href={href}
              onClick={onClick}
              key={i}
              underline="none"
              color="text.primary"
              sx={{ display: 'inline-block' }}
              variant="subtitle2"
            >
              {label}
            </Link>
          ))}

          <LangSwitch {...langProps} />
        </Stack>
      </Stack>
    </Container>
  </Box>
)

type FooterProps = LangSwitchProps & {
  /* Waiting for the type of control (see JwtUser above),
  we use a simple Boolean prop */
  loggedUser: boolean
  companyLink: CompanyLinkType
  postLoginLinks: Array<FooterLinksType>
  preLoginLinks: PreLoginFooterLinksType
  legalInfo: JSX.Element | Array<JSX.Element>
  onExit?: (exitAction: () => void) => void
  productsJsonUrl?: string
  onProductsJsonFetchError?: (reason: unknown) => void
  hideProductsColumn?: boolean
}

export const Footer = ({
  companyLink,
  postLoginLinks,
  // preLoginLinks,
  legalInfo,
  // loggedUser,
  // onExit,
  languages,
  onLanguageChanged,
  currentLangCode,
}: // productsJsonUrl,
// onProductsJsonFetchError,
// hideProductsColumn,
FooterProps) => (
  <Box component="footer">
    <FooterPostLogin
      companyLink={companyLink}
      links={postLoginLinks}
      languages={languages}
      onLanguageChanged={onLanguageChanged}
      currentLangCode={currentLangCode}
    />
    <FooterLegal content={legalInfo} />
  </Box>
)
