import React, { useContext } from 'react'
import { EServiceFlatReadType } from '../../types'
import { StyledIntro } from '../components/Shared/StyledIntro'
import { ActionWithTooltip } from '../components/ActionWithTooltip'
import { TableWithLoader } from '../components/TableWithLoader'
import { useAsyncFetch } from '../hooks/useAsyncFetch'
import { ESERVICE_STATUS_LABEL, ROUTES } from '../lib/constants'
import { PartyContext } from '../lib/context'
import { TempFilters } from '../components/TempFilters'
import { isAdmin } from '../lib/auth-utils'
import { canSubscribe } from '../lib/attributes'
import { useSubscribeDialog } from '../hooks/useSubscribeDialog'
import { useExtensionDialog } from '../hooks/useExtensionDialog'
import { useFeedback } from '../hooks/useFeedback'
import { buildDynamicPath } from '../lib/url-utils'
import { StyledTooltip } from '../components/Shared/StyledTooltip'
import { StyledOverlayTrigger } from '../components/Shared/StyledOverlayTrigger'
import { StyledLink } from '../components/Shared/StyledLink'

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
      { path: { endpoint: 'AGREEMENT_CREATE' }, config: { data: agreementData } },
      { destination: ROUTES.SUBSCRIBE.SUBROUTES!.AGREEMENT_LIST, suppressToast: false }
    )
  }

  const { openDialog: openSubscribeDialog } = useSubscribeDialog({
    onProceedCallback: subscribe,
    producerName: data.producerName,
  })

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

export function EServiceCatalog() {
  const { runActionWithDestination, runFakeAction } = useFeedback()
  const { party } = useContext(PartyContext)
  const { data, loadingText, error } = useAsyncFetch<
    EServiceFlatReadType[],
    ExtendedEServiceFlatReadType[]
  >(
    {
      path: { endpoint: 'ESERVICE_GET_LIST_FLAT' },
      config: { params: { status: 'published', callerId: party?.partyId } },
    },
    {
      defaultValue: [],
      mapFn: (data) => data.map((d) => ({ ...d, isMine: d.producerId === party?.partyId })),
      loaderType: 'contextual',
      loadingTextLabel: 'Stiamo caricando la lista degli e-service',
    }
  )

  const headData = ['nome e-service', 'ente erogatore', 'versione attuale', 'stato e-service', '']

  const OwnerTooltip = ({ label = '', iconClass = '' }) => (
    <StyledOverlayTrigger
      placement="top"
      overlay={
        <StyledTooltip className="opacity-100" id="tooltip">
          {label}
        </StyledTooltip>
      }
    >
      <i className={`text-primary ms-2 fs-5 bi ${iconClass}`} />
    </StyledOverlayTrigger>
  )

  return (
    <React.Fragment>
      <StyledIntro>
        {{
          title: 'Gli e-service disponibili',
          description:
            "In quest'area puoi vedere tutti gli e-service nel catalogo, e aderire a quelli a cui sei interessato",
        }}
      </StyledIntro>

      <TempFilters />

      <TableWithLoader
        loadingText={loadingText}
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
                  <OwnerTooltip label="Sei già iscritto" iconClass="bi-check-circle" />
                )}
                {!item.isMine && !canSubscribeEservice && (
                  <OwnerTooltip
                    label="Il tuo ente non ha gli attributi certificati necessari per iscriversi"
                    iconClass="bi-x-circle"
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
                      to: buildDynamicPath(ROUTES.SUBSCRIBE.SUBROUTES!.AGREEMENT_EDIT.PATH, {
                        id: item.callerSubscribed,
                      }),
                      component: StyledLink,
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
                    component: StyledLink,
                    to: buildDynamicPath(ROUTES.SUBSCRIBE.SUBROUTES!.CATALOG_VIEW.PATH, {
                      eserviceId: item.id,
                      descriptorId: item.descriptorId!,
                    }),
                  }}
                  label="Ispeziona"
                  iconClass={'bi-info-circle'}
                />
              </td>
            </tr>
          )
        })}
      </TableWithLoader>
    </React.Fragment>
  )
}
