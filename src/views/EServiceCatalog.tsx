import React from 'react'
import { Link } from 'react-router-dom'
import { EServiceSummary } from '../../types'
import { StyledIntro } from '../components/StyledIntro'
import { TableAction } from '../components/TableAction'
import { TableWithLoader } from '../components/TableWithLoader'
import { WhiteBackground } from '../components/WhiteBackground'
import { useAsyncFetch } from '../hooks/useAsyncFetch'
import { ESERVICE_STATUS, ROUTES } from '../lib/constants'
import { showTempAlert } from '../lib/wip-utils'

export function EServiceCatalog() {
  const { data, loading, error } = useAsyncFetch<EServiceSummary[]>(
    {
      path: { endpoint: 'ESERVICE_GET_LIST' },
      config: { method: 'GET' },
    },
    []
  )

  const subscribe = () => {
    showTempAlert("Iscriviti all'e-service")
  }

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
        {data
          .filter((item) => item.descriptors[0].status === 'published')
          .map((item, i) => (
            <tr key={i}>
              <td>{item.name}</td>
              <td>{item.descriptors[0].version}</td>
              <td>{ESERVICE_STATUS[item.descriptors[0].status]}</td>
              <td>
                <TableAction
                  btnProps={{ onClick: subscribe }}
                  label="Iscriviti"
                  iconClass={'bi-pencil-square'}
                  isMock={true}
                />
                <TableAction
                  btnProps={{
                    as: Link,
                    to: `${ROUTES.SUBSCRIBE.SUBROUTES!.CATALOG_VIEW.PATH}/${item.id}`,
                  }}
                  label="Ispeziona"
                  iconClass={'bi-info-circle'}
                />
              </td>
            </tr>
          ))}
      </TableWithLoader>
    </WhiteBackground>
  )
}
