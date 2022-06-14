import React, { useContext } from 'react'
import { LangCode } from '../../types'
import { useHistory } from 'react-router-dom'
import { LangContext } from '../lib/context'
import { Footer } from './Footer'
import { buildLocale } from '../lib/validation-config'
import { LANGUAGES } from '../lib/constants'
import { useTranslation } from 'react-i18next'
import { useJwt } from '../hooks/useJwt'
import { LoadingTranslations } from './Shared/LoadingTranslations'

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

  return (
    <Footer
      loggedUser={jwt}
      currentLangCode={lang}
      onLanguageChanged={onLanguageChanged}
      languages={LANGUAGES}
      onExit={(href, linkType) => {
        if (linkType === 'internal') {
          history.push(href)
        } else {
          window.open(href, '_blank')
        }
      }}
    />
  )
}
