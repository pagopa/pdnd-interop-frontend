import React from 'react'
import { Link } from 'react-router-dom'
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
import { WhiteBackground } from '../components/WhiteBackground'
import { UserFeedbackHOCProps, withUserFeedback } from '../components/withUserFeedback'
import { useAsyncFetch } from '../hooks/useAsyncFetch'
import { ESERVICE_STATUS, ROUTES } from '../lib/constants'

function ClientListComponent({
  runFakeAction,
  wrapActionInDialog,
  forceUpdateCounter,
}: UserFeedbackHOCProps) {
  const { data, loading, error } = useAsyncFetch<Client[]>(
    {
      path: { endpoint: 'CLIENT_GET_LIST' },
      config: { method: 'GET' },
    },
    { defaultValue: [], useEffectDeps: [forceUpdateCounter] }
  )

  /*
   * List of possible actions for the user to perform
   */
  const suspend = () => {
    runFakeAction('Sospendi client')
  }

  const reactivate = () => {
    runFakeAction('Riattiva client')
  }
  /*
   * End list of actions
   */

  // Build list of available actions for each service in its current state
  const getAvailableActions = (client: Client) => {
    const availableActions: { [key in AgreementStatus]: any[] } = {
      pending: [],
      active: [{ onClick: wrapActionInDialog(suspend), label: 'sospendi', isMock: true }],
      suspended: [
        { proceedCallback: wrapActionInDialog(reactivate), label: 'riattiva', isMock: true },
      ],
    }

    const status = client.agreementStatus

    const inspectAction = {
      to: `${ROUTES.SUBSCRIBE.SUBROUTES!.CLIENT_LIST.PATH}/${client.id}`,
      icon: 'bi-info-circle',
      label: 'Ispeziona',
    }

    // Get all the actions available for this particular status
    const actions: TableActionProps[] = (availableActions as any)[status] || []

    // Add the last action, which is always EDIT/INSPECT
    actions.push(inspectAction)

    return actions
  }

  const headData = [
    'nome client',
    'nome servizio',
    'ente erogatore',
    'versione servizio',
    'stato servizio',
    '',
  ]

  return (
    <WhiteBackground>
      <StyledIntro>
        {{
          title: 'I tuoi client',
          description: "In quest'area puoi i trovare e gestire tutti i client che hai creato",
        }}
      </StyledIntro>

      <div className="mt-4">
        <h1 className="py-3" style={{ color: 'red' }}>
          Aggiungere filtri
        </h1>

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
              <td>{item.serviceName}</td>
              <td>{item.providerName}</td>
              <td>{item.serviceVersion}</td>
              <td>{ESERVICE_STATUS[item.serviceStatus]}</td>
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
                      iconClass={tableAction.icon}
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
