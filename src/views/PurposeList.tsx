import React from 'react'
import { StyledButton } from '../components/Shared/StyledButton'
import { StyledIntro } from '../components/Shared/StyledIntro'
import { TempFilters } from '../components/TempFilters'
import { useRoute } from '../hooks/useRoute'
import { PageTopFilters } from '../components/Shared/PageTopFilters'
import { AsyncTablePurpose } from '../components/Shared/AsyncTablePurpose'

export const PurposeList = () => {
  const { routes } = useRoute()

  return (
    <React.Fragment>
      <StyledIntro>
        {{
          title: 'Le tue finalità',
          description: "In quest'area puoi i trovare e gestire tutte le finalità che hai creato",
        }}
      </StyledIntro>

      <PageTopFilters>
        <TempFilters />
        <StyledButton variant="contained" size="small" to={routes.SUBSCRIBE_PURPOSE_CREATE.PATH}>
          + Aggiungi
        </StyledButton>
      </PageTopFilters>

      <AsyncTablePurpose />
    </React.Fragment>
  )
}
