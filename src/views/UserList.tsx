import React, { useContext } from 'react'
import { useLocation } from 'react-router'
import { User, UserStatus, ActionProps } from '../../types'
import { StyledIntro } from '../components/Shared/StyledIntro'
import { TableWithLoader } from '../components/Shared/TableWithLoader'
import { useAsyncFetch } from '../hooks/useAsyncFetch'
import {
  ROUTES,
  USER_PLATFORM_ROLE_LABEL,
  USER_ROLE_LABEL,
  USER_STATUS_LABEL,
} from '../lib/constants'
import { useMode } from '../hooks/useMode'
import { TempFilters } from '../components/TempFilters'
import { isAdmin, isOperatorAPI, isOperatorSecurity } from '../lib/auth-utils'
import { PartyContext, UserContext } from '../lib/context'
import { buildDynamicPath, getBits } from '../lib/url-utils'
import { useFeedback } from '../hooks/useFeedback'
import { StyledButton } from '../components/Shared/StyledButton'
import { StyledLink } from '../components/Shared/StyledLink'
import { StyledTableRow } from '../components/Shared/StyledTableRow'

export function UserList() {
  const location = useLocation()
  const { runAction, wrapActionInDialog, forceRerenderCounter } = useFeedback()

  // Only for subscriber
  const locationBits = getBits(location)
  const clientId = locationBits[locationBits.length - 2]

  const mode = useMode()
  const { party } = useContext(PartyContext)
  const { user } = useContext(UserContext)
  const endpoint = mode === 'provider' ? 'OPERATOR_API_GET_LIST' : 'OPERATOR_SECURITY_GET_LIST'
  const endpointParams =
    mode === 'provider' ? { institutionId: party?.institutionId } : { clientId }

  const { data, loadingText, error } = useAsyncFetch<User[]>(
    { path: { endpoint, endpointParams } },
    {
      defaultValue: [],
      useEffectDeps: [forceRerenderCounter, user],
      // TEMP BACKEND: Waiting for new onboarding API with user filtering
      mapFn: (data) => {
        if (isOperatorSecurity(party) || isOperatorAPI(party)) {
          return data.filter((d) => d.taxCode === user?.taxCode)
        }

        if (mode === 'subscriber') {
          return data.filter((d) => d.platformRole === 'security')
        }

        return data.filter((d) => ['admin', 'api'].includes(d.platformRole))
      },
      loaderType: 'contextual',
      loadingTextLabel: 'Stiamo caricando gli operatori',
    }
  )

  /*
   * List of possible actions for the user to perform
   */
  const wrapSuspend = (taxCode: string) => async (_: any) => {
    await runAction(
      {
        path: {
          endpoint: 'USER_SUSPEND',
          endpointParams: { taxCode, institutionId: party?.institutionId },
        },
        config: {
          data: { platformRole: mode === 'provider' ? 'api' : 'security' },
        },
      },
      { suppressToast: false }
    )
  }

  const wrapReactivate = (taxCode: string) => async (_: any) => {
    await runAction(
      {
        path: {
          endpoint: 'USER_REACTIVATE',
          endpointParams: { taxCode, institutionId: party?.institutionId },
        },
        config: {
          data: { platformRole: mode === 'provider' ? 'api' : 'security' },
        },
      },
      { suppressToast: false }
    )
  }
  /*
   * End list of actions
   */

  // Build list of available actions for each service in its current state
  const getAvailableActions = (user: User) => {
    const suspendAction = {
      onClick: wrapActionInDialog(
        wrapSuspend((user.taxCode || user.from) as string),
        'USER_SUSPEND'
      ),
      label: 'Sospendi',
    }
    const reactivateAction = {
      onClick: wrapActionInDialog(
        wrapReactivate((user.taxCode || user.from) as string),
        'USER_REACTIVATE'
      ),
      label: 'Riattiva',
    }

    const availableActions: { [key in UserStatus]: ActionProps[] } = {
      pending: [],
      active: [suspendAction],
      suspended: [reactivateAction],
    }

    // Return all the actions available for this particular status
    return availableActions[party!.status] || []
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
        <StyledButton
          sx={{ mb: 4 }}
          variant="contained"
          component={StyledLink}
          to={
            mode === 'provider'
              ? ROUTES.PROVIDE.SUBROUTES!.OPERATOR.SUBROUTES!.CREATE.PATH
              : buildDynamicPath(
                  ROUTES.SUBSCRIBE.SUBROUTES!.CLIENT.SUBROUTES!.HANDLE.SUBROUTES!.OPERATOR
                    .SUBROUTES!.CREATE.PATH,
                  { id: clientId }
                )
          }
        >
          {' '}
          + Aggiungi
        </StyledButton>
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
              /*
               * TEMP BACKEND: this should not happen, it depends on the difference between our API
               * and the one shared with self care, that doesn't expose name and surname
               */
              { label: mode === 'provider' ? item.from! : `${item.name + ' ' + item.surname}` },
              { label: USER_ROLE_LABEL[item.role] },
              { label: USER_PLATFORM_ROLE_LABEL[item.platformRole] },
              { label: USER_STATUS_LABEL[item.status] },
            ]}
            index={i}
            singleActionBtn={{
              to:
                mode === 'provider'
                  ? buildDynamicPath(ROUTES.PROVIDE.SUBROUTES!.OPERATOR.SUBROUTES!.EDIT.PATH, {
                      id: (item.taxCode || item.from) as string,
                    })
                  : buildDynamicPath(
                      ROUTES.SUBSCRIBE.SUBROUTES!.CLIENT.SUBROUTES!.HANDLE.SUBROUTES!.OPERATOR
                        .SUBROUTES!.EDIT.PATH,
                      { id: clientId, operatorId: item.taxCode }
                    ),
              label: 'Gestisci',
            }}
            actions={getAvailableActions(item)}
          />
        ))}
      </TableWithLoader>
    </React.Fragment>
  )
}
