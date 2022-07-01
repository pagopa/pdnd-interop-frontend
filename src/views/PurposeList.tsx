import React from 'react'
import { StyledButton } from '../components/Shared/StyledButton'
import { StyledIntro } from '../components/Shared/StyledIntro'
import { TempFilters } from '../components/TempFilters'
import { useRoute } from '../hooks/useRoute'
import { PageTopFilters } from '../components/Shared/PageTopFilters'
import { AsyncTablePurpose } from '../components/Shared/AsyncTablePurpose'
import { useTranslation } from 'react-i18next'

export const PurposeList = () => {
  const { t } = useTranslation(['purpose', 'common'])
  const { routes } = useRoute()

  return (
    <React.Fragment>
      <StyledIntro>{{ title: t('list.title'), description: t('list.description') }}</StyledIntro>

      <PageTopFilters>
        <TempFilters />
        <StyledButton variant="contained" size="small" to={routes.SUBSCRIBE_PURPOSE_CREATE.PATH}>
          {t('createNewBtn', { ns: 'common' })}
        </StyledButton>
      </PageTopFilters>

      <AsyncTablePurpose />
    </React.Fragment>
  )
}
