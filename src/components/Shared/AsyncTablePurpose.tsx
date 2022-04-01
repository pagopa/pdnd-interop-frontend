import React, { useContext } from 'react'
import { useHistory } from 'react-router-dom'
import { AxiosResponse } from 'axios'
import { number, object } from 'yup'
import {
  ActionProps,
  DecoratedPurpose,
  DialogUpdatePurposeDailyCallsFormInputValues,
  Purpose,
  PurposeState,
} from '../../../types'
import { Box } from '@mui/material'
import { useAsyncFetch } from '../../hooks/useAsyncFetch'
import { RunAction, RunActionOutput, useFeedback } from '../../hooks/useFeedback'
import { useRoute } from '../../hooks/useRoute'
import { DialogContext, PartyContext } from '../../lib/context'
import { formatDateString, formatThousands } from '../../lib/format-utils'
import { decoratePurposeWithMostRecentVersion } from '../../lib/purpose'
import { ActionMenu } from './ActionMenu'
import { StyledButton } from './StyledButton'
import { StyledTableRow } from './StyledTableRow'
import { TableWithLoader } from './TableWithLoader'
import { PURPOSE_STATE_LABEL } from '../../config/labels'
import { buildDynamicPath } from '../../lib/router-utils'

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
  const { setDialog } = useContext(DialogContext)

  const { data: purposeData /* , error */ } = useAsyncFetch<
    { purposes: Array<Purpose> },
    Array<DecoratedPurpose>
  >(
    {
      path: { endpoint: 'PURPOSE_GET_LIST' },
      config: { params: { states: 'WAITING_FOR_APPROVAL', eserviceId } },
    },
    {
      mapFn: (data) => data.purposes.map(decoratePurposeWithMostRecentVersion),
      loaderType: 'contextual',
      loadingTextLabel: 'Stiamo caricando le finalità in attesa',
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
    const actions = [
      {
        onClick: wrapUpdatePurposeExpectedApprovalDate(
          item.id,
          item.mostRecentVersion.id,
          item.mostRecentVersion.expectedApprovalDate
        ),
        label: 'Aggiorna data di completamento',
      },
      {
        onClick: wrapActivatePurpose(item.id, item.mostRecentVersion.id),
        label: 'Attiva',
      },
    ]
    return actions
  }

  const headData = ['Nome finalità', 'Stima di carico', 'Data di completamento', '']

  return (
    <TableWithLoader
      loadingText={null}
      headData={headData}
      noDataLabel="Nessuna finalità da evadere"
    >
      {purposeData &&
        Boolean(purposeData.length > 0) &&
        purposeData.map((item, i) => {
          return (
            <StyledTableRow
              key={i}
              cellData={[
                { label: item.title },
                { label: formatThousands(item.mostRecentVersion.dailyCalls) },
                {
                  label: item.mostRecentVersion.expectedApprovalDate
                    ? formatDateString(item.mostRecentVersion.expectedApprovalDate)
                    : 'In attesa di presa in carico',
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
  const { routes } = useRoute()
  const history = useHistory()
  const { runAction, forceRerenderCounter } = useFeedback()
  const { setDialog } = useContext(DialogContext)

  const { party } = useContext(PartyContext)

  const { data, loadingText /*, error */ } = useAsyncFetch<
    { purposes: Array<Purpose> },
    Array<DecoratedPurpose>
  >(
    { path: { endpoint: 'PURPOSE_GET_LIST' } },
    {
      loaderType: 'contextual',
      loadingTextLabel: 'Stiamo caricando le finalità',
      mapFn: (data) =>
        data.purposes
          // TEMP REFACTOR: after integration with self care, this will not be necessary
          .filter((p) => p.consumerId === party?.id)
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
    await runAction(
      {
        path: {
          endpoint: 'PURPOSE_VERSION_DELETE',
          endpointParams: { purposeId: purpose.id, versionId: purpose.mostRecentVersion.id },
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
    await runAction(
      {
        path: {
          endpoint: 'PURPOSE_VERSION_ARCHIVE',
          endpointParams: { purposeId: purpose.id, versionId: purpose.currentVersion.id },
        },
      },
      { showConfirmDialog: true }
    )
  }

  const wrapSuspend = (purpose: DecoratedPurpose) => async () => {
    await runAction(
      {
        path: {
          endpoint: 'PURPOSE_VERSION_SUSPEND',
          endpointParams: { purposeId: purpose.id, versionId: purpose.currentVersion.id },
        },
      },
      { showConfirmDialog: true }
    )
  }

  const wrapActivate = (purpose: DecoratedPurpose) => async () => {
    await runAction(
      {
        path: {
          endpoint: 'PURPOSE_VERSION_ACTIVATE',
          endpointParams: { purposeId: purpose.id, versionId: purpose.currentVersion.id },
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
    const archiveAction = { onClick: wrapArchive(purpose), label: 'Archivia' }
    const suspendAction = { onClick: wrapSuspend(purpose), label: 'Sospendi' }
    const activateAction = { onClick: wrapActivate(purpose), label: 'Attiva' }
    const deleteAction = { onClick: wrapDelete(purpose.id), label: 'Elimina' }
    const deleteVersionAction = {
      onClick: wrapDeleteVersion(purpose),
      label: 'Elimina aggiornamento numero chiamate',
    }

    const updateDailyCallsAction = {
      onClick: wrapUpdateDailyCalls(purpose.id),
      label: 'Aggiorna numero chiamate',
    }

    const availableActions: Record<PurposeState, Array<ActionProps>> = {
      DRAFT: [activateAction, deleteAction],
      ACTIVE: [suspendAction, updateDailyCallsAction],
      SUSPENDED: [activateAction, archiveAction],
      WAITING_FOR_APPROVAL: [purpose.versions.length > 1 ? deleteVersionAction : deleteAction],
      ARCHIVED: [],
    }

    const status = purpose.mostRecentVersion.state

    // Return all the actions available for this particular status
    return availableActions[status] || []
  }

  const headData = ['Nome finalità', 'E-Service', 'Ente erogatore', 'Stato', '']

  return (
    <TableWithLoader
      loadingText={loadingText}
      headData={headData}
      noDataLabel="Non sono state create finalità"
      // error={axiosErrorToError(error)}
    >
      {data &&
        Boolean(data.length > 0) &&
        data.map((item, i) => {
          const purposeStateLabel = PURPOSE_STATE_LABEL[item.currentVersion.state]
          return (
            <StyledTableRow
              key={i}
              cellData={[
                { label: item.title },
                { label: item.eservice.name },
                { label: item.eservice.producer.name },
                {
                  label: item.awaitingApproval
                    ? `${purposeStateLabel}, in aggiornamento`
                    : purposeStateLabel,
                },
              ]}
            >
              <StyledButton
                variant="outlined"
                size="small"
                onClick={() => {
                  const path =
                    item.currentVersion.state === 'DRAFT'
                      ? routes.SUBSCRIBE_PURPOSE_EDIT.PATH
                      : routes.SUBSCRIBE_PURPOSE_VIEW.PATH

                  history.push(buildDynamicPath(path, { purposeId: item.id }))
                }}
              >
                {item.currentVersion.state === 'DRAFT' ? 'Modifica' : 'Ispeziona'}
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
