import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { Button } from 'react-bootstrap'
import {
  Client,
  ClientStatus,
  ActionWithTooltipBtn,
  ActionWithTooltipLink,
  ActionWithTooltipProps,
} from '../../types'
import { StyledIntro } from '../components/StyledIntro'
import { ActionWithTooltip } from '../components/ActionWithTooltip'
import { TableWithLoader } from '../components/TableWithLoader'
import { TempFilters } from '../components/TempFilters'
import { WhiteBackground } from '../components/WhiteBackground'
import { useAsyncFetch } from '../hooks/useAsyncFetch'
import { getClientComputedStatus } from '../lib/status-utils'
import { isAdmin, isOperatorSecurity } from '../lib/auth-utils'
import { COMPUTED_STATUS_LABEL, ROUTES } from '../lib/constants'
import { PartyContext, UserContext } from '../lib/context'
import { useFeedback } from '../hooks/useFeedback'
import { buildDynamicPath } from '../lib/url-utils'

export function ClientList() {
  const { runAction, wrapActionInDialog, forceRerenderCounter } = useFeedback()
  const { user } = useContext(UserContext)
  const { party } = useContext(PartyContext)
  const { data, loadingText, error } = useAsyncFetch<Client[]>(
    {
      path: { endpoint: 'CLIENT_GET_LIST' },
      config: {
        params: {
          institutionId: party?.institutionId,
          operatorTaxCode: isOperatorSecurity(party) ? user?.taxCode : undefined,
        },
      },
    },
    {
      defaultValue: [],
      useEffectDeps: [forceRerenderCounter, user],
      loaderType: 'contextual',
      loadingTextLabel: 'Stiamo caricando i client',
    }
  )

  /*
   * List of possible actions for the user to perform
   */
  const wrapSuspend = (clientId: string) => async (_: any) => {
    await runAction(
      {
        path: { endpoint: 'CLIENT_SUSPEND', endpointParams: { clientId } },
      },
      { suppressToast: false }
    )
  }

  const wrapReactivate = (clientId: string) => async (_: any) => {
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
  const getAvailableActions = (client: Client): ActionWithTooltipProps[] => {
    const inspectAction = {
      to: buildDynamicPath(ROUTES.SUBSCRIBE.SUBROUTES!.CLIENT_EDIT.PATH, { id: client.id }),
      icon: 'bi-info-circle',
      label: 'Ispeziona',
    }

    // Exit early if user cannot perform actions
    if (!isAdmin(party)) {
      return [inspectAction]
    }

    const availableActions: { [key in ClientStatus]: ActionWithTooltipProps[] } = {
      active: [
        {
          onClick: wrapActionInDialog(wrapSuspend(client.id), 'CLIENT_SUSPEND'),
          label: 'Sospendi client',
          icon: 'bi-pause-circle',
        },
      ],
      suspended: [
        {
          onClick: wrapActionInDialog(wrapReactivate(client.id), 'CLIENT_ACTIVATE'),
          label: 'Riattiva client',
          icon: 'bi-play-circle',
        },
      ],
    }

    const status = client.status

    // Get all the actions available for this particular status
    const actions: ActionWithTooltipProps[] = (availableActions as any)[status] || []

    // Add the last action, which is always EDIT/INSPECT
    actions.push(inspectAction)

    return actions
  }

  const headData = ['nome client', 'nome e-service', 'ente erogatore', 'stato', '']

  return (
    <WhiteBackground>
      <StyledIntro priority={2}>
        {{
          title: 'I tuoi client',
          description: "In quest'area puoi i trovare e gestire tutti i client che hai creato",
        }}
      </StyledIntro>

      <div className="mt-4">
        {isAdmin(party) && (
          <Button variant="primary" as={Link} to={ROUTES.SUBSCRIBE.SUBROUTES!.CLIENT_CREATE.PATH}>
            {ROUTES.SUBSCRIBE.SUBROUTES!.CLIENT_CREATE.LABEL}
          </Button>
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
          {data.map((item, i) => (
            <tr key={i}>
              <td>{item.name}</td>
              <td>{item.eservice.name}</td>
              <td>{item.eservice.provider.description}</td>
              <td>{COMPUTED_STATUS_LABEL[getClientComputedStatus(item)]}</td>
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
