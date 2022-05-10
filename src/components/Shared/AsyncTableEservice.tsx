import React, { useContext } from 'react'
import { useHistory } from 'react-router-dom'
import { Box, Card, CardActions, CardContent, Typography } from '@mui/material'
import { ButtonNaked } from '@pagopa/mui-italia'
import {
  Clear as ClearIcon,
  Check as CheckIcon,
  Person as PersonIcon,
  SvgIconComponent,
} from '@mui/icons-material'
import {
  ActionProps,
  ApiEndpointKey,
  EServiceDescriptorRead,
  EServiceFlatDecoratedReadType,
  EServiceFlatReadType,
  EServiceState,
} from '../../../types'
import { useAsyncFetch } from '../../hooks/useAsyncFetch'
import { RunActionOutput, useFeedback } from '../../hooks/useFeedback'
import { useRoute } from '../../hooks/useRoute'
import { canSubscribe } from '../../lib/attributes'
import { isAdmin } from '../../lib/auth-utils'
import { DialogContext, LangContext, PartyContext } from '../../lib/context'
import { axiosErrorToError } from '../../lib/error-utils'
import { buildDynamicPath } from '../../lib/router-utils'
import { ActionMenu } from './ActionMenu'
import { StyledTooltip } from './StyledTooltip'
import { TableWithLoader } from './TableWithLoader'
import { AxiosResponse } from 'axios'
import { StyledTableRow } from './StyledTableRow'
import { ESERVICE_STATE_LABEL } from '../../config/labels'
import { StyledButton } from './StyledButton'
import { URL_FRAGMENTS } from '../../lib/constants'

export const AsyncTableEServiceCatalog = () => {
  const history = useHistory()
  const { runAction } = useFeedback()
  const { party } = useContext(PartyContext)
  const { setDialog } = useContext(DialogContext)
  const { routes } = useRoute()

  const { data, error, isLoading } = useAsyncFetch<
    Array<EServiceFlatReadType>,
    Array<EServiceFlatDecoratedReadType>
  >(
    {
      path: { endpoint: 'ESERVICE_GET_LIST_FLAT' },
      config: { params: { state: 'PUBLISHED', callerId: party?.id } },
    },
    {
      mapFn: (data) => data.map((d) => ({ ...d, isMine: d.producerId === party?.id })),
    }
  )

  const OwnerTooltip = ({ label = '', Icon }: { label: string; Icon: SvgIconComponent }) => (
    <StyledTooltip title={label}>
      <Icon sx={{ ml: 0.75, fontSize: 16 }} color="primary" />
    </StyledTooltip>
  )

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

  /*
   * List of possible actions for the user to perform
   */
  const wrapSubscribe = (eservice: EServiceFlatDecoratedReadType) => async () => {
    const agreementData = {
      eserviceId: eservice.id,
      descriptorId: eservice.descriptorId,
      consumerId: party?.id,
    }

    await runAction(
      { path: { endpoint: 'AGREEMENT_CREATE' }, config: { data: agreementData } },
      { onSuccessDestination: routes.SUBSCRIBE_AGREEMENT_LIST }
    )
  }
  /*
   * End list of actions
   */

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

  const headData = ['Nome E-Service', 'Ente erogatore', 'Versione attuale', 'Stato E-Service', '']

  return (
    <TableWithLoader
      isLoading={isLoading}
      loadingText="Stiamo caricando la lista degli E-Service"
      headData={headData}
      noDataLabel="Non ci sono E-Service disponibili"
      error={axiosErrorToError(error)}
      viewType="grid"
    >
      {party &&
        data &&
        Boolean(data.length > 0) &&
        data.map((item, i) => {
          const canSubscribeEservice = canSubscribe(party.attributes, item.certifiedAttributes)
          const tooltip = getTooltip(item, canSubscribeEservice)
          return (
            <Card
              key={i}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                height: '100%',
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography component="span">
                    {item.name}, v. {item.version}
                  </Typography>{' '}
                  {tooltip}
                </Box>

                <Typography color="text.secondary">{item.producerName}</Typography>
              </CardContent>

              <CardActions
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  p: 2,
                }}
              >
                <ButtonNaked
                  size="medium"
                  color="primary"
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
                </ButtonNaked>

                <ActionMenu actions={getAvailableActions(item, canSubscribeEservice)} />
              </CardActions>
            </Card>
          )
        })}
    </TableWithLoader>
  )
}

