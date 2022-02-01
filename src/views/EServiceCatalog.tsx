import React, { useContext } from 'react'
import { useHistory } from 'react-router-dom'
import { object, boolean } from 'yup'
import {
  EServiceFlatReadType,
  ActionProps,
  EServiceState,
  EServiceFlatDecoratedReadType,
  EserviceSubscribeFormInputValues,
  DialogSubscribeProps,
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
import { StyledTableRow } from '../components/Shared/StyledTableRow'
import { ROUTES } from '../config/routes'
import { ESERVICE_STATE_LABEL } from '../config/labels'
import { isTrue } from '../lib/validation-config'
import { useFeedback } from '../hooks/useFeedback'

export function EServiceCatalog() {
  const history = useHistory()
  const { runActionWithDestination } = useFeedback()
  const { party } = useContext(PartyContext)
  const { setDialog } = useContext(DialogContext)

  const { data, loadingText, error } = useAsyncFetch<
    Array<EServiceFlatReadType>,
    Array<EServiceFlatDecoratedReadType>
  >(
    {
      path: { endpoint: 'ESERVICE_GET_LIST_FLAT' },
      config: { params: { callerId: party?.partyId } },
      // TEMP PIN-948
      // config: { params: { state: 'PUBLISHED', callerId: party?.partyId } },
    },
    {
      mapFn: (data) => data.map((d) => ({ ...d, isMine: d.producerId === party?.partyId })),
      loaderType: 'contextual',
      loadingTextLabel: 'Stiamo caricando la lista degli e-service',
    }
  )

  const headData = ['nome e-service', 'ente erogatore', 'versione attuale', 'stato e-service', '']

  const OwnerTooltip = ({ label = '', Icon }: { label: string; Icon: SvgIconComponent }) => (
    <StyledTooltip title={label}>
      <Icon sx={{ ml: 0.5, fontSize: 16 }} color="secondary" />
    </StyledTooltip>
  )

  const wrapSubscribe = (eservice: EServiceFlatDecoratedReadType) => async () => {
    const agreementData = {
      eserviceId: eservice.id,
      descriptorId: eservice.descriptorId,
      consumerId: party?.partyId,
    }

    await runActionWithDestination(
      { path: { endpoint: 'AGREEMENT_CREATE' }, config: { data: agreementData } },
      { destination: ROUTES.SUBSCRIBE_AGREEMENT_LIST, suppressToast: false }
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
            buildDynamicPath(ROUTES.SUBSCRIBE_AGREEMENT_EDIT.PATH, {
              id: eservice.callerSubscribed as string,
            })
          )
        },
        label: "Vai all'accordo",
      })
    }

    if (!eservice.isMine && isAdmin(party) && !eservice.callerSubscribed && canSubscribeEservice) {
      const eserviceSubscribeFormInitialValues: EserviceSubscribeFormInputValues = {
        agreementHandle: { confirm: false },
      }
      const eserviceSubscribeFormValidationSchema = object({
        agreementHandle: object({
          confirm: boolean().test('value', 'La checkbox deve essere spuntata', isTrue),
        }),
      })

      actions.push({
        onClick: () => {
          setDialog({
            type: 'subscribe',
            onSubmit: wrapSubscribe(eservice),
            initialValues: eserviceSubscribeFormInitialValues,
            validationSchema: eserviceSubscribeFormValidationSchema,
          } as DialogSubscribeProps)
        },
        label: 'Iscriviti',
      })
    }

    if (!eservice.isMine && isAdmin(party) && !canSubscribeEservice) {
      actions.push({
        onClick: () => {
          setDialog({ type: 'askExtension' })
        },
        label: 'Richiedi estensione',
        isMock: true,
      })
    }

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
          title: 'Gli e-service disponibili',
          description:
            "In quest'area puoi vedere tutti gli e-service nel catalogo, e aderire a quelli a cui sei interessato",
        }}
      </StyledIntro>

      <TempFilters />

      <TableWithLoader
        loadingText={loadingText}
        headData={headData}
        data={data}
        noDataLabel="Non ci sono servizi disponibili"
        error={error}
      >
        {party &&
          data?.map((item, i) => {
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
