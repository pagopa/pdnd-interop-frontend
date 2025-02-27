import React from 'react'
import { Typography } from '@mui/material'
import { Footer as MUIItaliaFooter } from '@pagopa/mui-italia'
import type { FooterLinksType } from '@pagopa/mui-italia'
import { LANGUAGES, pagoPaLink } from '@/config/constants'
import { useNavigate } from '@/router'
import { useTranslation } from 'react-i18next'
import useCurrentLanguage from '@/hooks/useCurrentLanguage'
import type { JwtUser } from '@/types/party.types'

type FooterLinksTypeMulti = Omit<FooterLinksType, 'label' | 'ariaLabel'> & { labelKey?: string }

type FooterProps = {
  jwt?: JwtUser
}

export const Footer: React.FC<FooterProps> = ({ jwt }) => {
  const { t } = useTranslation('pagopa')
  const currentLanguage = useCurrentLanguage()
  const navigate = useNavigate()

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
      href: 'https://form.agid.gov.it/view/1e9cd8e0-df2e-11ef-8637-9f856ac3da10',
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
      languages={LANGUAGES}
      hideProductsColumn={true}
    />
  )
}
