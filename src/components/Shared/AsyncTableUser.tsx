import React, { useContext } from 'react'
import { useHistory } from 'react-router-dom'
import { Box } from '@mui/system'
import { ActionProps, ClientKind, Party, ProviderOrSubscriber, User } from '../../../types'
import { useAsyncFetch } from '../../hooks/useAsyncFetch'
import { RunAction } from '../../hooks/useFeedback'
import { useRoute } from '../../hooks/useRoute'
import { isAdmin } from '../../lib/auth-utils'
import { TokenContext } from '../../lib/context'
import { axiosErrorToError } from '../../lib/error-utils'
import { buildDynamicPath } from '../../lib/router-utils'
import { ActionMenu } from './ActionMenu'
import { StyledButton } from './StyledButton'
import { StyledTableRow } from './StyledTableRow'
import { TableWithLoader } from './TableWithLoader'
import { useTranslation } from 'react-i18next'

type AsyncTableUserProps = {
  forceRerenderCounter: number
  runAction: RunAction
  clientId: string
  clientKind: ClientKind
  mode: ProviderOrSubscriber | null
  party: Party | null
}

export const AsyncTableUser = ({
  forceRerenderCounter,
  runAction,
  clientId,
  clientKind,
  mode,
  party,
}: AsyncTableUserProps) => {
  const { t } = useTranslation('common')
  const { routes } = useRoute()
  const history = useHistory()
  const { token } = useContext(TokenContext)
  // TEMP REFACTOR: remove after integration with selfcare
  const endpoint = mode === 'provider' ? 'USER_GET_LIST' : 'OPERATOR_SECURITY_GET_LIST'
  const endpointParams =
    mode === 'provider' ? { institutionId: party?.institutionId } : { clientId }
  const params = mode === 'provider' ? { productRoles: ['api'].join(',') } : {}

  const {
    data: users,
    error,
    isLoading,
  } = useAsyncFetch<Array<User>>(
    { path: { endpoint, endpointParams }, config: { params } },
    { useEffectDeps: [forceRerenderCounter, token] }
  )

  const getEditBtnRoute = (item: User) => {
    if (mode === 'provider') {
      return buildDynamicPath(routes.PROVIDE_OPERATOR_EDIT.PATH, { operatorId: item.id })
    }

    const subscriberRoute =
      clientKind === 'API'
        ? routes.SUBSCRIBE_INTEROP_M2M_CLIENT_OPERATOR_EDIT.PATH
        : routes.SUBSCRIBE_CLIENT_OPERATOR_EDIT.PATH

    return buildDynamicPath(subscriberRoute, { clientId, operatorId: item.relationshipId })
  }

  /*
   * List of possible actions for the user to perform
   */
  const wrapRemoveFromClient = (relationshipId?: string) => async () => {
    await runAction(
      {
        path: {
          endpoint: 'OPERATOR_SECURITY_REMOVE_FROM_CLIENT',
          endpointParams: { clientId, relationshipId },
        },
      },
      { showConfirmDialog: true }
    )
  }
  /*
   * End list of actions
   */

  const getAvailableActions = (user: User) => {
    let actions: Array<ActionProps> = []

    if (mode === 'subscriber' && isAdmin(party)) {
      const removeFromClientAction = {
        onClick: wrapRemoveFromClient(user.relationshipId),
        label: 'Rimuovi dal client',
      }

      actions = [removeFromClientAction]
    }

    return actions
  }

  const headData = ['Nome e cognome', 'Stato', '']

  return (
    <TableWithLoader
      isLoading={isLoading}
      loadingText="Stiamo caricando gli operatori"
      headData={headData}
      noDataLabel="Non ci sono operatori disponibili"
      error={axiosErrorToError(error)}
    >
      {users &&
        Boolean(users.length > 0) &&
        users.map((item, i) => (
          <StyledTableRow
            key={i}
            cellData={[
              { label: `${item.name + ' ' + item.surname}` },
              { label: t(`status.user.${item.state}`) },
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

            <Box component="span" sx={{ ml: 2, display: 'inline-block' }}>
              <ActionMenu actions={getAvailableActions(item)} />
            </Box>
          </StyledTableRow>
        ))}
    </TableWithLoader>
  )
}
