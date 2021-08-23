import React, { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { WhiteBackground } from '../components/WhiteBackground'
import { ESERVICE_STATUS, ROUTES } from '../lib/constants'
import { Button } from 'react-bootstrap'
import { PartyContext } from '../lib/context'
import { fetchWithLogs } from '../lib/api-utils'
import { EServiceSummary } from '../../types'
import { TableWithLoader } from '../components/TableWithLoader'

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

  const computeAvailableActions = (service: any) => {
    return <Link to={ROUTES.PROVIDE.SUBROUTES!.ESERVICE_LIST.PATH + '/' + service}>link</Link>
  }

  return (
    <WhiteBackground>
      <h2>I tuoi e-service</h2>
      <p>In quest'area puoi gestire tutti gli e-service che stai erogando</p>

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
        >
          {eservice.map((item, i) => (
            <tr key={i}>
              <td>{item.name}</td>
              <td>{item.version}</td>
              <td>{ESERVICE_STATUS[item.status]}</td>
              <td>{computeAvailableActions(item)}</td>
            </tr>
          ))}
        </TableWithLoader>
      </div>
    </WhiteBackground>
  )
}
