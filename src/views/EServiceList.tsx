import React, { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { WhiteBackground } from '../components/WhiteBackground'
import { ESERVICE_STATUS, ROUTES } from '../lib/constants'
import { Button } from 'react-bootstrap'
import { PartyContext } from '../lib/context'
import { fetchWithLogs } from '../lib/api-utils'
import { EServiceStatus, EServiceSummary } from '../../types'
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

      const list = await fetchWithLogs(
        { endpoint: 'ESERVICE_GET_LIST' },
        {
          method: 'GET',
          params: { producerId: party?.partyId },
        }
      )

      setIsLoading(false)
      setEservice(list!.data)
    }

    asyncFetchWithLogs()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const getAvailableActions = (service: any) => {
    const availableActions: { [key in EServiceStatus]: any } = {
      active: [
        {
          onClick: () => {
            alert('Sospendi servizio: questa funzionalità sarà disponibile a breve')
          },
          icon: 'bi-pause-circle',
          label: 'Sospendi',
        },
      ],
      archived: [],
      deprecated: [
        {
          onClick: () => {
            alert('Sospendi servizio: questa funzionalità sarà disponibile a breve')
          },
          icon: 'bi-pause-circle',
          label: 'Sospendi',
        },
        {
          onClick: () => {
            // Can only archive if all agreements on that version are archived
            // Check with backend if this can be automated
            alert('Archivia servizio: questa funzionalità sarà disponibile a breve')
          },
          icon: 'bi-archive',
          label: 'Archivia',
        },
      ],
      draft: [
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
      suspended: [
        {
          onClick: () => {
            alert('Riattiva servizio: questa funzionalità sarà disponibile a breve')
          },
          icon: 'bi-play-circle',
          label: 'Riattiva',
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
          isLoading={isLoading}
          loadingLabel="Stiamo caricando i tuoi e-service"
          headData={headData}
          pagination={true}
        >
          {eservice.length === 0 ? (
            <tr>
              <td colSpan={headData.length}>Non ci sono servizi disponibili</td>
            </tr>
          ) : (
            eservice.map((item, i) => (
              <tr key={i}>
                <td>{item.name}</td>
                <td>{item.version}</td>
                <td>{ESERVICE_STATUS[item.status]}</td>
                <td>
                  {getAvailableActions(item).map(({ to, onClick, icon, label }, j) => {
                    const btnProps: any = { onClick }

                    if (to) {
                      btnProps.as = Link
                      btnProps.to = to
                      delete btnProps.onClick // Redundant, here just for clarity
                    }

                    return (
                      <TableAction key={j} btnProps={btnProps} label={label} iconClass={icon} />
                    )
                  })}
                </td>
              </tr>
            ))
          )}
        </TableWithLoader>
      </div>
    </WhiteBackground>
  )
}
