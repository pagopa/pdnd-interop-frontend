import React, { useContext } from 'react'
import { EServiceFlatReadType } from '../../types'
import { StyledIntro } from '../components/Shared/StyledIntro'
import { TableWithLoader } from '../components/Shared/TableWithLoader'
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
import { StyledLink } from '../components/Shared/StyledLink'
import { StyledButton } from '../components/Shared/StyledButton'
import { TableCell, TableRow } from '@mui/material'

function CatalogExtensionAction({ runFakeAction }: { runFakeAction: any }) {
  const askExtension = (_: any) => {
    runFakeAction('Richiedi estensione')
  }

  const { openDialog: openExtensionDialog } = useExtensionDialog({
    onProceedCallback: askExtension,
  })

  return (
    <StyledButton onClick={openExtensionDialog} isMock={true}>
      Richiedi estensione
    </StyledButton>
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

  return <StyledButton onClick={openSubscribeDialog}>Iscriviti</StyledButton>
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
    <StyledTooltip title={label}>
      <i className={`text-primary ms-2 fs-5 bi ${iconClass}`} />
    </StyledTooltip>
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
            <TableRow key={i} sx={{ bgcolor: 'common.white' }}>
              <TableCell>
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
              </TableCell>
              <TableCell>{item.producerName}</TableCell>
              <TableCell>{item.version}</TableCell>
              <TableCell>{ESERVICE_STATUS_LABEL[item.status!]}</TableCell>
              <TableCell>
                {!item.isMine && isAdmin(party) && item.callerSubscribed && (
                  <StyledButton
                    to={buildDynamicPath(ROUTES.SUBSCRIBE.SUBROUTES!.AGREEMENT_EDIT.PATH, {
                      id: item.callerSubscribed,
                    })}
                    component={StyledLink}
                  >
                    Vai all'accordo
                  </StyledButton>
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
                <StyledButton
                  component={StyledLink}
                  to={buildDynamicPath(ROUTES.SUBSCRIBE.SUBROUTES!.CATALOG_VIEW.PATH, {
                    eserviceId: item.id,
                    descriptorId: item.descriptorId!,
                  })}
                >
                  Ispeziona
                </StyledButton>
              </TableCell>
            </TableRow>
          )
        })}
      </TableWithLoader>
    </React.Fragment>
  )
}
