import React from 'react'
import { Stack, Box, Container, Link, Typography } from '@mui/material'
import { FooterLegal, LogoPagoPACompany } from '@pagopa/mui-italia'
import type {
  CompanyLinkType,
  FooterLinksType,
  LangSwitchProps,
  PreLoginFooterLinksType,
} from '@pagopa/mui-italia'
import { LANGUAGES, pagoPaLink } from '@/config/constants'
import { useNavigate } from '@/router'
import { useTranslation } from 'react-i18next'
import useCurrentLanguage from '@/hooks/useCurrentLanguage'
import { useNavigate as useRRDNavigate } from 'react-router-dom'
import { AuthHooks } from '@/api/auth'

type FooterLinksTypeMulti = Omit<FooterLinksType, 'label' | 'ariaLabel'> & { labelKey?: string }

export const Footer = () => {
  const { t } = useTranslation('pagopa')
  const currentLanguage = useCurrentLanguage()
  const navigate = useNavigate()
  const rrdNavigate = useRRDNavigate()
  const { jwt } = AuthHooks.useJwt()

  function convertLinks(inputLinks: Array<FooterLinksTypeMulti>) {
    return inputLinks.map((l) => {
      const link = { ...l }
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      const label = t(`footer.links.${link.labelKey}.label`)
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      const ariaLabel = t(`footer.links.${link.labelKey}.ariaLabel`)
      return { label, ariaLabel, ...l }
    })
  }

  const links: Array<FooterLinksTypeMulti> = [
    {
      labelKey: 'privacy',
      onClick: () => {
        navigate('PRIVACY_POLICY')
      },
      linkType: 'internal',
    },
    {
      labelKey: 'dataProtection',
      href: 'https://privacyportal-de.onetrust.com/webform/77f17844-04c3-4969-a11d-462ee77acbe1/9ab6533d-be4a-482e-929a-0d8d2ab29df8',
      linkType: 'external',
    },
    {
      labelKey: 'terms',
      onClick: () => {
        navigate('TOS')
      },
      linkType: 'internal',
    },
    {
      labelKey: 'a11y',
      href: 'https://form.agid.gov.it/view/d96e090e-9d56-4d27-a70c-9a72186305b0/',
      linkType: 'external',
    },
  ]

  const handleLanguageChange = (_: unknown) => {
    /* No way to switch language right now  */
  }

  const LegalInfo = (
    <>
      <Typography variant="inherit" component="span" fontWeight={700}>
        PagoPA S.p.A.
      </Typography>{' '}
      — società per azioni con socio unico - capitale sociale di euro 1,000,000 interamente versato
      - sede legale in Roma, Piazza Colonna 370,
      <br />
      CAP 00187 - n. di iscrizione a Registro Imprese di Roma, CF e P.IVA 15376371009
    </>
  )

  return (
    <MUIItaliaFooter
      loggedUser={Boolean(jwt)}
      companyLink={pagoPaLink}
      legalInfo={LegalInfo}
      postLoginLinks={convertLinks(links) as Array<FooterLinksType>}
      preLoginLinks={{
        aboutUs: { title: 'Chi siamo', links: [] },
        resources: { title: 'Risorse', links: [] },
        followUs: { title: 'Seguici su', links: [], socialLinks: [] },
      }}
      onLanguageChanged={handleLanguageChange}
      currentLangCode={currentLanguage}
      onExit={() => (href: string, linkType: string) => {
        if (linkType === 'internal') {
          rrdNavigate(href)
        } else {
          window.open(href, '_blank')
        }
      }}
      languages={LANGUAGES}
      hideProductsColumn={true}
    />
  )
}

type FooterPostLoginProps = LangSwitchProps & {
  companyLink: CompanyLinkType
  links: Array<FooterLinksType>
}

const FooterPostLogin = ({ companyLink, links }: FooterPostLoginProps): JSX.Element => (
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
          {links.map(({ href, label, ariaLabel, onClick, linkType }, i) => (
            <Link
              aria-label={ariaLabel}
              component={href ? 'a' : 'button'}
              href={href}
              onClick={onClick}
              key={i}
              target={linkType === 'external' ? '_blank' : undefined}
              underline="none"
              color="text.primary"
              sx={{ display: 'inline-block' }}
              variant="subtitle2"
            >
              {label}
            </Link>
          ))}
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

export const MUIItaliaFooter = ({
  companyLink,
  postLoginLinks,
  legalInfo,
  languages,
  onLanguageChanged,
  currentLangCode,
}: FooterProps) => (
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
