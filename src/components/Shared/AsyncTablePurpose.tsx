import React, { useContext } from 'react'
import { useHistory } from 'react-router-dom'
import { AxiosResponse } from 'axios'
import { number, object } from 'yup'
import {
  ActionProps,
  DecoratedPurpose,
  DialogUpdatePurposeDailyCallsFormInputValues,
  MUIColor,
  Purpose,
  PurposeState,
  PurposeVersion,
} from '../../../types'
import { Box, Chip } from '@mui/material'
import { useAsyncFetch } from '../../hooks/useAsyncFetch'
import { RunAction, RunActionOutput, useFeedback } from '../../hooks/useFeedback'
import { useRoute } from '../../hooks/useRoute'
import { DialogContext } from '../../lib/context'
import { formatDateString, formatThousands } from '../../lib/format-utils'
import { decoratePurposeWithMostRecentVersion } from '../../lib/purpose'
import { ActionMenu } from './ActionMenu'
import { StyledButton } from './StyledButton'
import { StyledTableRow } from './StyledTableRow'
import { TableWithLoader } from './TableWithLoader'
import { buildDynamicPath } from '../../lib/router-utils'
import { useTranslation } from 'react-i18next'
import { useJwt } from '../../hooks/useJwt'

const CHIP_COLORS: Record<PurposeState, MUIColor> = {
  DRAFT: 'info',
  ACTIVE: 'primary',
  SUSPENDED: 'error',
  WAITING_FOR_APPROVAL: 'warning',
  ARCHIVED: 'info',
}

type AsyncTablePurposeInEServiceProps = {
  forceRerenderCounter: number
  runAction: RunAction
  eserviceId?: string
}

export const AsyncTablePurposeInEService = ({
  forceRerenderCounter,
  runAction,
  eserviceId,
}: AsyncTablePurposeInEServiceProps) => {
  const { t } = useTranslation(['purpose', 'common'])
  const { setDialog } = useContext(DialogContext)

  const { data: purposeData, isLoading /* , error */ } = useAsyncFetch<
    { purposes: Array<Purpose> },
    Array<DecoratedPurpose>
  >(
    {
      path: { endpoint: 'PURPOSE_GET_LIST' },
      config: { params: { states: 'WAITING_FOR_APPROVAL', eserviceId } },
    },
    {
      mapFn: (data) => data.purposes.map(decoratePurposeWithMostRecentVersion),
      useEffectDeps: [forceRerenderCounter],
    }
  )

  /*
   * List of possible actions for the user to perform
   */
  const wrapUpdatePurposeExpectedApprovalDate =
    (purposeId: string, versionId: string, approvalDate?: string) => () => {
      setDialog({
        type: 'setPurposeExpectedApprovalDate',
        purposeId,
        versionId,
        approvalDate,
        runAction,
      })
    }

  const wrapActivatePurpose = (purposeId: string, versionId: string) => async () => {
    await runAction(
      {
        path: {
          endpoint: 'PURPOSE_VERSION_ACTIVATE',
          endpointParams: { purposeId, versionId },
        },
      },
      { showConfirmDialog: true }
    )
  }
  /*
   * End list of actions
   */

  const getAvailableActions = (item: DecoratedPurpose): Array<ActionProps> => {
    const mostRecentVersion = item.mostRecentVersion as PurposeVersion
    const actions = [
      {
        onClick: wrapUpdatePurposeExpectedApprovalDate(
          item.id,
          mostRecentVersion.id,
          mostRecentVersion.expectedApprovalDate
        ),
        label: t('tablePurposeInEService.actions.updateCompletionDate'),
      },
      {
        onClick: wrapActivatePurpose(item.id, mostRecentVersion.id),
        label: t('actions.activate', { ns: 'common' }),
      },
    ]
    return actions
  }

  const headData = ['Nome finalità', 'Stima di carico', 'Data di completamento', '']

  return (
    <TableWithLoader
      isLoading={isLoading}
      loadingText={t('tablePurposeInEService.loadingLabel')}
      headData={headData}
      noDataLabel={t('tablePurposeInEService.noDataLabel')}
    >
      {purposeData &&
        Boolean(purposeData.length > 0) &&
        purposeData.map((item, i) => {
          const mostRecentVersion = item.mostRecentVersion as PurposeVersion
          return (
            <StyledTableRow
              key={i}
              cellData={[
                { label: item.title },
                { label: formatThousands(mostRecentVersion.dailyCalls) },
                {
                  label: mostRecentVersion.expectedApprovalDate
                    ? formatDateString(mostRecentVersion.expectedApprovalDate)
                    : t('tablePurposeInEService.awaitingLabel'),
                },
              ]}
            >
              <ActionMenu actions={getAvailableActions(item)} />
            </StyledTableRow>
          )
        })}
    </TableWithLoader>
  )
}

