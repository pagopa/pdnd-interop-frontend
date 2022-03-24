import React, { FunctionComponent, useContext } from 'react'
import { useHistory } from 'react-router'
import { AddSecurityOperatorFormInputValues, ClientKind, User } from '../../types'
import { StyledIntro } from '../components/Shared/StyledIntro'
import { TableWithLoader } from '../components/Shared/TableWithLoader'
import { useAsyncFetch } from '../hooks/useAsyncFetch'
import { useMode } from '../hooks/useMode'
import { TempFilters } from '../components/TempFilters'
import { DialogContext, PartyContext, TokenContext } from '../lib/context'
import { buildDynamicPath, getBits } from '../lib/router-utils'
import { useFeedback } from '../hooks/useFeedback'
import { StyledButton } from '../components/Shared/StyledButton'
import { USER_STATE_LABEL } from '../config/labels'
import { StyledTableRow } from '../components/Shared/StyledTableRow'
import { axiosErrorToError } from '../lib/error-utils'
import { Alert } from '@mui/material'
import { isAdmin } from '../lib/auth-utils'
import { useRoute } from '../hooks/useRoute'
import { ActionMenu } from '../components/Shared/ActionMenu'
import { fetchAllWithLogs } from '../lib/api-utils'
import { PageTopFilters } from '../components/Shared/PageTopFilters'

type UserListProps = {
  clientKind?: ClientKind
}

export const UserList: FunctionComponent<UserListProps> = ({ clientKind = 'CONSUMER' }) => {
  const history = useHistory()
  const { routes } = useRoute()
  const { setDialog } = useContext(DialogContext)
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
  const params = mode === 'provider' ? { productRoles: ['api'].join(',') } : {}

  const {
    data: users,
    loadingText,
    error,
  } = useAsyncFetch<Array<User>>(
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
  const wrapRemoveFromClient = (relationshipId?: string) => async () => {
    await runAction(
      {
        path: {
          endpoint: 'OPERATOR_SECURITY_REMOVE_FROM_CLIENT',
          endpointParams: { clientId, relationshipId },
        },
      },
      { suppressToast: false }
    )
  }
  /*
   * End list of actions
   */

  const getAvailableActions = (user: User) => {
    if (mode === 'subscriber' && isAdmin(party)) {
      const removeFromClientAction = {
        onClick: wrapActionInDialog(
          wrapRemoveFromClient(user.relationshipId),
          'OPERATOR_SECURITY_REMOVE_FROM_CLIENT'
        ),
        label: 'Rimuovi dal client',
      }

      return [removeFromClientAction]
    }

    return []
  }

  const addOperators = async (data: AddSecurityOperatorFormInputValues) => {
    if (data.selected.length === 0) {
      return
    }

    const lastSelected = data.selected.pop()

    // TEMP REFACTOR: improve this with error messages, failure handling, etc
    await fetchAllWithLogs(
      data.selected.map(({ id }) => ({
        path: {
          endpoint: 'OPERATOR_SECURITY_JOIN_WITH_CLIENT',
          endpointParams: { clientId, relationshipId: id },
        },
      }))
    )

    // The last one also triggers the feedback toast
    await runAction(
      {
        path: {
          endpoint: 'OPERATOR_SECURITY_JOIN_WITH_CLIENT',
          endpointParams: { clientId, relationshipId: (lastSelected as User).id },
        },
      },
      { suppressToast: false }
    )
  }

  const openAddOperatoDialog = () => {
    setDialog({
      type: 'addSecurityOperator',
      initialValues: { selected: [] },
      onSubmit: addOperators,
      excludeIdsList: users?.map((u) => u.relationshipId).filter((id) => id) as
        | string[]
        | undefined,
    })
  }

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

  const headData = ['Nome e cognome', 'Stato']

  return (
    <React.Fragment>
      {mode === 'provider' && (
        <StyledIntro>
          {{
            title: "Operatori API dell'ente",
            description:
              "In quest’area puoi trovare e gestire tutti gli operatori API che sono stati abilitati alla gestione degli E-Service dell'ente",
          }}
        </StyledIntro>
      )}

      <PageTopFilters>
        <TempFilters />
        {isAdmin(party) && mode === 'subscriber' && (
          <StyledButton variant="contained" size="small" onClick={openAddOperatoDialog}>
            + Aggiungi
          </StyledButton>
        )}
      </PageTopFilters>

      <TableWithLoader
        loadingText={loadingText}
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
                { label: USER_STATE_LABEL[item.state] },
              ]}
            >
              <StyledButton
                variant="text"
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

      <Alert sx={{ mt: 1 }} severity="info">
        Se l&rsquo;operatore non è in elenco, in questa fase di test contattaci per aggiungerlo
      </Alert>
    </React.Fragment>
  )
}
