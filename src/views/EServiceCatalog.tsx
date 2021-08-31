import React from 'react'
import { Link } from 'react-router-dom'
import { EServiceSummary } from '../../types'
import { StyledIntro } from '../components/StyledIntro'
import { TableAction } from '../components/TableAction'
import { TableWithLoader } from '../components/TableWithLoader'
import { WhiteBackground } from '../components/WhiteBackground'
import { useAsyncFetch } from '../hooks/useAsyncFetch'
import { ESERVICE_STATUS } from '../lib/constants'

export function EServiceCatalog() {
  const { data, loading, error } = useAsyncFetch<EServiceSummary[]>(
    {
      path: { endpoint: 'ESERVICE_GET_LIST' },
      config: {
        method: 'GET',
      },
    },
    []
  )

  const headData = ['nome servizio', 'versione attuale', 'stato del servizio', '']

  return (
    <WhiteBackground>
      <StyledIntro>
        {{
          title: 'Gli e-service disponibili',
          description:
            "In quest'area puoi vedere tutti gli e-service nel catalogo, e iscriverti a quelli a cui sei interessato",
        }}
      </StyledIntro>

      <h1 className="py-3" style={{ color: 'red' }}>
        Aggiungere filtri
      </h1>

      <TableWithLoader
        loading={loading}
        loadingLabel="Stiamo caricando la lista degli e-service"
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
              <TableAction
                btnProps={{ as: Link, to: '' }}
                label="iscriviti"
                iconClass={'bi-pencil-square'}
              />
            </td>
          </tr>
        ))}
      </TableWithLoader>
    </WhiteBackground>
  )
}
