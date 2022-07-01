import React, { useContext } from 'react'
import { LoadingWithMessage } from './LoadingWithMessage'
import { LangContext } from '../../lib/context'
import { LangCode } from '../../../types'

export function LoadingTranslations() {
  const { lang } = useContext(LangContext)
  const LABELS: Record<LangCode, string> = {
    it: 'Stiamo caricando le etichette',
    en: 'Loading labels',
  }

  return <LoadingWithMessage transparentBackground={true} label={LABELS[lang]} />
}
