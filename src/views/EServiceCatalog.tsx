import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { EServiceFlatReadType } from '../../types'
import { StyledIntro } from '../components/StyledIntro'
import { ActionWithTooltip } from '../components/ActionWithTooltip'
import { TableWithLoader } from '../components/TableWithLoader'
import { WhiteBackground } from '../components/WhiteBackground'
import { UserFeedbackHOCProps, withUserFeedback } from '../components/withUserFeedback'
import { useAsyncFetch } from '../hooks/useAsyncFetch'
import { ESERVICE_STATUS_LABEL, ROUTES } from '../lib/constants'
import { PartyContext } from '../lib/context'
import { OverlayTrigger, Tooltip } from 'react-bootstrap'
import { TempFilters } from '../components/TempFilters'
import { isAdmin } from '../lib/auth-utils'
import { canSubscribe } from '../lib/attributes'
import { useSubscribeDialog } from '../hooks/useSubscribeDialog'
import { useExtensionDialog } from '../hooks/useExtensionDialog'

function CatalogExtensionAction({ runFakeAction }: { runFakeAction: any }) {
  const askExtension = (_: any) => {
    runFakeAction('Richiedi estensione')
  }

  const { openDialog: openExtensionDialog } = useExtensionDialog({
    onProceedCallback: askExtension,
  })

  return (
    <ActionWithTooltip
      btnProps={{ onClick: openExtensionDialog }}
      label="Richiedi estensione"
      iconClass={'bi-chat-square-text'}
      isMock={true}
    />
  )
}

function CatalogSubscribeAction({
  data,
  runActionWithDestination,
}: {
  data: EServiceFlatReadType
  runActionWithDestination: any
}) {
  const { party } = useContext(PartyContext)

  const subscribe = async (_: any) => {
    const agreementData = {
      eserviceId: data.id,
      descriptorId: data.descriptorId,
      consumerId: party?.partyId,
    }

    await runActionWithDestination(
      { path: { endpoint: 'AGREEMENT_CREATE' }, config: { method: 'POST', data: agreementData } },
      { destination: ROUTES.SUBSCRIBE.SUBROUTES!.AGREEMENT_LIST, suppressToast: false }
    )
  }

  const { openDialog: openSubscribeDialog } = useSubscribeDialog({ onProceedCallback: subscribe })

  return (
    <ActionWithTooltip
      btnProps={{ onClick: openSubscribeDialog }}
      label="Iscriviti"
      iconClass={'bi-pencil-square'}
    />
  )
}

type ExtendedEServiceFlatReadType = EServiceFlatReadType & {
  isMine: boolean
}

export function EServiceCatalogComponent({
  runActionWithDestination,
  runFakeAction,
  wrapActionInDialog,
}: UserFeedbackHOCProps) {
  const { party } = useContext(PartyContext)
  const { data, loading, error } = useAsyncFetch<
    EServiceFlatReadType[],
    ExtendedEServiceFlatReadType[]
  >(
    {
      path: { endpoint: 'ESERVICE_GET_LIST_FLAT' },
      config: { method: 'GET', params: { status: 'published', callerId: party?.partyId } },
    },
    {
      defaultValue: [],
      mapFn: (data) => data.map((d) => ({ ...d, isMine: d.producerId === party?.partyId })),
    }
  )

  const headData = ['nome e-service', 'ente erogatore', 'versione attuale', 'stato e-service', '']

  const OwnerTooltip = ({ label = '', iconClass = '' }) => (
    <OverlayTrigger
      placement="top"
      overlay={
        <Tooltip className="opacity-100" id="tooltip">
          {label}
        </Tooltip>
      }
    >
      <i className={`text-primary ms-2 fs-5 bi ${iconClass}`} />
    </OverlayTrigger>
  )

  return (
    <WhiteBackground>
      <StyledIntro priority={2}>
        {{
          title: 'Gli e-service disponibili',
          description:
            "In quest'area puoi vedere tutti gli e-service nel catalogo, e aderire a quelli a cui sei interessato",
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
        {data.map((item, i) => {
          const canSubscribeEservice = canSubscribe(party?.attributes, item.certifiedAttributes)

          return (
            <tr key={i}>
              <td>
                {item.name}
                {item.isMine && <OwnerTooltip label="Sei l'erogatore" iconClass="bi-key-fill" />}
                {item.callerSubscribed && isAdmin(party) && (
                  <OwnerTooltip label="Sei già iscritto" iconClass="bi-check-circle-fill" />
                )}
                {!item.isMine && !canSubscribeEservice && (
                  <OwnerTooltip
                    label="Il tuo ente non ha gli attributi certificati necessari per iscriversi"
                    iconClass="bi-x-circle-fill"
                  />
                )}
              </td>
              <td>{item.producerName}</td>
              <td>{item.version}</td>
              <td>{ESERVICE_STATUS_LABEL[item.status!]}</td>
              <td>
                {!item.isMine && isAdmin(party) && item.callerSubscribed && (
                  <ActionWithTooltip
                    btnProps={{
                      to: `${ROUTES.SUBSCRIBE.SUBROUTES!.AGREEMENT_LIST.PATH}/${
                        item.callerSubscribed
                      }`,
                      as: Link,
                    }}
                    label="Vai all'accordo"
                    iconClass={'bi-link'}
                  />
                )}
                {!item.isMine &&
                  isAdmin(party) &&
                  !item.callerSubscribed &&
                  canSubscribeEservice && (
                    <CatalogSubscribeAction
                      data={item}
                      runActionWithDestination={runActionWithDestination}
                    />
                  )}
                {!item.isMine && isAdmin(party) && !canSubscribeEservice && (
                  <CatalogExtensionAction runFakeAction={runFakeAction} />
                )}
                <ActionWithTooltip
                  btnProps={{
                    as: Link,
                    to: `${ROUTES.SUBSCRIBE.SUBROUTES!.CATALOG_LIST.PATH}/${item.id}/${
                      item.descriptorId
                    }`,
                  }}
                  label="Ispeziona"
                  iconClass={'bi-info-circle'}
                />
              </td>
            </tr>
          )
        })}
      </TableWithLoader>
    </WhiteBackground>
  )
}

export const EServiceCatalog = withUserFeedback(EServiceCatalogComponent)
