import React from 'react'
import { useTranslation } from 'react-i18next'
import { StyledIntro } from '../components/Shared/StyledIntro'
import { ClientList } from './ClientList'

export function InteropM2M() {
  const { t } = useTranslation('client', { keyPrefix: 'interopM2M' })

  return (
    <React.Fragment>
      <StyledIntro>{{ title: t('title'), description: t('description') }}</StyledIntro>

      <ClientList clientKind="API" />
    </React.Fragment>
  )
}
