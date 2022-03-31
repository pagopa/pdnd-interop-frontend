import React, { FunctionComponent, useContext } from 'react'
import { Client, ClientKind, ActionProps, Party, MappedRouteConfig } from '../../types'
import { StyledIntro } from '../components/Shared/StyledIntro'
import { TableWithLoader } from '../components/Shared/TableWithLoader'
import { TempFilters } from '../components/TempFilters'
import { useAsyncFetch } from '../hooks/useAsyncFetch'
import { isAdmin } from '../lib/auth-utils'
import { PartyContext } from '../lib/context'
import { buildDynamicPath } from '../lib/router-utils'
import { StyledButton } from '../components/Shared/StyledButton'
import { StyledTableRow } from '../components/Shared/StyledTableRow'
import { ActionMenu } from '../components/Shared/ActionMenu'
import { useHistory } from 'react-router-dom'
import { axiosErrorToError } from '../lib/error-utils'
import { useRoute } from '../hooks/useRoute'
import { useFeedback } from '../hooks/useFeedback'
import { PageTopFilters } from '../components/Shared/PageTopFilters'
import { Box } from '@mui/material'

type ClientListProps = {
  clientKind?: ClientKind
}

type AsyncTableProps = {
  forceRerenderCounter: number
  getActions: (client: Client) => Array<ActionProps>
  headData: Array<string>
  clientKind: ClientKind
  party: Party | null
  routes: Record<string, MappedRouteConfig>
}

const AsyncTable = ({
  forceRerenderCounter,
  getActions,
  headData,
  clientKind,
  party,
  routes,
}: AsyncTableProps) => {
  const history = useHistory()
  const editPath =
    clientKind === 'CONSUMER'
      ? routes.SUBSCRIBE_CLIENT_EDIT.PATH
      : routes.SUBSCRIBE_INTEROP_M2M_CLIENT_EDIT.PATH

  const { data, loadingText, error } = useAsyncFetch<{ clients: Array<Client> }, Array<Client>>(
    {
      path: { endpoint: 'CLIENT_GET_LIST' },
      config: { params: { kind: clientKind, consumerId: party?.id } },
    },
    {
      mapFn: (data) => data.clients,
      loaderType: 'contextual',
      loadingTextLabel: 'Stiamo caricando i client',
      useEffectDeps: [forceRerenderCounter],
    }
  )

  return (
    <TableWithLoader
      loadingText={loadingText}
      headData={headData}
      noDataLabel="Non ci sono client disponibili"
      error={axiosErrorToError(error)}
    >
      {data &&
        Boolean(data.length > 0) &&
        data.map((item, i) => (
          <StyledTableRow key={i} cellData={[{ label: item.name }]}>
            <StyledButton
              variant="outlined"
              size="small"
              onClick={() => {
                history.push(buildDynamicPath(editPath, { clientId: item.id }))
              }}
            >
              Ispeziona
            </StyledButton>

            <Box component="span" sx={{ ml: 2, display: 'inline-block' }}>
              <ActionMenu actions={getActions(item)} />
            </Box>
          </StyledTableRow>
        ))}
    </TableWithLoader>
  )
}

export const ClientList: FunctionComponent<ClientListProps> = ({ clientKind = 'CONSUMER' }) => {
  const { runAction, forceRerenderCounter } = useFeedback()
  const { party } = useContext(PartyContext)
  const { routes } = useRoute()

  // Clients can be M2M clients for provider, or Purpose clients for subscriber
  const createPath =
    clientKind === 'CONSUMER'
      ? routes.SUBSCRIBE_CLIENT_CREATE.PATH
      : routes.SUBSCRIBE_INTEROP_M2M_CLIENT_CREATE.PATH

  /*
   * List of possible actions for the user to perform
   */
  const wrapDelete = (clientId: string) => async () => {
    await runAction(
      { path: { endpoint: 'CLIENT_DELETE', endpointParams: { clientId } } },
      { showConfirmDialog: true }
    )
  }
  /*
   * End list of actions
   */

  const getAvailableActions = (client: Client): Array<ActionProps> => {
    return [{ onClick: wrapDelete(client.id), label: 'Elimina' }]
  }

  const headData = ['Nome client', '']

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

      <AsyncTable
        forceRerenderCounter={forceRerenderCounter}
        getActions={getAvailableActions}
        headData={headData}
        clientKind={clientKind}
        party={party}
        routes={routes}
      />
    </React.Fragment>
  )
}
