import React, { FunctionComponent, useContext } from 'react'
import { ClientKind } from '../../types'
import { StyledIntro } from '../components/Shared/StyledIntro'
import { TempFilters } from '../components/TempFilters'
import { isAdmin } from '../lib/auth-utils'
import { PartyContext } from '../lib/context'
import { StyledButton } from '../components/Shared/StyledButton'
import { useRoute } from '../hooks/useRoute'
import { PageTopFilters } from '../components/Shared/PageTopFilters'
import { AsyncTableClient } from '../components/Shared/AsyncTableClient'

type ClientListProps = {
  clientKind?: ClientKind
}

export const ClientList: FunctionComponent<ClientListProps> = ({ clientKind = 'CONSUMER' }) => {
  const { party } = useContext(PartyContext)
  const { routes } = useRoute()

  // Clients can be M2M clients for provider, or Purpose clients for subscriber
  const createPath =
    clientKind === 'CONSUMER'
      ? routes.SUBSCRIBE_CLIENT_CREATE.PATH
      : routes.SUBSCRIBE_INTEROP_M2M_CLIENT_CREATE.PATH

  return (
    <React.Fragment>
      {clientKind === 'CONSUMER' && (
        <StyledIntro>
          {{
            title: 'I tuoi client',
            description: "In quest'area puoi i trovare e gestire tutti i client che hai creato",
          }}
        </StyledIntro>
      )}

      <PageTopFilters>
        <TempFilters />
        {isAdmin(party) && (
          <StyledButton variant="contained" size="small" to={createPath}>
            + Aggiungi
          </StyledButton>
        )}
      </PageTopFilters>

      <AsyncTableClient clientKind={clientKind} />
    </React.Fragment>
  )
}
