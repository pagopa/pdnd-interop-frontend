import React from 'react'
import { StyledIntro } from '../components/Shared/StyledIntro'
import { TempFilters } from '../components/TempFilters'
import { StyledButton } from '../components/Shared/StyledButton'
import { useRoute } from '../hooks/useRoute'
import { PageTopFilters } from '../components/Shared/PageTopFilters'
import { AsyncTableEServiceList } from '../components/Shared/AsyncTableEservice'
import { useTranslation } from 'react-i18next'

export function EServiceList() {
  const { t } = useTranslation(['eservice', 'common'])
  const { routes } = useRoute()

  return (
    <React.Fragment>
      <StyledIntro>{{ title: t('list.title'), description: t('list.description') }}</StyledIntro>

      <PageTopFilters>
        <TempFilters />
        <StyledButton variant="contained" size="small" to={routes.PROVIDE_ESERVICE_CREATE.PATH}>
          {t('createNewBtn', { ns: 'common' })}
        </StyledButton>
      </PageTopFilters>

      <AsyncTableEServiceList />
    </React.Fragment>
  )
}
