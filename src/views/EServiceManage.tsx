import React from 'react'
import { StyledIntro } from '../components/Shared/StyledIntro'
import {
  ActionProps,
  ApiEndpointKey,
  EServiceDescriptorRead,
  EServiceReadType,
  EServiceState,
} from '../../types'
import { RunActionOutput, useFeedback } from '../hooks/useFeedback'
import { useHistory, useParams } from 'react-router-dom'
import { decorateEServiceWithActiveDescriptor } from '../lib/eservice-utils'
import { useAsyncFetch } from '../hooks/useAsyncFetch'
import { NotFound } from './NotFound'
import { useTranslation } from 'react-i18next'
import { Box, Stack, Tab } from '@mui/material'
import { minutesToSeconds } from '../lib/format-utils'
import { AxiosResponse } from 'axios'
import { StyledButton } from '../components/Shared/StyledButton'
import { MAX_WIDTH } from '../lib/constants'
import { PageBottomActions } from '../components/Shared/PageBottomActions'
import { useRoute } from '../hooks/useRoute'
import { buildDynamicPath } from '../lib/router-utils'
import { ActionMenu } from '../components/Shared/ActionMenu'
import { EServiceContentInfo } from '../components/Shared/EServiceContentInfo'
import { LoadingWithMessage } from '../components/Shared/LoadingWithMessage'
import { useActiveTab } from '../hooks/useActiveTab'
import { TabContext, TabList, TabPanel } from '@mui/lab'
import { AsyncTablePurposeInEService } from '../components/Shared/AsyncTablePurpose'

export function EServiceManage() {
  const { eserviceId, descriptorId } = useParams<{
    eserviceId: string | undefined
    descriptorId: string | undefined
  }>()
  const { t } = useTranslation('eservice')
  const history = useHistory()
  const { routes } = useRoute()
  const { runAction, forceRerenderCounter } = useFeedback()
  const { activeTab, updateActiveTab } = useActiveTab('details')

  const {
    data: eserviceData,
    isLoading,
    error,
  } = useAsyncFetch<EServiceReadType>(
    { path: { endpoint: 'ESERVICE_GET_SINGLE', endpointParams: { eserviceId } } },
    {
      mapFn: decorateEServiceWithActiveDescriptor(descriptorId),
      useEffectDeps: [eserviceId, descriptorId, forceRerenderCounter],
      disabled: !eserviceId || !descriptorId,
    }
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
            voucherLifespan: minutesToSeconds(1),
            audience: [],
            description: '',
            dailyCallsPerConsumer: 1,
            dailyCallsTotal: 1,
            agreementApprovalPolicy: 'MANUAL',
          },
        },
      },
      { showConfirmDialog: true }
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
  const getAvailableActions = () => {
    if (!eserviceData?.activeDescriptor || !eserviceId || !descriptorId) return []

    const { state } = eserviceData.activeDescriptor

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

  const handleGoBackToEServices = () => {
    history.push(routes.PROVIDE.PATH)
  }

  if (error) {
    return <NotFound errorType="serverError" />
  }

  const availableActions = getAvailableActions()
  let primaryAction: ActionProps | undefined

  if (availableActions.length > 0) {
    primaryAction = availableActions.shift()
  }

  return (
    <Box sx={{ maxWidth: MAX_WIDTH }}>
      <Stack direction="row" spacing={2}>
        <StyledIntro sx={{ flex: 1 }} isLoading={isLoading}>
          {{ title: eserviceData?.name, description: eserviceData?.description }}
        </StyledIntro>
        <Stack direction="row" alignItems="center" spacing={2}>
          {primaryAction && (
            <StyledButton variant="outlined" onClick={primaryAction.onClick}>
              {primaryAction.label}
            </StyledButton>
          )}
          {availableActions.length > 0 && <ActionMenu actions={availableActions} />}
        </Stack>
      </Stack>

      {!isLoading && eserviceData && descriptorId ? (
        <>
          <TabContext value={activeTab}>
            <TabList
              onChange={updateActiveTab}
              aria-label={t('manage.tabs.ariaLabel')}
              variant="fullWidth"
            >
              <Tab label={t('manage.tabs.details')} value="details" />
              <Tab
                label={t('manage.tabs.purposeAwaitingApproval')}
                value="purposeAwaitingApproval"
              />
            </TabList>

            <TabPanel value="details" sx={{ p: 0 }}>
              <EServiceContentInfo
                data={eserviceData}
                descriptorId={descriptorId}
                context="provider"
              />
            </TabPanel>
            <TabPanel value="purposeAwaitingApproval" sx={{ px: 0 }}>
              <AsyncTablePurposeInEService
                forceRerenderCounter={forceRerenderCounter}
                runAction={runAction}
                eserviceId={eserviceId}
              />
            </TabPanel>
          </TabContext>
        </>
      ) : (
        <LoadingWithMessage label={t('loadingSingleLabel')} transparentBackground />
      )}

      <Box sx={{ mt: 4 }}>
        <PageBottomActions>
          <StyledButton onClick={handleGoBackToEServices} variant="outlined">
            {t('backToListBtn')}
          </StyledButton>
        </PageBottomActions>
      </Box>
    </Box>
  )
}
