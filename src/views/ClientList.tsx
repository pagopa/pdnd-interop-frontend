import React, { useContext } from 'react'
import { Box } from '@mui/system'
import { Client, ClientState, ActionProps } from '../../types'
import { StyledIntro } from '../components/Shared/StyledIntro'
import { TableWithLoader } from '../components/Shared/TableWithLoader'
import { TempFilters } from '../components/TempFilters'
import { useAsyncFetch } from '../hooks/useAsyncFetch'
import { getClientComputedState } from '../lib/status-utils'
import { isAdmin, isOperatorSecurity } from '../lib/auth-utils'
import { PartyContext, TokenContext } from '../lib/context'
import { useFeedback } from '../hooks/useFeedback'
import { buildDynamicPath } from '../lib/router-utils'
import { StyledButton } from '../components/Shared/StyledButton'
import { StyledTableRow } from '../components/Shared/StyledTableRow'
import { COMPUTED_STATE_LABEL } from '../config/labels'
import { ROUTES } from '../config/routes'
import { jwtToUser } from '../lib/jwt-utils'

export function ClientList() {
  const { runAction, wrapActionInDialog, forceRerenderCounter } = useFeedback()
  const { token } = useContext(TokenContext)
  const { party } = useContext(PartyContext)
  const { data, loadingText, error } = useAsyncFetch<Array<Client>>(
    {
      path: { endpoint: 'CLIENT_GET_LIST' },
      config: {
        params: {
          institutionId: party?.institutionId,
          // TEMP-BACKEND: when there is the new endpoint for security operators, update this
          operatorTaxCode: isOperatorSecurity(party) ? jwtToUser(token as string).id : undefined,
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
      active: [
        {
          onClick: wrapActionInDialog(wrapSuspend(client.id), 'CLIENT_SUSPEND'),
          label: 'Sospendi client',
        },
      ],
      suspended: [
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

  const headData = ['nome client', 'nome e-service', 'ente erogatore', 'stato', '']

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
          pagination={true}
          data={data}
          noDataLabel="Non ci sono client disponibili"
          error={error}
        >
          {data?.map((item, i) => (
            <StyledTableRow
              key={i}
              cellData={[
                { label: item.name },
                { label: item.eservice.name },
                { label: item.eservice.provider.description },
                { label: COMPUTED_STATE_LABEL[getClientComputedState(item)] },
              ]}
              index={i}
              singleActionBtn={{
                to: buildDynamicPath(ROUTES.SUBSCRIBE_CLIENT_EDIT.PATH, { id: item.id }),
                label: 'Ispeziona',
              }}
              actions={getAvailableActions(item)}
            />
          ))}
        </TableWithLoader>
      </Box>
    </React.Fragment>
  )
}
