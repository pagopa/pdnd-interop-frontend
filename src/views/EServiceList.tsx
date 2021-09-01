import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { WhiteBackground } from '../components/WhiteBackground'
import { ESERVICE_STATUS, ROUTES } from '../lib/constants'
import { Button } from 'react-bootstrap'
import { PartyContext } from '../lib/context'
import { EServiceStatus, EServiceSummary } from '../../types'
import { TableWithLoader } from '../components/TableWithLoader'
import { TableAction } from '../components/TableAction'
import { StyledIntro } from '../components/StyledIntro'
import { useAsyncFetch } from '../hooks/useAsyncFetch'
import { showTempAlert } from '../lib/wip-utils'

type Action = {
  to?: string
  onClick?: any
  icon: string
  label: string
  isMock?: boolean
}

export function EServiceList() {
  const { party } = useContext(PartyContext)
  const { data, loading, error } = useAsyncFetch<EServiceSummary[]>(
    {
      path: { endpoint: 'ESERVICE_GET_LIST' },
      config: { method: 'GET', params: { producerId: party?.partyId } },
    },
    []
  )

  const getAvailableActions = (service: any) => {
    const availableActions: { [key in EServiceStatus]: any } = {
      active: [
        {
          onClick: () => {
            showTempAlert('Sospendi servizio')
          },
          icon: 'bi-pause-circle',
          label: 'Sospendi',
          isMock: true,
        },
      ],
      archived: [],
      deprecated: [
        {
          onClick: () => {
            showTempAlert('Sospendi servizio')
          },
          icon: 'bi-pause-circle',
          label: 'Sospendi',
          isMock: true,
        },
        {
          onClick: () => {
            // Can only archive if all agreements on that version are archived
            // Check with backend if this can be automated
            showTempAlert('Archivia servizio')
          },
          icon: 'bi-archive',
          label: 'Archivia',
          isMock: true,
        },
      ],
      draft: [
        {
          onClick: () => {
            showTempAlert('Pubblica servizio')
          },
          icon: 'bi-box-arrow-up',
          label: 'Pubblica',
          isMock: true,
        },
        {
          onClick: () => {
            showTempAlert('Cancella servizio')
          },
          icon: 'bi-trash',
          label: 'Elimina',
          isMock: true,
        },
      ],
      suspended: [
        {
          onClick: () => {
            showTempAlert('Riattiva servizio')
          },
          icon: 'bi-play-circle',
          label: 'Riattiva',
          isMock: true,
        },
      ],
    }

    const status = service.descriptors[0].status

    // If status === 'draft', show precompiled write template. Else, readonly template
    const inspectAction = {
      to: `${ROUTES.PROVIDE.SUBROUTES!.ESERVICE_LIST.PATH}/${service.id}`,
      icon: status === 'draft' ? 'bi-pencil' : 'bi-info-circle',
      label: status === 'draft' ? 'Modifica' : 'Ispeziona',
    }

    // Get all the actions available for this particular status
    const actions: Action[] = (availableActions as any)[status] || []

    // Add the last action, which is always EDIT/INSPECT
    actions.push(inspectAction)

    return actions
  }

  const headData = ['nome servizio', 'versione attuale', 'stato del servizio', '']

  return (
    <WhiteBackground>
      <StyledIntro>
        {{
          title: 'I tuoi e-service',
          description: "In quest'area puoi gestire tutti gli e-service che stai erogando",
        }}
      </StyledIntro>

      <div className="mt-4">
        <Button variant="primary" as={Link} to={ROUTES.PROVIDE.SUBROUTES!.ESERVICE_CREATE.PATH}>
          {ROUTES.PROVIDE.SUBROUTES!.ESERVICE_CREATE.LABEL}
        </Button>

        <h1 className="py-3" style={{ color: 'red' }}>
          Aggiungere filtri
        </h1>

        <TableWithLoader
          loading={loading}
          loadingLabel="Stiamo caricando i tuoi e-service"
          headData={headData}
          pagination={true}
          data={data}
          noDataLabel="Non ci sono servizi disponibili"
          error={error}
        >
          {data.map((item, i) => (
            <tr key={i}>
              <td>{item.name}</td>
              <td>{item.version}</td>
              <td>{ESERVICE_STATUS[item.status]}</td>
              <td>
                {getAvailableActions(item).map(({ to, onClick, icon, label, isMock }, j) => {
                  const btnProps: any = { onClick }

                  if (to) {
                    btnProps.as = Link
                    btnProps.to = to
                    delete btnProps.onClick // Redundant, here just for clarity
                  }

                  return (
                    <TableAction
                      key={j}
                      btnProps={btnProps}
                      label={label}
                      iconClass={icon}
                      isMock={isMock}
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
