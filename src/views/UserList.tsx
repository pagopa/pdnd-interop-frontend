import React, { FunctionComponent, useContext } from 'react'
import { useHistory } from 'react-router'
import { ClientKind, User } from '../../types'
import { StyledIntro } from '../components/Shared/StyledIntro'
import { TableWithLoader } from '../components/Shared/TableWithLoader'
import { useAsyncFetch } from '../hooks/useAsyncFetch'
import { useMode } from '../hooks/useMode'
import { TempFilters } from '../components/TempFilters'
import { PartyContext, TokenContext } from '../lib/context'
import { buildDynamicPath, getBits } from '../lib/router-utils'
import { useFeedback } from '../hooks/useFeedback'
import { StyledButton } from '../components/Shared/StyledButton'
import { USER_PLATFORM_ROLE_LABEL, USER_ROLE_LABEL, USER_STATE_LABEL } from '../config/labels'
import { StyledTableRow } from '../components/Shared/StyledTableRow'
import { axiosErrorToError } from '../lib/error-utils'
import { Box } from '@mui/material'
import { isAdmin } from '../lib/auth-utils'
import { useRoute } from '../hooks/useRoute'
import { ActionMenu } from '../components/Shared/ActionMenu'

type UserListProps = {
  clientKind?: ClientKind
}

export const UserList: FunctionComponent<UserListProps> = ({ clientKind = 'consumer' }) => {
  const history = useHistory()
  const { routes } = useRoute()
  const { runAction, wrapActionInDialog, forceRerenderCounter } = useFeedback()

  // Only for subscriber
  const locationBits = getBits(history.location)
  const clientId = locationBits[locationBits.length - 1]

  const mode = useMode()
  const { party } = useContext(PartyContext)
  const { token } = useContext(TokenContext)
  // TEMP REFACTOR: remove after integration with selfcare
  const endpoint = mode === 'provider' ? 'USER_GET_LIST' : 'OPERATOR_SECURITY_GET_LIST'
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
  const wrapRemoveFromClient = (relationshipId: string) => async () => {
    await runAction(
      {
        path: {
          endpoint: 'OPERATOR_SECURITY_REMOVE_FROM_CLIENT',
          endpointParams: { relationshipId },
        },
      },
      { suppressToast: false }
    )
  }
  /*
   * End list of actions
   */

  const getAvailableActions = (user: User) => {
    if (mode === 'subscriber') {
      const removeFromClientAction = {
        onClick: wrapActionInDialog(
          wrapRemoveFromClient(user.id),
          'OPERATOR_SECURITY_REMOVE_FROM_CLIENT'
        ),
        label: 'Rimuovi dal client',
      }

      return [removeFromClientAction]
    }

    return []
  }

  const getAddBtnRoute = () => {
    if (mode === 'provider') {
      return routes.PROVIDE_OPERATOR_CREATE.PATH
    }

    const subscriberPath =
      clientKind === 'api'
        ? routes.SUBSCRIBE_INTEROP_M2M_CLIENT_OPERATOR_CREATE.PATH
        : routes.SUBSCRIBE_CLIENT_OPERATOR_CREATE.PATH
    return buildDynamicPath(subscriberPath, { clientId })
  }

  const getEditBtnRoute = (item: User) => {
    if (mode === 'provider') {
      return buildDynamicPath(routes.PROVIDE_OPERATOR_EDIT.PATH, { operatorId: item.id })
    }

    const subscriberRoute =
      clientKind === 'api'
        ? routes.SUBSCRIBE_INTEROP_M2M_CLIENT_OPERATOR_EDIT.PATH
        : routes.SUBSCRIBE_CLIENT_OPERATOR_EDIT.PATH

    return buildDynamicPath(subscriberRoute, { clientId, operatorId: item.id })
  }

  const headData = ['nome e cognome', 'ruolo', 'permessi', 'stato']

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
          <StyledButton variant="contained" to={getAddBtnRoute()}>
            + Aggiungi
          </StyledButton>
        </Box>
      )}

      <TempFilters />

      <TableWithLoader
        loadingText={loadingText}
        headData={headData}
        noDataLabel="Non ci sono operatori disponibili"
        error={axiosErrorToError(error)}
      >
        {data &&
          Boolean(data.length > 0) &&
          data.map((item, i) => (
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
                  history.push(getEditBtnRoute(item))
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
