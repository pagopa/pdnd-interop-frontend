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
import { DialogContext, LangContext } from '../../lib/context'
import { axiosErrorToError } from '../../lib/error-utils'
import { buildDynamicPath } from '../../lib/router-utils'
import { ActionMenu } from './ActionMenu'
import { StyledTooltip } from './StyledTooltip'
import { TableWithLoader } from './TableWithLoader'
import { AxiosResponse } from 'axios'
import { StyledTableRow } from './StyledTableRow'
import { StyledButton } from './StyledButton'
import { URL_FRAGMENTS } from '../../lib/constants'
import { useTranslation } from 'react-i18next'
import { useJwt } from '../../hooks/useJwt'

export const AsyncTableEServiceCatalog = () => {
  const { t } = useTranslation(['eservice', 'common'])
  const history = useHistory()
  const { runAction } = useFeedback()
  const { jwt, isAdmin } = useJwt()
  const { setDialog } = useContext(DialogContext)
  const { routes } = useRoute()

  const { data, error, isLoading } = useAsyncFetch<
    Array<EServiceFlatReadType>,
    Array<EServiceFlatDecoratedReadType>
  >(
    {
      path: { endpoint: 'ESERVICE_GET_LIST_FLAT' },
      config: { params: { state: 'PUBLISHED', callerId: jwt?.organization.id } },
    },
    {
      mapFn: (data) => data.map((d) => ({ ...d, isMine: d.producerId === jwt?.organization.id })),
    }
  )

  const OwnerTooltip = ({ label = '', Icon }: { label: string; Icon: SvgIconComponent }) => (
    <StyledTooltip title={label}>
      <Icon sx={{ ml: 0.75, fontSize: 16 }} color="primary" />
    </StyledTooltip>
  )

  const getTooltip = (item: EServiceFlatDecoratedReadType, canSubscribeEservice: boolean) => {
    if (item.isMine) {
      return <OwnerTooltip label={t('tableEServiceCatalog.youAreTheProvider')} Icon={PersonIcon} />
    }

    if (item.callerSubscribed && isAdmin) {
      return <OwnerTooltip label={t('tableEServiceCatalog.alreadySubscribed')} Icon={CheckIcon} />
    }

    if (!item.isMine && !canSubscribeEservice) {
      return (
        <OwnerTooltip
          label={t('tableEServiceCatalog.missingCertifiedAttributes')}
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
      consumerId: jwt?.organization.id,
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

    if (!eservice.isMine && isAdmin && eservice.callerSubscribed) {
      actions.push({
        onClick: () => {
          history.push(
            buildDynamicPath(routes.SUBSCRIBE_AGREEMENT_EDIT.PATH, {
              agreementId: eservice.callerSubscribed as string,
            })
          )
        },
        label: t('tableEServiceCatalog.goToRequestCta'),
      })
    }

    if (!eservice.isMine && isAdmin && !eservice.callerSubscribed && canSubscribeEservice) {
      actions.push({
        onClick: () => {
          setDialog({
            type: 'basic',
            proceedCallback: wrapSubscribe(eservice),
            proceedLabel: t('tableEServiceCatalog.subscribeModal.proceedLabel'),
            title: t('tableEServiceCatalog.subscribeModal.title'),
            description: t('tableEServiceCatalog.subscribeModal.description', {
              name: eservice.name,
              version: eservice.version,
            }),
            close: () => {
              setDialog(null)
            },
          })
        },
        label: t('actions.subscribe', { ns: 'common' }),
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

  const headData = [
    t('table.headData.eserviceName', { ns: 'common' }),
    t('table.headData.providerName', { ns: 'common' }),
    t('table.headData.currentVersion', { ns: 'common' }),
    t('table.headData.eserviceStatus', { ns: 'common' }),
    '',
  ]

  // REIMPLEMENT
  return null

  /*
  return (
    <TableWithLoader
      isLoading={isLoading}
      loadingText={t('loadingMultiLabel')}
      headData={headData}
      noDataLabel={t('noMultiDataLabel')}
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
                  {t('actions.inspect', { ns: 'common' })}
                </ButtonNaked>

                <ActionMenu actions={getAvailableActions(item, canSubscribeEservice)} />
              </CardActions>
            </Card>
          )
        })}
    </TableWithLoader>
  )
  */
}

export const AsyncTableEServiceList = () => {
  const { t } = useTranslation(['eservice', 'common'])
  const { routes } = useRoute()
  const { lang } = useContext(LangContext)
  const { jwt } = useJwt()
  const history = useHistory()
  const { runAction, forceRerenderCounter } = useFeedback()

  const { data, error, isLoading } = useAsyncFetch<Array<EServiceFlatReadType>>(
    {
      path: { endpoint: 'ESERVICE_GET_LIST_FLAT' },
      config: { params: { producerId: jwt?.organization.id, callerId: jwt?.organization.id } },
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

    const suspendAction = {
      onClick: wrapSuspend(eserviceId, descriptorId),
      label: t('actions.suspend', { ns: 'common' }),
    }
    const reactivateAction = {
      onClick: wrapReactivate(eserviceId, descriptorId),
      label: t('actions.activate', { ns: 'common' }),
    }
    const cloneAction = {
      onClick: wrapClone(eserviceId, descriptorId),
      label: t('actions.clone', { ns: 'common' }),
    }
    const createVersionDraftAction = {
      onClick: wrapCreateNewVersionDraft(eserviceId),
      label: t('actions.createNewDraft', { ns: 'common' }),
    }
    // TEMP PIN-645
    // const archiveAction = { onClick: archive, label: 'Archivia' }
    const publishDraftAction = {
      onClick: wrapPublishDraft(eserviceId, descriptorId),
      label: t('actions.publish', { ns: 'common' }),
    }
    const deleteDraftAction = {
      onClick: wrapDeleteDraft(eserviceId, descriptorId),
      label: t('actions.delete', { ns: 'common' }),
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
  const headData = [
    t('table.headData.eserviceName', { ns: 'common' }),
    t('table.headData.version', { ns: 'common' }),
    t('table.headData.eserviceStatus', { ns: 'common' }),
    '',
  ]

  return (
    <TableWithLoader
      isLoading={isLoading}
      loadingText={t('loadingMultiLabel')}
      headData={headData}
      noDataLabel={t('noMultiDataLabel')}
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
              { label: t(`status.eservice.${item.state || 'DRAFT'}`, { ns: 'common' }) },
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
              {t(`actions.${!item.state || item.state === 'DRAFT' ? 'edit' : 'inspect'}`, {
                ns: 'common',
              })}
            </StyledButton>

            <Box component="span" sx={{ ml: 2, display: 'inline-block' }}>
              <ActionMenu actions={getAvailableActions(item)} />
            </Box>
          </StyledTableRow>
        ))}
    </TableWithLoader>
  )
}
