import React, { useContext } from 'react'
import { LangCode } from '../../types'
import { useHistory } from 'react-router-dom'
import { LangContext } from '../lib/context'
import { buildLocale } from '../lib/validation-config'
import { LANGUAGES, pagoPaLink } from '../lib/constants'
import { useTranslation } from 'react-i18next'
import { useJwt } from '../hooks/useJwt'
import { LoadingTranslations } from './Shared/LoadingTranslations'
import { Footer, FooterLinksType } from '@pagopa/mui-italia'
import { Typography } from '@mui/material'

const links: Array<FooterLinksType> = [
  {
    label: 'Privacy policy',
    href: '#0',
    ariaLabel: 'Vai al link: privacy policy',
    linkType: 'internal',
  },
  {
    label: 'Diritto alla protezione dei dati personali',
    href: '#0',
    ariaLabel: 'Vai al link: diritto alla protezione dei dati personali',
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

export const FooterWrapper = () => {
  const history = useHistory()
  const { lang, setLang } = useContext(LangContext)
  const { ready, t, i18n } = useTranslation('common', { useSuspense: false })
  const { jwt } = useJwt()

  const onLanguageChanged = (newLang: LangCode) => {
    setLang(newLang)
    i18n.changeLanguage(newLang)
    buildLocale(t)
  }

  if (!ready) {
    return <LoadingTranslations />
  }

  const LegalInfo = (
    <Typography color="inherit" component="p" variant="caption">
      <Typography variant="inherit" component="span" fontWeight={700}>
        PagoPA S.p.A.
      </Typography>{' '}
      — società per azioni con socio unico - capitale sociale di euro 1,000,000 interamente versato
      - sede legale in Roma, Piazza Colonna 370,
      <br />
      CAP 00187 - n. di iscrizione a Registro Imprese di Roma, CF e P.IVA 15376371009
    </Typography>
  )

  return (
    <Footer
      loggedUser={Boolean(jwt)}
      companyLink={pagoPaLink}
      legalInfo={LegalInfo}
      postLoginLinks={links}
      preLoginLinks={{
        aboutUs: { title: 'Chi siamo', links: [] },
        resources: { title: 'Risorse', links: [] },
        followUs: { title: 'Seguici su', links: [], socialLinks: [] },
      }}
      currentLangCode={lang}
      onLanguageChanged={onLanguageChanged}
      onExit={() => (href: string, linkType: string) => {
        if (linkType === 'internal') {
          history.push(href)
        } else {
          window.open(href, '_blank')
        }
      }}
      languages={LANGUAGES}
      hideProductsColumn={true}
    />
  )
}
