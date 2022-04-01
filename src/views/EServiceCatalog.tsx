import React from 'react'
import { StyledIntro } from '../components/Shared/StyledIntro'
import { TempFilters } from '../components/TempFilters'
import { AsyncTableEServiceCatalog } from '../components/Shared/AsyncTableEservice'

export function EServiceCatalog() {
  return (
    <React.Fragment>
      <StyledIntro>
        {{
          title: 'Catalogo degli E-Service',
          description:
            "In quest'area puoi vedere tutti gli E-Service nel catalogo, e aderire a quelli a cui sei interessato",
        }}
      </StyledIntro>

      <TempFilters />

      <AsyncTableEServiceCatalog />
    </React.Fragment>
  )
}
