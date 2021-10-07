import React, { useContext } from 'react'
import { useLocation } from 'react-router'
import { Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import {
  ProviderOrSubscriber,
  ActionWithTooltipBtn,
  ActionWithTooltipLink,
  ActionWithTooltipProps,
  User,
  UserStatus,
} from '../../types'
import { StyledIntro } from '../components/StyledIntro'
import { ActionWithTooltip } from '../components/ActionWithTooltip'
import { TableWithLoader } from '../components/TableWithLoader'
import { WhiteBackground } from '../components/WhiteBackground'
import { UserFeedbackHOCProps, withUserFeedback } from '../components/withUserFeedback'
import { useAsyncFetch } from '../hooks/useAsyncFetch'
import {
  ROUTES,
  USER_PLATFORM_ROLE_LABEL,
  USER_ROLE_LABEL,
  USER_STATUS_LABEL,
} from '../lib/constants'
import { useMode } from '../hooks/useMode'
import { TempFilters } from '../components/TempFilters'
import { isAdmin, isOperatorSecurity } from '../lib/auth-utils'
import { PartyContext, UserContext } from '../lib/context'
import { getLastBit } from '../lib/url-utils'

function UserListComponent({
  runAction,
  wrapActionInDialog,
  forceRerenderCounter,
}: UserFeedbackHOCProps) {
  const clientId = getLastBit(useLocation()) // Only for subscriber

  const mode = useMode()
  const { party } = useContext(PartyContext)
  const { user } = useContext(UserContext)
  const endpoint = mode === 'provider' ? 'OPERATOR_API_GET_LIST' : 'OPERATOR_SECURITY_GET_LIST'
  const endpointParams =
    mode === 'provider' ? { institutionId: party?.institutionId } : { clientId }

  const { data, loading, error } = useAsyncFetch<User[]>(
    { path: { endpoint, endpointParams }, config: { method: 'GET' } },
    {
      defaultValue: [],
      useEffectDeps: [forceRerenderCounter, user],
      mapFn: (data) => {
        if (mode === 'subscriber' && isOperatorSecurity(party)) {
          return data.filter((d) => d.taxCode === user?.taxCode)
        }

        return data
      },
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
          method: 'POST',
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
          method: 'POST',
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
      icon: 'bi-pause-circle',
    }
    const reactivateAction = {
      onClick: wrapActionInDialog(
        wrapReactivate((user.taxCode || user.from) as string),
        'USER_REACTIVATE'
      ),
      label: 'Riattiva',
      icon: 'bi-play-circle',
    }

    const availableActions: { [key in UserStatus]: ActionWithTooltipProps[] } = {
      Pending: [],
      Active: [suspendAction],
      Suspended: [reactivateAction],
      pending: [],
      active: [suspendAction],
      suspended: [reactivateAction],
    }

    const status = party?.status

    // TEMP BACKEND: this should not happen, it depends on the difference between our API
    // and the one shared with self care
    const route =
      mode === 'provider'
        ? `${ROUTES.PROVIDE.SUBROUTES!.OPERATOR_API_LIST.PATH}/${user.taxCode || user.from}`
        : // TEMP REFACTOR: this is horrible but I'm in a hurry. Should find a way
          // to build a path like /client/:clientId/operator/:operatorId
          `${ROUTES.SUBSCRIBE.SUBROUTES!.OPERATOR_SECURITY_LIST.PATH}/${clientId}/${user.taxCode}`

    const inspectAction = {
      to: route,
      icon: 'bi-info-circle',
      label: 'Ispeziona',
    }

    // Get all the actions available for this particular status
    const actions: ActionWithTooltipProps[] = availableActions[status!] || []

    // Add the last action, which is always EDIT/INSPECT
    actions.push(inspectAction)

    return actions
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

  /*
   * Labels and buttons dependant on the current mode
   */
  const TITLES: { [key in ProviderOrSubscriber]: { title: string; description: string } } = {
    provider: {
      title: "Operatori API dell'ente",
      description:
        "In quest’area puoi trovare e gestire tutti gli operatori API che sono stati abilitati alla gestione degli e-service dell'ente",
    },
    subscriber: {
      title: 'Operatori di sicurezza del client',
      description:
        'In quest’area puoi trovare e gestire tutti gli operatori di sicurezza che sono stati abilitati a gestire le chiavi per il tuo client',
    },
  }

  const CREATE_ACTIONS = {
    provider: ROUTES.PROVIDE.SUBROUTES!.OPERATOR_API_CREATE,
    subscriber: ROUTES.SUBSCRIBE.SUBROUTES!.OPERATOR_SECURITY_CREATE,
  }
  /*
   * End labels and buttons
   */

  return (
    <WhiteBackground>
      <StyledIntro priority={2}>{TITLES[mode!]}</StyledIntro>

      <div className="mt-4">
        {isAdmin(party) && (
          <Button
            variant="primary"
            as={Link}
            to={`${CREATE_ACTIONS[mode!].PATH}${
              mode === 'subscriber' ? `?clientId=${clientId}` : ''
            }`}
          >
            {CREATE_ACTIONS[mode!].LABEL}
          </Button>
        )}

        <TempFilters />

        <TableWithLoader
          loading={loading}
          loadingLabel="Stiamo caricando gli operatori"
          headData={headData}
          pagination={true}
          data={data}
          noDataLabel="Non ci sono operatori disponibili"
          error={error}
        >
          {data?.map((item, i) => (
            <tr key={i}>
              {/*
               * TEMP BACKEND: this should not happen, it depends on the difference between our API
               * and the one shared with self care, that doesn't expose name and surname
               */}
              <td>{mode === 'provider' ? item.from : `${item.name + ' ' + item.surname}`}</td>
              <td>{USER_ROLE_LABEL[item.role]}</td>
              <td>{USER_PLATFORM_ROLE_LABEL[item.platformRole]}</td>
              <td>{USER_STATUS_LABEL[item.status]}</td>
              <td>
                {getAvailableActions(item).map((tableAction, j) => {
                  const btnProps: any = {}

                  if ((tableAction as ActionWithTooltipLink).to) {
                    btnProps.as = Link
                    btnProps.to = (tableAction as ActionWithTooltipLink).to
                  } else {
                    btnProps.onClick = (tableAction as ActionWithTooltipBtn).onClick
                  }

                  return (
                    <ActionWithTooltip
                      key={j}
                      btnProps={btnProps}
                      label={tableAction.label}
                      iconClass={tableAction.icon!}
                    />
                  )
                })}
              </td>
            </tr>
          ))}
        </TableWithLoader>
      </div>
    </WhiteBackground>
  )
}

export const UserList = withUserFeedback(UserListComponent)