export const AsyncTablePurpose = () => {
  const { t } = useTranslation(['purpose', 'common'])
  const { routes } = useRoute()
  const history = useHistory()
  const { runAction, forceRerenderCounter } = useFeedback()
  const { setDialog } = useContext(DialogContext)
  const { jwt } = useJwt()

  const { data, isLoading /*, error */ } = useAsyncFetch<
    { purposes: Array<Purpose> },
    Array<DecoratedPurpose>
  >(
    { path: { endpoint: 'PURPOSE_GET_LIST' } },
    {
      mapFn: (data) =>
        data.purposes
          // TEMP REFACTOR: after integration with self care, this will not be necessary
          .filter((p) => p.consumerId === jwt?.organization.id)
          .map(decoratePurposeWithMostRecentVersion),
      useEffectDeps: [forceRerenderCounter],
    }
  )

  /*
   * List of possible actions for the user to perform
   */
  const wrapUpdateDailyCalls = (purposeId: string) => async () => {
    setDialog({
      type: 'updatePurposeDailyCalls',
      initialValues: { dailyCalls: 1 },
      validationSchema: object({ dailyCalls: number().required() }),
      onSubmit: async ({ dailyCalls }: DialogUpdatePurposeDailyCallsFormInputValues) => {
        const { outcome, response } = (await runAction(
          {
            path: { endpoint: 'PURPOSE_VERSION_DRAFT_CREATE', endpointParams: { purposeId } },
            config: { data: { dailyCalls } },
          },
          { suppressToast: ['success'], silent: true }
        )) as RunActionOutput

        if (outcome === 'success') {
          const versionId = (response as AxiosResponse).data.id
          await runAction({
            path: {
              endpoint: 'PURPOSE_VERSION_ACTIVATE',
              endpointParams: { purposeId, versionId },
            },
          })
        }
      },
    })
  }

  const wrapDeleteVersion = (purpose: DecoratedPurpose) => async () => {
    const mostRecentVersion = purpose.mostRecentVersion as PurposeVersion
    await runAction(
      {
        path: {
          endpoint: 'PURPOSE_VERSION_DELETE',
          endpointParams: { purposeId: purpose.id, versionId: mostRecentVersion.id },
        },
      },
      { showConfirmDialog: true }
    )
  }

  const wrapDelete = (purposeId: string) => async () => {
    await runAction(
      {
        path: { endpoint: 'PURPOSE_DRAFT_DELETE', endpointParams: { purposeId } },
      },
      { showConfirmDialog: true }
    )
  }

  const wrapArchive = (purpose: DecoratedPurpose) => async () => {
    const currentVersion = purpose.currentVersion as PurposeVersion
    await runAction(
      {
        path: {
          endpoint: 'PURPOSE_VERSION_ARCHIVE',
          endpointParams: { purposeId: purpose.id, versionId: currentVersion.id },
        },
      },
      { showConfirmDialog: true }
    )
  }

  const wrapSuspend = (purpose: DecoratedPurpose) => async () => {
    const currentVersion = purpose.currentVersion as PurposeVersion
    await runAction(
      {
        path: {
          endpoint: 'PURPOSE_VERSION_SUSPEND',
          endpointParams: { purposeId: purpose.id, versionId: currentVersion.id },
        },
      },
      { showConfirmDialog: true }
    )
  }

  const wrapActivate = (purpose: DecoratedPurpose) => async () => {
    const currentVersion = purpose.currentVersion as PurposeVersion
    await runAction(
      {
        path: {
          endpoint: 'PURPOSE_VERSION_ACTIVATE',
          endpointParams: { purposeId: purpose.id, versionId: currentVersion.id },
        },
      },
      { showConfirmDialog: true }
    )
  }
  /*
   * End list of actions
   */

  // Build list of available actions for each service in its current state
  const getAvailableActions = (purpose: DecoratedPurpose): Array<ActionProps> => {
    const archiveAction = {
      onClick: wrapArchive(purpose),
      label: t('actions.archive', { ns: 'common' }),
    }
    const suspendAction = {
      onClick: wrapSuspend(purpose),
      label: t('actions.suspend', { ns: 'common' }),
    }
    const activateAction = {
      onClick: wrapActivate(purpose),
      label: t('actions.activate', { ns: 'common' }),
    }
    const deleteAction = {
      onClick: wrapDelete(purpose.id),
      label: t('actions.delete', { ns: 'common' }),
    }
    const deleteVersionAction = {
      onClick: wrapDeleteVersion(purpose),
      label: t('tablePurpose.actions.deleteDailyCallsUpdate'),
    }

    const updateDailyCallsAction = {
      onClick: wrapUpdateDailyCalls(purpose.id),
      label: t('tablePurpose.actions.updateDailyCalls'),
    }

    const hasVersion = Boolean(purpose.mostRecentVersion)

    const availableActions: Record<PurposeState, Array<ActionProps>> = {
      DRAFT: hasVersion ? [activateAction, deleteAction] : [deleteAction],
      ACTIVE: [suspendAction, updateDailyCallsAction],
      SUSPENDED: [activateAction, archiveAction],
      WAITING_FOR_APPROVAL: [purpose.versions.length > 1 ? deleteVersionAction : deleteAction],
      ARCHIVED: [],
    }

    const status = hasVersion ? (purpose.mostRecentVersion as PurposeVersion).state : 'DRAFT'

    // Return all the actions available for this particular status
    return availableActions[status] || []
  }

  const headData = [
    t('table.headData.purposeName', { ns: 'common' }),
    t('table.headData.eserviceName', { ns: 'common' }),
    t('table.headData.providerName', { ns: 'common' }),
    t('table.headData.purposeStatus', { ns: 'common' }),
    '',
  ]

  return (
    <TableWithLoader
      isLoading={isLoading}
      loadingText={t('loadingMultiLabel')}
      headData={headData}
      noDataLabel={t('noMultiDataLabel')}
      // error={axiosErrorToError(error)}
    >
      {data &&
        Boolean(data.length > 0) &&
        data.map((item, i) => {
          const currentState = item.currentVersion ? item.currentVersion.state : 'DRAFT'
          return (
            <StyledTableRow
              key={i}
              cellData={[
                { label: item.title },
                { label: item.eservice.name },
                { label: item.eservice.producer.name },
                {
                  custom: (
                    <React.Fragment>
                      <Chip
                        label={t(`status.purpose.${currentState}`, {
                          ns: 'common',
                        })}
                        color={CHIP_COLORS[currentState]}
                      />
                      {item.awaitingApproval && (
                        <Chip
                          sx={{ ml: 1 }}
                          label={t(`status.purpose.WAITING_FOR_APPROVAL`, { ns: 'common' })}
                          color={CHIP_COLORS['WAITING_FOR_APPROVAL']}
                        />
                      )}
                    </React.Fragment>
                  ),
                },
              ]}
            >
              <StyledButton
                variant="outlined"
                size="small"
                onClick={() => {
                  const path =
                    !item.currentVersion || item.currentVersion.state === 'DRAFT'
                      ? routes.SUBSCRIBE_PURPOSE_EDIT.PATH
                      : routes.SUBSCRIBE_PURPOSE_VIEW.PATH

                  history.push(buildDynamicPath(path, { purposeId: item.id }))
                }}
              >
                {t(
                  `actions.${
                    !item.currentVersion || item.currentVersion.state === 'DRAFT'
                      ? 'edit'
                      : 'inspect'
                  }`,
                  {
                    ns: 'common',
                  }
                )}
              </StyledButton>

              <Box component="span" sx={{ ml: 2, display: 'inline-block' }}>
                <ActionMenu actions={getAvailableActions(item)} />
              </Box>
            </StyledTableRow>
          )
        })}
    </TableWithLoader>
  )
}
