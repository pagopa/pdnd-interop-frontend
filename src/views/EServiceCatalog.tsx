import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { EServiceReadType } from '../../types'
import { StyledIntro } from '../components/StyledIntro'
import { TableAction } from '../components/TableAction'
import { TableWithLoader } from '../components/TableWithLoader'
import { WhiteBackground } from '../components/WhiteBackground'
import { UserFeedbackHOCProps, withUserFeedback } from '../components/withUserFeedback'
import { useAsyncFetch } from '../hooks/useAsyncFetch'
import { ESERVICE_STATUS_LABEL, ROUTES } from '../lib/constants'
import { PartyContext } from '../lib/context'

export function EServiceCatalogComponent({ runAction, wrapActionInDialog }: UserFeedbackHOCProps) {
  const { party } = useContext(PartyContext)
  const { data, loading, error } = useAsyncFetch<EServiceReadType[]>(
    {
      path: { endpoint: 'ESERVICE_GET_LIST' },
      config: { method: 'GET', params: { status: 'published' } },
    },
    { defaultValue: [] }
  )

  /*
   * List of possible actions for the user to perform
   */
  const wrapSubscribe = (service: EServiceReadType) => async (_: any) => {
    const agreementData = {
      eserviceId: service.id,
      producerId: service.producerId,
      consumerId: party?.partyId,
      verifiedAttributes: [], // TEMP PIN-362
    }

    await runAction({
      path: { endpoint: 'AGREEMENT_CREATE' },
      config: { method: 'POST', data: agreementData },
    })
  }
  /*
   * End list of actions
   */

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
            <td>{item.descriptors[0].version}</td>
            <td>{ESERVICE_STATUS_LABEL[item.descriptors[0].status]}</td>
            <td>
              <TableAction
                btnProps={{ onClick: wrapActionInDialog(wrapSubscribe(item), 'AGREEMENT_CREATE') }}
                label="Iscriviti"
                iconClass={'bi-pencil-square'}
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

export const EServiceCatalog = withUserFeedback(EServiceCatalogComponent)
