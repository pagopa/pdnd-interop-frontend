import React from 'react'
import { useTranslation } from 'react-i18next'

export function InlineSupportLink() {
  const { t } = useTranslation('shared-components')

  return (
    <a href="#0" title={t('inlineSupportLink.title')}>
      {t('inlineSupportLink.label')}
    </a>
  )
}
