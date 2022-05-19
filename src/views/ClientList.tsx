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
import { useTranslation } from 'react-i18next'

type ClientListProps = {
  clientKind?: ClientKind
}

export const ClientList: FunctionComponent<ClientListProps> = ({ clientKind = 'CONSUMER' }) => {
  const { t } = useTranslation(['client', 'common'])
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
          {{ title: t('list.consumer.title'), description: t('list.consumer.description') }}
        </StyledIntro>
      )}

      <PageTopFilters>
        <TempFilters />
        {isAdmin(party) && (
          <StyledButton variant="contained" size="small" to={createPath}>
            {t('createNewBtn', { ns: 'common' })}
          </StyledButton>
        )}
      </PageTopFilters>

      <AsyncTableClient clientKind={clientKind} />
    </React.Fragment>
  )
}