export const AsyncTableEServiceList = () => {
  const { routes } = useRoute()
  const { party } = useContext(PartyContext)
  const { lang } = useContext(LangContext)
  const history = useHistory()
  const { runAction, forceRerenderCounter } = useFeedback()

  const { data, error, isLoading } = useAsyncFetch<Array<EServiceFlatReadType>>(
    {
      path: { endpoint: 'ESERVICE_GET_LIST_FLAT' },
      config: { params: { producerId: party?.id, callerId: party?.id } },
    },
    { useEffectDeps: [forceRerenderCounter] }
  )

  /*
   * List of possible actions for the user to perform
   */
  const wrapPublishDraft = (eserviceId: string, descriptorId?: string) => async () => {
    await runAction(
      {
        path: {
          endpoint: 'ESERVICE_VERSION_DRAFT_PUBLISH',
          endpointParams: { eserviceId, descriptorId },
        },
      },
      { showConfirmDialog: true }
    )
  }

  const wrapDeleteDraft = (eserviceId: string, descriptorId?: string) => async () => {
    let endpoint: ApiEndpointKey = 'ESERVICE_DRAFT_DELETE'
    const endpointParams: Record<string, string> = { eserviceId }

    if (descriptorId) {
      endpoint = 'ESERVICE_VERSION_DRAFT_DELETE'
      endpointParams.descriptorId = descriptorId
    }

    await runAction({ path: { endpoint, endpointParams } }, { showConfirmDialog: true })
  }

  const wrapSuspend = (eserviceId: string, descriptorId?: string) => async () => {
    await runAction(
      {
        path: {
          endpoint: 'ESERVICE_VERSION_SUSPEND',
          endpointParams: { eserviceId, descriptorId },
        },
      },
      { showConfirmDialog: true }
    )
  }

  const wrapReactivate = (eserviceId: string, descriptorId?: string) => async () => {
    await runAction(
      {
        path: {
          endpoint: 'ESERVICE_VERSION_REACTIVATE',
          endpointParams: { eserviceId, descriptorId },
        },
      },
      { showConfirmDialog: true }
    )
  }

  // const archive = () => {
  //   //
  // }

  // Clones the properties and generates a new service
  const wrapClone = (eserviceId: string, descriptorId?: string) => async () => {
    await runAction(
      {
        path: {
          endpoint: 'ESERVICE_CLONE_FROM_VERSION',
          endpointParams: { eserviceId, descriptorId },
        },
      },
      { showConfirmDialog: true }
    )
  }

  // Clones all the properties of the previous version and generates a new draft version
  const wrapCreateNewVersionDraft = (eserviceId: string) => async () => {
    const { outcome, response } = (await runAction(
      {
        path: { endpoint: 'ESERVICE_VERSION_DRAFT_CREATE', endpointParams: { eserviceId } },
        config: {
          data: {
            voucherLifespan: 1,
            audience: [],
            description: '',
            dailyCallsPerConsumer: 1,
            dailyCallsTotal: 1,
          },
        },
      },
      { suppressToast: ['success'], showConfirmDialog: true }
    )) as RunActionOutput

    if (outcome === 'success') {
      const successResponse = response as AxiosResponse<EServiceDescriptorRead>
      const descriptorId = successResponse.data.id
      history.push(
        buildDynamicPath(routes.PROVIDE_ESERVICE_EDIT.PATH, {
          eserviceId,
          descriptorId,
        }),
        { stepIndexDestination: 1 }
      )
    }
  }
  /*
   * End list of actions
   */

  type EServiceAction = Record<EServiceState, Array<ActionProps | null>>
  // Build list of available actions for each service in its current state
  const getAvailableActions = (service: EServiceFlatReadType) => {
    const { id: eserviceId, descriptorId, state } = service

    const suspendAction = { onClick: wrapSuspend(eserviceId, descriptorId), label: 'Sospendi' }
    const reactivateAction = {
      onClick: wrapReactivate(eserviceId, descriptorId),
      label: 'Riattiva',
    }
    const cloneAction = { onClick: wrapClone(eserviceId, descriptorId), label: 'Clona' }
    const createVersionDraftAction = {
      onClick: wrapCreateNewVersionDraft(eserviceId),
      label: 'Crea bozza nuova versione',
    }
    // TEMP PIN-645
    // const archiveAction = { onClick: archive, label: 'Archivia' }
    const publishDraftAction = {
      onClick: wrapPublishDraft(eserviceId, descriptorId),
      label: 'Pubblica',
    }
    const deleteDraftAction = {
      onClick: wrapDeleteDraft(eserviceId, descriptorId),
      label: 'Elimina',
    }

    const availableActions: EServiceAction = {
      PUBLISHED: [suspendAction, cloneAction, createVersionDraftAction],
      ARCHIVED: [],
      DEPRECATED: [suspendAction /*, archiveAction */],
      DRAFT: [descriptorId ? publishDraftAction : null, deleteDraftAction],
      SUSPENDED: [reactivateAction, cloneAction, createVersionDraftAction],
    }

    // Return all the actions available for this particular status
    return availableActions[state || 'DRAFT'].filter((a) => a !== null) as Array<ActionProps>
  }

  // Data for the table head
  const headData = ['Nome E-Service', 'Versione', 'Stato E-Service', '']

  return (
    <TableWithLoader
      isLoading={isLoading}
      loadingText="Stiamo caricando i tuoi E-Service"
      headData={headData}
      noDataLabel="Non ci sono servizi disponibili"
      error={axiosErrorToError(error)}
    >
      {data &&
        Boolean(data.length > 0) &&
        data.map((item, i) => (
          <StyledTableRow
            key={i}
            cellData={[
              { label: item.name },
              { label: item.version || '1' },
              { label: ESERVICE_STATE_LABEL[item.state || 'DRAFT'] },
            ]}
          >
            <StyledButton
              variant="outlined"
              size="small"
              onClick={() => {
                const destPath =
                  !item.state || item.state === 'DRAFT'
                    ? routes.PROVIDE_ESERVICE_EDIT.PATH
                    : routes.PROVIDE_ESERVICE_MANAGE.PATH

                history.push(
                  buildDynamicPath(destPath, {
                    eserviceId: item.id,
                    descriptorId: item.descriptorId || URL_FRAGMENTS.FIRST_DRAFT[lang],
                  })
                )
              }}
            >
              {!item.state || item.state === 'DRAFT' ? 'Modifica' : 'Ispeziona'}
            </StyledButton>

            <Box component="span" sx={{ ml: 2, display: 'inline-block' }}>
              <ActionMenu actions={getAvailableActions(item)} />
            </Box>
          </StyledTableRow>
        ))}
    </TableWithLoader>
  )
}
