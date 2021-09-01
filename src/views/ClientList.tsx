import React from 'react'
import { Link } from 'react-router-dom'
import { AgreementStatus, Client, TableActionBtn } from '../../types'
import { StyledIntro } from '../components/StyledIntro'
import { TableAction } from '../components/TableAction'
import { TableWithLoader } from '../components/TableWithLoader'
import { WhiteBackground } from '../components/WhiteBackground'
import { useAsyncFetch } from '../hooks/useAsyncFetch'
import { ESERVICE_STATUS, ROUTES } from '../lib/constants'

export function ClientList() {
  const { data, loading, error } = useAsyncFetch<Client[]>(
    {
      path: { endpoint: 'CLIENT_GET_LIST' },
      config: { method: 'GET' },
    },
    []
  )

  const getAvailableActions = (client: Client) => {
    const availableActions: { [key in AgreementStatus]: TableActionBtn[] } = {
      active: [],
      suspended: [],
      pending: [],
    }

    const status = client.agreementStatus

    // If status === 'draft', show precompiled write template. Else, readonly template
    const inspectAction = {
      to: `${ROUTES.SUBSCRIBE.SUBROUTES!.CLIENT_LIST.PATH}/${client.id}`,
      icon: 'bi-info-circle',
      label: 'Ispeziona',
    }

    // Get all the actions available for this particular status
    const actions: TableActionBtn[] = (availableActions as any)[status] || []

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
          {data?.map((item, i) => (
            <tr key={i}>
              <td>{item.name}</td>
              <td>{item.serviceName}</td>
              <td>{item.providerName}</td>
              <td>{item.serviceVersion}</td>
              <td>{ESERVICE_STATUS[item.serviceStatus]}</td>
              <td>
                {getAvailableActions(item).map(({ to, onClick, icon, label }, j) => {
                  const btnProps: any = { onClick }

                  if (to) {
                    btnProps.as = Link
                    btnProps.to = to
                    delete btnProps.onClick // Redundant, here just for clarity
                  }

                  return <TableAction key={j} btnProps={btnProps} label={label} iconClass={icon} />
                })}
              </td>
            </tr>
          ))}
        </TableWithLoader>
      </div>
    </WhiteBackground>
  )
}
