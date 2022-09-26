import { useContext, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { DEFAULT_LANG } from '../lib/constants'
import { LangContext } from '../lib/context'
import { buildLocale } from '../lib/validation-config'

export const useRebuildI18N = () => {
  const { lang } = useContext(LangContext)
  const { i18n, t, ready } = useTranslation('common', { useSuspense: false })

  // Build config once translations are ready
  useEffect(() => {
    if (ready) {
      lang !== DEFAULT_LANG && i18n.changeLanguage(lang)
      buildLocale(t)
    }
  }, [ready]) // eslint-disable-line react-hooks/exhaustive-deps
}
