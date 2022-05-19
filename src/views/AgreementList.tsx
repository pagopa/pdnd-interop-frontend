import React from 'react'
import { ProviderOrSubscriber } from '../../types'
import { useMode } from '../hooks/useMode'
import { StyledIntro } from '../components/Shared/StyledIntro'
import { TempFilters } from '../components/TempFilters'
import { PageTopFilters } from '../components/Shared/PageTopFilters'
import { AsyncTableAgreement } from '../components/Shared/AsyncTableAgreement'
import { useTranslation } from 'react-i18next'

export function AgreementList() {
  const { t } = useTranslation('agreement')
  const mode = useMode()
  const currentMode = mode as ProviderOrSubscriber

  const title = t(`list.${currentMode}.title`)
  const description = t(`list.${currentMode}.description`)

  return (
    <React.Fragment>
      <StyledIntro>{{ title, description }}</StyledIntro>

      <PageTopFilters>
        <TempFilters />
      </PageTopFilters>

      <AsyncTableAgreement />
    </React.Fragment>
  )
}
