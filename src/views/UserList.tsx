import React, { useContext } from 'react'
import { useLocation } from 'react-router'
import { Box } from '@mui/system'
import { UserState, ActionProps, User } from '../../types'
import { StyledIntro } from '../components/Shared/StyledIntro'
import { TableWithLoader } from '../components/Shared/TableWithLoader'
import { useAsyncFetch } from '../hooks/useAsyncFetch'
import { useMode } from '../hooks/useMode'
import { TempFilters } from '../components/TempFilters'
import { isAdmin } from '../lib/auth-utils'
import { PartyContext, TokenContext } from '../lib/context'
import { buildDynamicPath, getBits } from '../lib/router-utils'
import { useFeedback } from '../hooks/useFeedback'
import { StyledButton } from '../components/Shared/StyledButton'
import { ROUTES } from '../config/routes'
import { USER_PLATFORM_ROLE_LABEL, USER_ROLE_LABEL, USER_STATE_LABEL } from '../config/labels'
import { useUser } from '../hooks/useUser'
import { StyledTableRow } from '../components/Shared/StyledTableRow'
import { ActionMenu } from '../components/Shared/ActionMenu'
import { useHistory } from 'react-router'

export function UserList() {
  const location = useLocation()
  const { runAction, wrapActionInDialog, forceRerenderCounter } = useFeedback()
  const { isCurrentUser } = useUser()
  const history = useHistory()

  // Only for subscriber
  const locationBits = getBits(location)
  const clientId = locationBits[locationBits.length - 1]

  const mode = useMode()
  const { party } = useContext(PartyContext)
  const { token } = useContext(TokenContext)
  const endpoint = mode === 'provider' ? 'USER_GET_LIST' : 'OPERATOR_SECURITY_GET_LIST' // TODO: remove after integration with selfcare
  const endpointParams =
    mode === 'provider' ? { institutionId: party?.institutionId } : { clientId }
  const params = mode === 'provider' ? { productRoles: ['admin', 'api'].join(',') } : {}

  const { data, loadingText, error } = useAsyncFetch<Array<User>>(
    { path: { endpoint, endpointParams }, config: { params } },
    {
      useEffectDeps: [forceRerenderCounter, token],
      loaderType: 'contextual',
      loadingTextLabel: 'Stiamo caricando gli operatori',
    }
  )

  /*
   * List of possible actions for the user to perform
   */
  const wrapSuspend = (relationshipId: string) => async () => {
    await runAction(
      { path: { endpoint: 'USER_SUSPEND', endpointParams: { relationshipId } } },
      { suppressToast: false }
    )
  }

  const wrapReactivate = (relationshipId: string) => async () => {
    await runAction(
      { path: { endpoint: 'USER_REACTIVATE', endpointParams: { relationshipId } } },
      { suppressToast: false }
    )
  }
  /*
   * End list of actions
   */

  // Build list of available actions for each service in its current state
  const getAvailableActions = (user: User) => {
    // If same user, it cannot suspend or reactivate itself
    // also, only admins can handle other people
    if (isCurrentUser(user.from) || !isAdmin(party)) {
      return []
    }

    const suspendAction = {
      onClick: wrapActionInDialog(wrapSuspend(user.id), 'USER_SUSPEND'),
      label: 'Sospendi',
    }
    const reactivateAction = {
      onClick: wrapActionInDialog(wrapReactivate(user.id), 'USER_REACTIVATE'),
      label: 'Riattiva',
    }

    const availableActions: Record<UserState, Array<ActionProps>> = {
      PENDING: [],
      ACTIVE: [suspendAction],
      SUSPENDED: [reactivateAction],
    }

    // Return all the actions available for this particular status
    return availableActions[user.state] || []
  }

  // TEMP BACKEND: this should not happen, it depends on the difference between our API
  // and the one shared with self care, that doesn't expose name and surname
  const headData = ['nome e cognome', 'ruolo', 'permessi', 'stato', '']

  return (
    <React.Fragment>
      {mode === 'provider' && (
        <StyledIntro>
          {{
            title: "Operatori API dell'ente",
            description:
              "In quest’area puoi trovare e gestire tutti gli operatori API che sono stati abilitati alla gestione degli e-service dell'ente",
          }}
        </StyledIntro>
      )}

      {isAdmin(party) && (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 4 }}>
          <StyledButton
            variant="contained"
            to={
              mode === 'provider'
                ? ROUTES.PROVIDE_OPERATOR_CREATE.PATH
                : buildDynamicPath(ROUTES.SUBSCRIBE_CLIENT_OPERATOR_CREATE.PATH, { clientId })
            }
          >
            + Aggiungi
          </StyledButton>
        </Box>
      )}

      <TempFilters />

      <TableWithLoader
        loadingText={loadingText}
        headData={headData}
        data={data}
        noDataLabel="Non ci sono operatori disponibili"
        error={error}
      >
        {data?.map((item, i) => (
          <StyledTableRow
            key={i}
            cellData={[
              { label: `${item.name + ' ' + item.surname}` },
              { label: item.role ? USER_ROLE_LABEL[item.role] : '' },
              { label: item.product.role ? USER_PLATFORM_ROLE_LABEL[item.product.role] : '' },
              { label: USER_STATE_LABEL[item.state] },
            ]}
          >
            <StyledButton
              variant="outlined"
              size="small"
              onClick={() => {
                history.push(
                  mode === 'provider'
                    ? buildDynamicPath(ROUTES.PROVIDE_OPERATOR_EDIT.PATH, { operatorId: item.id })
                    : buildDynamicPath(ROUTES.SUBSCRIBE_CLIENT_OPERATOR_EDIT.PATH, {
                        clientId,
                        operatorId: item.id,
                      })
                )
              }}
            >
              Ispeziona
            </StyledButton>

            <ActionMenu actions={getAvailableActions(item)} />
          </StyledTableRow>
        ))}
      </TableWithLoader>
    </React.Fragment>
  )
}
