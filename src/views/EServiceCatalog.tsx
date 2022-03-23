import React, { useContext } from 'react'
import { useHistory } from 'react-router-dom'
import {
  EServiceFlatReadType,
  ActionProps,
  EServiceState,
  EServiceFlatDecoratedReadType,
} from '../../types'
import { StyledIntro } from '../components/Shared/StyledIntro'
import { TableWithLoader } from '../components/Shared/TableWithLoader'
import { useAsyncFetch } from '../hooks/useAsyncFetch'
import { DialogContext, PartyContext } from '../lib/context'
import { TempFilters } from '../components/TempFilters'
import { isAdmin } from '../lib/auth-utils'
import { canSubscribe } from '../lib/attributes'
import { buildDynamicPath } from '../lib/router-utils'
import { StyledTooltip } from '../components/Shared/StyledTooltip'
import {
  Clear as ClearIcon,
  Check as CheckIcon,
  Person as PersonIcon,
  SvgIconComponent,
} from '@mui/icons-material'
import { ESERVICE_STATE_LABEL } from '../config/labels'
import { useFeedback } from '../hooks/useFeedback'
import { StyledTableRow } from '../components/Shared/StyledTableRow'
import { ActionMenu } from '../components/Shared/ActionMenu'
import { StyledButton } from '../components/Shared/StyledButton'
import { axiosErrorToError } from '../lib/error-utils'
import { useRoute } from '../hooks/useRoute'

export function EServiceCatalog() {
  const history = useHistory()
  const { runActionWithDestination } = useFeedback()
  const { party } = useContext(PartyContext)
  const { setDialog } = useContext(DialogContext)
  const { routes } = useRoute()

  const { data, loadingText, error } = useAsyncFetch<
    Array<EServiceFlatReadType>,
    Array<EServiceFlatDecoratedReadType>
  >(
    {
      path: { endpoint: 'ESERVICE_GET_LIST_FLAT' },
      config: { params: { state: 'PUBLISHED', callerId: party?.id } },
    },
    {
      mapFn: (data) => data.map((d) => ({ ...d, isMine: d.producerId === party?.id })),
      loaderType: 'contextual',
      loadingTextLabel: 'Stiamo caricando la lista degli E-Service',
    }
  )

  const headData = ['Nome E-Service', 'Ente erogatore', 'Versione attuale', 'Stato E-Service']

  const OwnerTooltip = ({ label = '', Icon }: { label: string; Icon: SvgIconComponent }) => (
    <StyledTooltip title={label}>
      <Icon sx={{ ml: 0.75, fontSize: 16 }} color="primary" />
    </StyledTooltip>
  )

  const wrapSubscribe = (eservice: EServiceFlatDecoratedReadType) => async () => {
    const agreementData = {
      eserviceId: eservice.id,
      descriptorId: eservice.descriptorId,
      consumerId: party?.id,
    }

    await runActionWithDestination(
      { path: { endpoint: 'AGREEMENT_CREATE' }, config: { data: agreementData } },
      { destination: routes.SUBSCRIBE_AGREEMENT_LIST, suppressToast: false }
    )
  }

  const getAvailableActions = (
    eservice: EServiceFlatDecoratedReadType,
    canSubscribeEservice: boolean
  ) => {
    const actions: Array<ActionProps> = []

    if (!eservice.isMine && isAdmin(party) && eservice.callerSubscribed) {
      actions.push({
        onClick: () => {
          history.push(
            buildDynamicPath(routes.SUBSCRIBE_AGREEMENT_EDIT.PATH, {
              agreementId: eservice.callerSubscribed as string,
            })
          )
        },
        label: 'Vai alla richiesta',
      })
    }

    if (!eservice.isMine && isAdmin(party) && !eservice.callerSubscribed && canSubscribeEservice) {
      actions.push({
        onClick: () => {
          setDialog({
            type: 'basic',
            proceedCallback: wrapSubscribe(eservice),
            proceedLabel: 'Iscriviti',
            title: 'Richiesta di fruizione',
            description: `Stai per inoltrare una richiesta di fruizione per l'E-Service ${eservice.name}, versione ${eservice.version}`,
            close: () => {
              setDialog(null)
            },
          })
        },
        label: 'Iscriviti',
      })
    }

    // TEMP PIN-612
    // if (!eservice.isMine && isAdmin(party) && !canSubscribeEservice) {
    //   actions.push({
    //     onClick: () => {
    //       setDialog({ type: 'askExtension' })
    //     },
    //     label: 'Richiedi estensione',
    //   })
    // }

    return actions
  }

  const getTooltip = (item: EServiceFlatDecoratedReadType, canSubscribeEservice: boolean) => {
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
          title: 'Catalogo degli E-Service',
          description:
            "In quest'area puoi vedere tutti gli E-Service nel catalogo, e aderire a quelli a cui sei interessato",
        }}
      </StyledIntro>

      <TempFilters />

      <TableWithLoader
        loadingText={loadingText}
        headData={headData}
        noDataLabel="Non ci sono servizi disponibili"
        error={axiosErrorToError(error)}
      >
        {party &&
          data &&
          Boolean(data.length > 0) &&
          data.map((item, i) => {
            const canSubscribeEservice = canSubscribe(party.attributes, item.certifiedAttributes)
            const tooltip = getTooltip(item, canSubscribeEservice)
            return (
              <StyledTableRow
                key={i}
                cellData={[
                  { label: item.name, tooltip },
                  { label: item.producerName },
                  { label: item.version as string },
                  { label: ESERVICE_STATE_LABEL[item.state as EServiceState] },
                ]}
              >
                <StyledButton
                  variant="text"
                  size="small"
                  onClick={() => {
                    history.push(
                      buildDynamicPath(routes.SUBSCRIBE_CATALOG_VIEW.PATH, {
                        eserviceId: item.id,
                        descriptorId: item.descriptorId as string,
                      })
                    )
                  }}
                >
                  Ispeziona
                </StyledButton>

                <ActionMenu actions={getAvailableActions(item, canSubscribeEservice)} />
              </StyledTableRow>
            )
          })}
      </TableWithLoader>
    </React.Fragment>
  )
}
