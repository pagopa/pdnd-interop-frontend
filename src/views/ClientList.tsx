import React, { useContext } from 'react'
import { Box } from '@mui/system'
import { Client, ClientState, ActionProps } from '../../types'
import { StyledIntro } from '../components/Shared/StyledIntro'
import { TableWithLoader } from '../components/Shared/TableWithLoader'
import { TempFilters } from '../components/TempFilters'
import { useAsyncFetch } from '../hooks/useAsyncFetch'
import { isAdmin } from '../lib/auth-utils'
import { PartyContext, TokenContext } from '../lib/context'
import { useFeedback } from '../hooks/useFeedback'
import { buildDynamicPath } from '../lib/router-utils'
import { StyledButton } from '../components/Shared/StyledButton'
import { CLIENT_STATE_LABEL } from '../config/labels'
import { ROUTES } from '../config/routes'
import { useUser } from '../hooks/useUser'
import { StyledTableRow } from '../components/Shared/StyledTableRow'
import { ActionMenu } from '../components/Shared/ActionMenu'
import { useHistory } from 'react-router-dom'
import { axiosErrorToError } from '../lib/error-utils'

export function ClientList() {
  const { runAction, wrapActionInDialog, forceRerenderCounter } = useFeedback()
  const { token } = useContext(TokenContext)
  const { party } = useContext(PartyContext)
  const { user } = useUser()
  const history = useHistory()

  const { data, loadingText, error } = useAsyncFetch<Array<Client>>(
    {
      path: { endpoint: 'CLIENT_GET_LIST' },
      config: {
        params: {
          consumerId: party?.partyId,
          // If it is admin, it can see all clients; if operator, only those it is associated to
          operatorId: user && party && party.productInfo.role === 'security' ? user.id : undefined,
        },
      },
    },
    {
      useEffectDeps: [forceRerenderCounter, token],
      loaderType: 'contextual',
      loadingTextLabel: 'Stiamo caricando i client',
    }
  )

  /*
   * List of possible actions for the user to perform
   */
  const wrapSuspend = (clientId: string) => async () => {
    await runAction(
      {
        path: { endpoint: 'CLIENT_SUSPEND', endpointParams: { clientId } },
      },
      { suppressToast: false }
    )
  }

  const wrapReactivate = (clientId: string) => async () => {
    await runAction(
      {
        path: { endpoint: 'CLIENT_ACTIVATE', endpointParams: { clientId } },
      },
      { suppressToast: false }
    )
  }
  /*
   * End list of actions
   */

  // Build list of available actions for each service in its current state
  const getAvailableActions = (client: Client): Array<ActionProps> => {
    // Exit early if user cannot perform actions
    if (!isAdmin(party)) {
      return []
    }

    const availableActions: Record<ClientState, Array<ActionProps>> = {
      ACTIVE: [
        {
          onClick: wrapActionInDialog(wrapSuspend(client.id), 'CLIENT_SUSPEND'),
          label: 'Sospendi client',
        },
      ],
      SUSPENDED: [
        {
          onClick: wrapActionInDialog(wrapReactivate(client.id), 'CLIENT_ACTIVATE'),
          label: 'Riattiva client',
        },
      ],
    }

    const status = client.state

    // Return all the actions available for this particular status
    return availableActions[status] || []
  }

  const headData = ['nome client', 'nome e-service', 'ente erogatore', 'stato']

  return (
    <React.Fragment>
      <StyledIntro>
        {{
          title: 'I tuoi client',
          description: "In quest'area puoi i trovare e gestire tutti i client che hai creato",
        }}
      </StyledIntro>

      <Box sx={{ mt: 4 }}>
        {isAdmin(party) && (
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 4 }}>
            <StyledButton variant="contained" to={ROUTES.SUBSCRIBE_CLIENT_CREATE.PATH}>
              + Aggiungi
            </StyledButton>
          </Box>
        )}

        <TempFilters />

        <TableWithLoader
          loadingText={loadingText}
          headData={headData}
          noDataLabel="Non ci sono client disponibili"
          error={axiosErrorToError(error)}
        >
          {data?.map((item, i) => (
            <StyledTableRow
              key={i}
              cellData={[
                { label: item.name },
                { label: item.eservice.name },
                { label: item.eservice.provider.description },
                { label: CLIENT_STATE_LABEL[item.state] },
              ]}
            >
              <StyledButton
                variant="outlined"
                size="small"
                onClick={() => {
                  history.push(
                    buildDynamicPath(ROUTES.SUBSCRIBE_CLIENT_EDIT.PATH, { clientId: item.id })
                  )
                }}
              >
                Ispeziona
              </StyledButton>

              <ActionMenu actions={getAvailableActions(item)} />
            </StyledTableRow>
          ))}
        </TableWithLoader>
      </Box>
    </React.Fragment>
  )
}
