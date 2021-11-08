import React, { useContext } from 'react'
import { EServiceFlatReadType, ActionProps } from '../../types'
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
import { buildDynamicPath } from '../lib/url-utils'
import { StyledTooltip } from '../components/Shared/StyledTooltip'
import { StyledLink } from '../components/Shared/StyledLink'
import {
  Lock as LockIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material'
import { StyledTableRow } from '../components/Shared/StyledTableRow'

type ExtendedEServiceFlatReadType = EServiceFlatReadType & {
  isMine: boolean
}

export function EServiceCatalog() {
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

  /*
   * Ask extension action
   */
  const { openDialog: openExtensionDialog } = useExtensionDialog()

  /*
   * Subscribe to e-service action
   */
  const { openDialog: openSubscribeDialog } = useSubscribeDialog()

  const headData = ['nome e-service', 'ente erogatore', 'versione attuale', 'stato e-service', '']

  const OwnerTooltip = ({ label = '', Icon }: { label: string; Icon: any }) => (
    <StyledTooltip title={label}>
      <Icon sx={{ ml: 1 }} fontSize="small" color="primary" />
    </StyledTooltip>
  )

  const getAvailableActions = (
    eservice: ExtendedEServiceFlatReadType,
    canSubscribeEservice: boolean
  ) => {
    const actions: ActionProps[] = []

    if (!eservice.isMine && isAdmin(party) && eservice.callerSubscribed) {
      actions.push({
        to: buildDynamicPath(ROUTES.SUBSCRIBE.SUBROUTES!.AGREEMENT_EDIT.PATH, {
          id: eservice.callerSubscribed,
        }),
        component: StyledLink,
        label: "Vai all'accordo",
      })
    }

    if (!eservice.isMine && isAdmin(party) && !eservice.callerSubscribed && canSubscribeEservice) {
      actions.push({
        onClick: () => {
          openSubscribeDialog(eservice)
        },
        label: 'Iscriviti',
      })
    }

    if (!eservice.isMine && isAdmin(party) && !canSubscribeEservice) {
      actions.push({
        onClick: openExtensionDialog,
        label: 'Richiedi estensione',
        isMock: true,
      })
    }

    return actions
  }

  const getTooltip = (item: ExtendedEServiceFlatReadType, canSubscribeEservice: boolean) => {
    if (item.isMine) {
      return <OwnerTooltip label="Sei l'erogatore" Icon={LockIcon} />
    }

    if (item.callerSubscribed && isAdmin(party)) {
      return <OwnerTooltip label="Sei già iscritto" Icon={CheckCircleIcon} />
    }

    if (!item.isMine && !canSubscribeEservice) {
      return (
        <OwnerTooltip
          label="Il tuo ente non ha gli attributi certificati necessari per iscriversi"
          Icon={CancelIcon}
        />
      )
    }

    return null
  }

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
          const tooltip = getTooltip(item, canSubscribeEservice)
          return (
            <StyledTableRow
              key={i}
              cellData={[
                { label: item.name, tooltip },
                { label: item.producerName },
                { label: item.version! },
                { label: ESERVICE_STATUS_LABEL[item.status!] },
              ]}
              index={i}
              singleActionBtn={{
                props: {
                  to: buildDynamicPath(ROUTES.SUBSCRIBE.SUBROUTES!.CATALOG_VIEW.PATH, {
                    eserviceId: item.id,
                    descriptorId: item.descriptorId!,
                  }),
                  component: StyledLink,
                },
                label: 'Ispeziona',
              }}
              actions={getAvailableActions(item, canSubscribeEservice)}
            />
          )
        })}
      </TableWithLoader>
    </React.Fragment>
  )
}
