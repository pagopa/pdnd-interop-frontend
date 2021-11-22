import React, { useContext } from 'react'
import { useHistory } from 'react-router-dom'
import { EServiceFlatReadType, ActionProps, EServiceStatus } from '../../types'
import { StyledIntro } from '../components/Shared/StyledIntro'
import { TableWithLoader } from '../components/Shared/TableWithLoader'
import { useAsyncFetch } from '../hooks/useAsyncFetch'
import { PartyContext } from '../lib/context'
import { TempFilters } from '../components/TempFilters'
import { isAdmin } from '../lib/auth-utils'
import { canSubscribe } from '../lib/attributes'
import { useSubscribeDialog } from '../hooks/useSubscribeDialog'
import { useExtensionDialog } from '../hooks/useExtensionDialog'
import { buildDynamicPath } from '../lib/router-utils'
import { StyledTooltip } from '../components/Shared/StyledTooltip'
import {
  Clear as ClearIcon,
  Check as CheckIcon,
  Person as PersonIcon,
  SvgIconComponent,
} from '@mui/icons-material'
import { StyledTableRow } from '../components/Shared/StyledTableRow'
import { ROUTES } from '../config/routes'
import { ESERVICE_STATUS_LABEL } from '../config/labels'

type ExtendedEServiceFlatReadType = EServiceFlatReadType & {
  isMine: boolean
}

export function EServiceCatalog() {
  const history = useHistory()
  const { party } = useContext(PartyContext)
  const { data, loadingText, error } = useAsyncFetch<
    Array<EServiceFlatReadType>,
    Array<ExtendedEServiceFlatReadType>
  >(
    {
      path: { endpoint: 'ESERVICE_GET_LIST_FLAT' },
      config: { params: { status: 'published', callerId: party?.partyId } },
    },
    {
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

  const OwnerTooltip = ({ label = '', Icon }: { label: string; Icon: SvgIconComponent }) => (
    <StyledTooltip title={label}>
      <Icon sx={{ ml: 0.5, fontSize: 16 }} color="secondary" />
    </StyledTooltip>
  )

  const getAvailableActions = (
    eservice: ExtendedEServiceFlatReadType,
    canSubscribeEservice: boolean
  ) => {
    const actions: Array<ActionProps> = []

    if (!eservice.isMine && isAdmin(party) && eservice.callerSubscribed) {
      actions.push({
        onClick: () => {
          history.push(
            buildDynamicPath(ROUTES.SUBSCRIBE_AGREEMENT_EDIT.PATH, {
              id: eservice.callerSubscribed as string,
            })
          )
        },
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
      return <OwnerTooltip label="Sei l'erogatore" Icon={PersonIcon} />
    }

    if (item.callerSubscribed && isAdmin(party)) {
      return <OwnerTooltip label="Sei già iscritto" Icon={CheckIcon} />
    }

    if (!item.isMine && !canSubscribeEservice) {
      return (
        <OwnerTooltip
          label="Il tuo ente non ha gli attributi certificati necessari per iscriversi"
          Icon={ClearIcon}
        />
      )
    }

    return undefined
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
        {data?.map((item, i) => {
          const canSubscribeEservice = canSubscribe(party?.attributes, item.certifiedAttributes)
          const tooltip = getTooltip(item, canSubscribeEservice)
          return (
            <StyledTableRow
              key={i}
              cellData={[
                { label: item.name, tooltip },
                { label: item.producerName },
                { label: item.version as string },
                { label: ESERVICE_STATUS_LABEL[item.status as EServiceStatus] },
              ]}
              index={i}
              singleActionBtn={{
                to: buildDynamicPath(ROUTES.SUBSCRIBE_CATALOG_VIEW.PATH, {
                  eserviceId: item.id,
                  descriptorId: item.descriptorId as string,
                }),
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
