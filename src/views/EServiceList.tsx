import React, { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { WhiteBackground } from '../components/WhiteBackground'
import { ESERVICE_STATUS, ROUTES } from '../lib/constants'
import { Button } from 'react-bootstrap'
import { PartyContext } from '../lib/context'
import { fetchWithLogs } from '../lib/api-utils'
import { EServiceSummary } from '../../types'
import { TableWithLoader } from '../components/TableWithLoader'
import { TableAction } from '../components/TableAction'
import { StyledIntro } from '../components/StyledIntro'

type Action = {
  to?: string
  onClick?: any
  icon: string
  label: string
}

export function EServiceList() {
  const { party } = useContext(PartyContext)
  const [isLoading, setIsLoading] = useState(false)
  const [eservice, setEservice] = useState<EServiceSummary[]>([])

  useEffect(() => {
    async function asyncFetchWithLogs() {
      setIsLoading(true)
      const id = party?.institutionId

      const list = await fetchWithLogs(
        { endpoint: 'ESERVICE_GET_LIST' },
        {
          method: 'GET',
          params: { id },
        }
      )

      setIsLoading(false)
      setEservice(list!.data)
    }

    asyncFetchWithLogs()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const getAvailableActions = (service: any) => {
    const availableActions = {
      Active: [
        {
          onClick: () => {
            console.log('sospendi')
          },
          icon: 'bi-pause-circle',
          label: 'Sospendi',
        },
      ],
      Archived: [],
      Deprecated: [
        {
          onClick: () => {
            console.log('sospendi')
          },
          icon: 'bi-pause-circle',
          label: 'Sospendi',
        },
        {
          onClick: () => {
            // Can only archive if all agreements on that version are archived
            // Check with backend if this can be automated
            console.log('archivia')
          },
          icon: 'bi-archive',
          label: 'Archivia',
        },
      ],
      Draft: [
        {
          onClick: () => {
            console.log('pubblica')
          },
          icon: 'bi-box-arrow-up',
          label: 'Pubblica',
        },
        {
          onClick: () => {
            console.log('cancella')
          },
          icon: 'bi-trash',
          label: 'Elimina',
        },
      ],
      Suspended: [
        {
          onClick: () => {
            console.log('riattiva')
          },
          icon: 'bi-play-circle',
          label: 'Riattiva',
        },
      ],
    }

    const inspectAction = {
      to: `${ROUTES.PROVIDE.SUBROUTES!.ESERVICE_LIST.PATH}/${service.id}`,
      icon: service.status === 'Draft' ? 'bi-pencil' : 'bi-info-circle',
      label: service.status === 'Draft' ? 'Modifica' : 'Ispeziona',
    }

    // Get all the actions available for this particular status
    const actions: Action[] = (availableActions as any)[service.status] || []

    // Add the last action, which is always EDIT/INSPECT
    actions.push(inspectAction)

    return actions
  }

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
          isLoading={isLoading}
          loadingLabel="Stiamo caricando i tuoi e-service"
          headData={['nome servizio', 'versione attuale', 'stato del servizio', '']}
          pagination={true}
        >
          {eservice.map((item, i) => (
            <tr key={i}>
              <td style={{ verticalAlign: 'middle' }}>{item.name}</td>
              <td style={{ verticalAlign: 'middle' }}>{item.version}</td>
              <td style={{ verticalAlign: 'middle' }}>{ESERVICE_STATUS[item.status]}</td>

              <td className="d-flex justify-content-end">
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
