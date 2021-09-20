import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { Button } from 'react-bootstrap'
import {
  AgreementStatus,
  Client,
  TableActionBtn,
  TableActionLink,
  TableActionProps,
} from '../../types'
import { StyledIntro } from '../components/StyledIntro'
import { TableAction } from '../components/TableAction'
import { TableWithLoader } from '../components/TableWithLoader'
import { TempFilters } from '../components/TempFilters'
import { WhiteBackground } from '../components/WhiteBackground'
import { UserFeedbackHOCProps, withUserFeedback } from '../components/withUserFeedback'
import { useAsyncFetch } from '../hooks/useAsyncFetch'
import { getClientComputedStatus } from '../lib/ client-utils'
import { isAdmin } from '../lib/auth-utils'
import { CLIENT_COMPUTED_STATUS_LABEL, ROUTES } from '../lib/constants'
import { PartyContext, UserContext } from '../lib/context'

function ClientListComponent({
  runFakeAction,
  wrapActionInDialog,
  forceRerenderCounter,
}: UserFeedbackHOCProps) {
  const { party } = useContext(PartyContext)
  const { user } = useContext(UserContext)
  const { data, loading, error } = useAsyncFetch<Client[]>(
    {
      path: { endpoint: 'CLIENT_GET_LIST' },
      config: {
        method: 'GET',
        params: {
          eServiceId: '8c80626c-2dec-4103-981d-ce102c633a3b', // TEMP PIN-540: hardcoded eServiceId should be deleted
          institutionId: party?.institutionId,
        },
      },
    },
    { defaultValue: [], useEffectDeps: [forceRerenderCounter] }
  )

  // TEMP BACKEND should send client status
  if (data.length > 0 && !data[0].status) {
    data.forEach((_, i) => {
      data[i].status = 'active'
    })
  }

  /*
   * List of possible actions for the user to perform
   */
  const wrapSuspend = (clientId: string) => async (_: any) => {
    runFakeAction('Sospendi client ' + clientId)
  }

  const wrapReactivate = (clientId: string) => async (_: any) => {
    runFakeAction('Riattiva client ' + clientId)
  }
  /*
   * End list of actions
   */

  // Build list of available actions for each service in its current state
  const getAvailableActions = (client: Client) => {
    const inspectAction = {
      to: `${ROUTES.SUBSCRIBE.SUBROUTES!.CLIENT_LIST.PATH}/${client.id}`,
      icon: 'bi-info-circle',
      label: 'Ispeziona',
    }

    // Exit early if user cannot perform actions
    if (!isAdmin(user)) {
      return [inspectAction]
    }

    const availableActions: { [key in AgreementStatus]: TableActionProps[] } = {
      pending: [],
      active: [
        {
          onClick: wrapActionInDialog(wrapSuspend(client.id)),
          label: 'sospendi',
          icon: 'bi-pause-circle',
          isMock: true,
        },
      ],
      suspended: [
        {
          onClick: wrapActionInDialog(wrapReactivate(client.id)),
          label: 'riattiva',
          icon: 'bi-play-circle',
          isMock: true,
        },
      ],
    }

    const status = client.agreement.status

    // Get all the actions available for this particular status
    const actions: TableActionProps[] = (availableActions as any)[status] || []

    // Add the last action, which is always EDIT/INSPECT
    actions.push(inspectAction)

    return actions
  }

  const headData = ['nome client', 'nome servizio', 'ente erogatore', 'stato', '']

  return (
    <WhiteBackground>
      <StyledIntro additionalClasses="fakeData fakeDataStart">
        {{
          title: 'I tuoi client',
          description: "In quest'area puoi i trovare e gestire tutti i client che hai creato",
        }}
      </StyledIntro>

      <div className="mt-4">
        {isAdmin(user) && (
          <Button variant="primary" as={Link} to={ROUTES.SUBSCRIBE.SUBROUTES!.CLIENT_CREATE.PATH}>
            {ROUTES.SUBSCRIBE.SUBROUTES!.CLIENT_CREATE.LABEL}
          </Button>
        )}

        <TempFilters />

        <TableWithLoader
          loading={loading}
          loadingLabel="Stiamo caricando i client"
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
              <td>{CLIENT_COMPUTED_STATUS_LABEL[getClientComputedStatus(item)]}</td>
              <td>
                {getAvailableActions(item).map((tableAction, j) => {
                  const btnProps: any = {}

                  if ((tableAction as TableActionLink).to) {
                    btnProps.as = Link
                    btnProps.to = (tableAction as TableActionLink).to
                  } else {
                    btnProps.onClick = (tableAction as TableActionBtn).onClick
                  }

                  return (
                    <TableAction
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

export const ClientList = withUserFeedback(ClientListComponent)
