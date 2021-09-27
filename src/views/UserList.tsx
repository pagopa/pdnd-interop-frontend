import React, { useContext } from 'react'
import { useLocation } from 'react-router'
import compose from 'lodash/fp/compose'
import { Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import {
  AgreementStatus,
  ProviderOrSubscriber,
  ActionWithTooltipBtn,
  ActionWithTooltipLink,
  ActionWithTooltipProps,
  User,
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
import { withToastOnMount } from '../components/withToastOnMount'
import { TempFilters } from '../components/TempFilters'
import { isAdmin } from '../lib/auth-utils'
import { PartyContext } from '../lib/context'
import { getLastBit } from '../lib/url-utils'

function UserListComponent({
  runFakeAction,
  wrapActionInDialog,
  forceRerenderCounter,
}: UserFeedbackHOCProps) {
  const clientId = getLastBit(useLocation()) // Only for subscriber

  const mode = useMode()
  const { party } = useContext(PartyContext)
  const endpoint = mode === 'provider' ? 'OPERATOR_API_GET_LIST' : 'OPERATOR_SECURITY_GET_LIST'
  const endpointParams = mode === 'provider' ? {} : { clientId }

  const { data, loading, error } = useAsyncFetch<User[]>(
    {
      path: { endpoint, endpointParams },
      config: { method: 'GET' }, // TEMP PIN-219: users must be filtered by clientId or instutitionId
    },
    { defaultValue: [], useEffectDeps: [forceRerenderCounter] }
  )

  /*
   * List of possible actions for the user to perform
   */
  const wrapSuspend = (taxCode: string) => async (_: any) => {
    runFakeAction('Sospendi utente ' + taxCode)
  }

  const wrapReactivate = (taxCode: string) => async (_: any) => {
    runFakeAction('Riattiva utente ' + taxCode)
  }
  /*
   * End list of actions
   */

  // Build list of available actions for each service in its current state
  const getAvailableActions = (user: User) => {
    const availableActions: { [key in AgreementStatus]: ActionWithTooltipProps[] } = {
      pending: [],
      active: [
        {
          onClick: wrapActionInDialog(wrapSuspend(user.taxCode)),
          label: 'sospendi',
          icon: 'bi-pause-circle',
          isMock: true,
        },
      ],
      suspended: [
        {
          onClick: wrapActionInDialog(wrapReactivate(user.taxCode)),
          label: 'riattiva',
          icon: 'bi-play-circle',
          isMock: true,
        },
      ],
    }

    const status = user.status

    const route =
      mode === 'provider'
        ? `${ROUTES.PROVIDE.SUBROUTES!.OPERATOR_API_LIST.PATH}/${user.taxCode}`
        : // TEMP REFACTOR: this is horrible but I'm in a hurry. Should find a way
          // to build a path like /client/:clientId/operator/:operatorId
          `${ROUTES.SUBSCRIBE.SUBROUTES!.OPERATOR_SECURITY_LIST.PATH}/${clientId}/${user.taxCode}`

    const inspectAction = {
      to: route,
      icon: 'bi-info-circle',
      label: 'Ispeziona',
    }

    // Get all the actions available for this particular status
    const actions: ActionWithTooltipProps[] = (availableActions as any)[status] || []

    // Add the last action, which is always EDIT/INSPECT
    actions.push(inspectAction)

    return actions
  }

  const headData = ['nome e cognome', 'ruolo', 'permessi', 'stato', '']

  /*
   * Labels and buttons dependant on the current mode
   */
  const TITLES: { [key in ProviderOrSubscriber]: { title: string; description: string } } = {
    provider: {
      title: 'I tuoi operatori API',
      description:
        "In quest’area puoi trovare e gestire tutti gli operatori API che sono stati abilitati alla gestione degli e-service dell'ente",
    },
    subscriber: {
      title: 'I tuoi operatori di sicurezza',
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
      <StyledIntro priority={2} additionalClasses="fakeData fakeDataStart">
        {TITLES[mode!]}
      </StyledIntro>

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
          {data.map((item, i) => (
            <tr key={i}>
              <td>
                {item.name} {item.surname}
              </td>
              <td>{USER_ROLE_LABEL[item.role]}</td>
              <td>{USER_PLATFORM_ROLE_LABEL[item.platformRole]}</td>
              <td>
                {/* TEMP BACKEND */}
                {USER_STATUS_LABEL[item.status] || 'attivo'}
              </td>
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
                      isMock={tableAction.isMock}
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

export const UserList = compose(withUserFeedback, withToastOnMount)(UserListComponent)
