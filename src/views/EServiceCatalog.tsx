import React, { useContext } from 'react'
import has from 'lodash/has'
import { Link } from 'react-router-dom'
import {
  BackendAttribute,
  EServiceReadType,
  GroupBackendAttribute,
  SingleBackendAttribute,
} from '../../types'
import { StyledIntro } from '../components/StyledIntro'
import { TableAction } from '../components/TableAction'
import { TableWithLoader } from '../components/TableWithLoader'
import { WhiteBackground } from '../components/WhiteBackground'
import { UserFeedbackHOCProps, withUserFeedback } from '../components/withUserFeedback'
import { useAsyncFetch } from '../hooks/useAsyncFetch'
import { ESERVICE_STATUS_LABEL, ROUTES } from '../lib/constants'
import { PartyContext, UserContext } from '../lib/context'
import { OverlayTrigger, Tooltip } from 'react-bootstrap'
import { TempFilters } from '../components/TempFilters'
import { isAdmin } from '../lib/auth-utils'

type ExtendedEServiceReadType = EServiceReadType & { isMine: boolean; amISubscribed: boolean }

export function EServiceCatalogComponent({ runAction, wrapActionInDialog }: UserFeedbackHOCProps) {
  const { party } = useContext(PartyContext)
  const { user } = useContext(UserContext)
  const { data, loading, error } = useAsyncFetch<EServiceReadType[], ExtendedEServiceReadType[]>(
    {
      path: { endpoint: 'ESERVICE_GET_LIST' },
      config: { method: 'GET', params: { status: 'published' } },
    },
    {
      defaultValue: [],
      mapFn: (data) =>
        data.map((d) => ({ ...d, isMine: d.producerId === party?.partyId, amISubscribed: false })),
    }
  )

  /*
   * List of possible actions for the user to perform
   */
  const wrapSubscribe = (service: EServiceReadType) => async (_: any) => {
    const flattenedVerifiedAttributes = service.attributes.verified.reduce(
      (acc: any, next: BackendAttribute) => {
        const nextIds = has(next, 'single')
          ? [(next as SingleBackendAttribute).single.id]
          : (next as GroupBackendAttribute).group.map((a) => a.id)
        return [...acc, ...nextIds]
      },
      []
    )

    const agreementData = {
      eserviceId: service.id,
      producerId: service.producerId,
      consumerId: party?.partyId,
      verifiedAttributes: flattenedVerifiedAttributes.map((id: string) => ({
        id,
        verified: false,
        validityTimespan: 100000000,
      })), // TEMP PIN-362
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

  const InfoTooltip = ({ label = '', iconClass = '' }) => (
    <OverlayTrigger placement="top" overlay={<Tooltip id="tooltip">{label}</Tooltip>}>
      <i className={`text-primary ms-2 fs-5 bi ${iconClass}`} />
    </OverlayTrigger>
  )

  return (
    <WhiteBackground>
      <StyledIntro>
        {{
          title: 'Gli e-service disponibili',
          description:
            "In quest'area puoi vedere tutti gli e-service nel catalogo, e iscriverti a quelli a cui sei interessato",
        }}
      </StyledIntro>

      <TempFilters />

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
            <td>
              {item.name}
              {item.isMine && <InfoTooltip label="Sei l'erogatore" iconClass="bi-key-fill" />}
            </td>
            <td>{item.descriptors[0].version}</td>
            <td>{ESERVICE_STATUS_LABEL[item.descriptors[0].status]}</td>
            <td>
              {!item.isMine && isAdmin(user) && (
                <TableAction
                  btnProps={{
                    onClick: wrapActionInDialog(wrapSubscribe(item), 'AGREEMENT_CREATE'),
                  }}
                  label="Iscriviti"
                  iconClass={'bi-pencil-square'}
                />
              )}
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
