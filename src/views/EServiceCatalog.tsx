import React from 'react'
import { StyledIntro } from '../components/Shared/StyledIntro'
import { TempFilters } from '../components/TempFilters'
import { AsyncTableEServiceCatalog } from '../components/Shared/AsyncTableEservice'
import { useTranslation } from 'react-i18next'

export function EServiceCatalog() {
  const { t } = useTranslation('eservice', { keyPrefix: 'catalog' })

  return (
    <React.Fragment>
      <StyledIntro>{{ title: t('title'), description: t('description') }}</StyledIntro>

      <TempFilters />

      <AsyncTableEServiceCatalog />
    </React.Fragment>
  )
}
