import React from 'react'
import { StyledIntro } from '../components/Shared/StyledIntro'
import { TempFilters } from '../components/TempFilters'
import { StyledButton } from '../components/Shared/StyledButton'
import { useRoute } from '../hooks/useRoute'
import { PageTopFilters } from '../components/Shared/PageTopFilters'
import { AsyncTableEServiceList } from '../components/Shared/AsyncTableEservice'

export function EServiceList() {
  const { routes } = useRoute()

  return (
    <React.Fragment>
      <StyledIntro>
        {{
          title: 'I tuoi E-Service',
          description: "In quest'area puoi gestire tutti gli E-Service che stai erogando",
        }}
      </StyledIntro>

      <PageTopFilters>
        <TempFilters />
        <StyledButton variant="contained" size="small" to={routes.PROVIDE_ESERVICE_CREATE.PATH}>
          + Aggiungi
        </StyledButton>
      </PageTopFilters>

      <AsyncTableEServiceList />
    </React.Fragment>
  )
}
