import React, { useContext } from 'react'
import { useLocation } from 'react-router'
import { Box } from '@mui/system'
import { UserStatus, ActionProps, Party, UUser } from '../../types'
import { StyledIntro } from '../components/Shared/StyledIntro'
import { TableWithLoader } from '../components/Shared/TableWithLoader'
import { useAsyncFetch } from '../hooks/useAsyncFetch'
import { useMode } from '../hooks/useMode'
import { TempFilters } from '../components/TempFilters'
import { isAdmin } from '../lib/auth-utils'
import { PartyContext, UserContext } from '../lib/context'
import { buildDynamicPath, getBits } from '../lib/router-utils'
import { useFeedback } from '../hooks/useFeedback'
import { StyledButton } from '../components/Shared/StyledButton'
import { StyledTableRow } from '../components/Shared/StyledTableRow'
import { ROUTES } from '../config/routes'
import { USER_PLATFORM_ROLE_LABEL, USER_ROLE_LABEL, USER_STATUS_LABEL } from '../config/labels'

export function UserList() {
  const location = useLocation()
  const { runAction, wrapActionInDialog, forceRerenderCounter } = useFeedback()

  // Only for subscriber
  const locationBits = getBits(location)
  const clientId = locationBits[locationBits.length - 1]

  const mode = useMode()
  const { party } = useContext(PartyContext)
  const { user } = useContext(UserContext)
  const endpoint = mode === 'provider' ? 'OPERATOR_API_GET_LIST' : 'OPERATOR_SECURITY_GET_LIST'
  const endpointParams =
    mode === 'provider' ? { institutionId: party?.institutionId } : { clientId }
  const params = mode === 'provider' ? { productRoles: ['admin', 'api'].join(',') } : {}

  const { data, loadingText, error } = useAsyncFetch<Array<UUser>>(
    { path: { endpoint, endpointParams }, config: { params } },
    {
      useEffectDeps: [forceRerenderCounter, user],
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
  const getAvailableActions = (user: UUser) => {
    const suspendAction = {
      onClick: wrapActionInDialog(wrapSuspend(user.id), 'USER_SUSPEND'),
      label: 'Sospendi',
    }
    const reactivateAction = {
      onClick: wrapActionInDialog(wrapReactivate(user.id), 'USER_REACTIVATE'),
      label: 'Riattiva',
    }

    const availableActions: Record<UserStatus, Array<ActionProps>> = {
      PENDING: [],
      ACTIVE: [suspendAction],
      SUSPENDED: [reactivateAction],
    }

    console.log({ party })

    // Return all the actions available for this particular status
    const { state } = party as Party
    return availableActions[state] || []
  }

  // TEMP BACKEND: this should not happen, it depends on the difference between our API
  // and the one shared with self care, that doesn't expose name and surname
  const headData = [
    mode === 'provider' ? 'codice fiscale' : 'nome e cognome',
    'ruolo',
    'permessi',
    'stato',
    '',
  ]

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
                : buildDynamicPath(ROUTES.SUBSCRIBE_CLIENT_OPERATOR_CREATE.PATH, { id: clientId })
            }
          >
            {' '}
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
              { label: USER_STATUS_LABEL[item.state] },
            ]}
            index={i}
            singleActionBtn={{
              to:
                mode === 'provider'
                  ? buildDynamicPath(ROUTES.PROVIDE_OPERATOR_EDIT.PATH, { id: item.id })
                  : buildDynamicPath(ROUTES.SUBSCRIBE_CLIENT_OPERATOR_EDIT.PATH, {
                      id: clientId,
                      operatorId: item.id,
                    }),
              label: 'Gestisci',
            }}
            actions={getAvailableActions(item)}
          />
        ))}
      </TableWithLoader>
    </React.Fragment>
  )
}
