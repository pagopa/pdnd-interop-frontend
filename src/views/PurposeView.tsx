import React, { useContext } from 'react'
import { object, number } from 'yup'
import { Tab, Typography } from '@mui/material'
import { TabList, TabContext, TabPanel } from '@mui/lab'
import { useLocation } from 'react-router-dom'
import { buildDynamicPath } from '../lib/router-utils'
import { useAsyncFetch } from '../hooks/useAsyncFetch'
import {
  ActionProps,
  Client,
  DecoratedPurpose,
  DialogUpdatePurposeDailyCallsFormInputValues,
  Purpose,
  PurposeState,
  PurposeVersion,
} from '../../types'
import { DescriptionBlock } from '../components/DescriptionBlock'
import {
  decoratePurposeWithMostRecentVersion,
  getComputedPurposeState,
  getPurposeFromUrl,
} from '../lib/purpose'
import { formatThousands } from '../lib/format-utils'
import { StyledLink } from '../components/Shared/StyledLink'
import { StyledButton } from '../components/Shared/StyledButton'
import { useFeedback } from '../hooks/useFeedback'
import { downloadFile } from '../lib/file-utils'
import { AxiosResponse } from 'axios'
import { formatDateString } from '../lib/format-utils'
import { StyledIntro } from '../components/Shared/StyledIntro'
import { DialogContext } from '../lib/context'
import { ResourceList } from '../components/Shared/ResourceList'
import { useActiveTab } from '../hooks/useActiveTab'
import { useRoute } from '../hooks/useRoute'
import { RunActionOutput } from '../hooks/useFeedback'
import { PageBottomActions } from '../components/Shared/PageBottomActions'
import { PageTopFilters } from '../components/Shared/PageTopFilters'
import { AsyncTableClientInPurpose } from '../components/Shared/AsyncTableClient'
import { LoadingWithMessage } from '../components/Shared/LoadingWithMessage'
import { useTranslation } from 'react-i18next'

// TEMP REFACTOR: this view will need a loooot of refactor after the BFF is implemented
// and the fetches for clients and purpose become separated

export const PurposeView = () => {
  const { t } = useTranslation(['purpose', 'common'])
  const location = useLocation()
  const { runAction, forceRerenderCounter } = useFeedback()
  const { setDialog } = useContext(DialogContext)
  const { routes } = useRoute()
  const { activeTab, updateActiveTab } = useActiveTab('details')
  const purposeId = getPurposeFromUrl(location)
  const { data, isLoading /*, error */ } = useAsyncFetch<Purpose, DecoratedPurpose>(
    { path: { endpoint: 'PURPOSE_GET_SINGLE', endpointParams: { purposeId } } },
    { mapFn: decoratePurposeWithMostRecentVersion, useEffectDeps: [forceRerenderCounter] }
  )

  const downloadDocument = async () => {
    const mostRecentVersion = data?.mostRecentVersion as PurposeVersion

    const { response, outcome } = (await runAction(
      {
        path: {
          endpoint: 'PURPOSE_VERSION_RISK_ANALYSIS_DOWNLOAD',
          endpointParams: {
            purposeId,
            versionId: mostRecentVersion.id,
            documentId: mostRecentVersion.riskAnalysis.id,
          },
        },
      },
      { suppressToast: ['success'] }
    )) as RunActionOutput

    if (outcome === 'success') {
      downloadFile((response as AxiosResponse).data, 'document')
    }
  }

  /*
   * List of possible actions to perform in the purpose tab
   */
  const activate = async () => {
    const currentVersion = data?.currentVersion as PurposeVersion
    await runAction(
      {
        path: {
          endpoint: 'PURPOSE_VERSION_ACTIVATE',
          endpointParams: { purposeId: data?.id, versionId: currentVersion.id },
        },
      },
      { showConfirmDialog: true }
    )
  }

  const suspend = async () => {
    const currentVersion = data?.currentVersion as PurposeVersion
    await runAction(
      {
        path: {
          endpoint: 'PURPOSE_VERSION_SUSPEND',
          endpointParams: { purposeId: data?.id, versionId: currentVersion.id },
        },
      },
      { showConfirmDialog: true }
    )
  }

  const archive = async () => {
    const currentVersion = data?.currentVersion as PurposeVersion
    await runAction(
      {
        path: {
          endpoint: 'PURPOSE_VERSION_ARCHIVE',
          endpointParams: { purposeId: data?.id, versionId: currentVersion.id },
        },
      },
      { showConfirmDialog: true }
    )
  }

  const deletePurpose = async () => {
    await runAction(
      {
        path: { endpoint: 'PURPOSE_DRAFT_DELETE', endpointParams: { purposeId: data?.id } },
      },
      { showConfirmDialog: true, onSuccessDestination: routes.SUBSCRIBE_PURPOSE_LIST }
    )
  }

  const deleteVersionPurpose = async () => {
    const mostRecentVersion = data?.mostRecentVersion as PurposeVersion
    await runAction(
      {
        path: {
          endpoint: 'PURPOSE_VERSION_DELETE',
          endpointParams: { purposeId: data?.id, versionId: mostRecentVersion.id },
        },
      },
      { showConfirmDialog: true }
    )
  }
  /*
   * End list of actions
   */

  // Build list of available actions for this purpose
  const getPurposeAvailableActions = () => {
    if (!data) {
      return []
    }

    const archiveAction = { onClick: archive, label: t('actions.archive', { ns: 'common' }) }
    const suspendAction = { onClick: suspend, label: t('actions.suspend', { ns: 'common' }) }
    const activateAction = { onClick: activate, label: t('actions.activate', { ns: 'common' }) }
    const deleteAction = { onClick: deletePurpose, label: t('actions.delete', { ns: 'common' }) }
    const deleteVersionAction = {
      onClick: deleteVersionPurpose,
      label: t('view.actions.deleteDailyCallsUpdate'),
    }

    const updateDailyCallsAction = {
      onClick: updateDailyCalls,
      label: t('view.actions.updateDailyCalls'),
    }

    const availableActions: Record<PurposeState, Array<ActionProps>> = {
      DRAFT: [], // If in draft, it will go to the PurposeCreate component
      ACTIVE: [suspendAction, updateDailyCallsAction],
      SUSPENDED: [activateAction, archiveAction],
      WAITING_FOR_APPROVAL: [data?.versions.length > 1 ? deleteVersionAction : deleteAction],
      ARCHIVED: [],
    }

    const mostRecentVersion = data.mostRecentVersion as PurposeVersion
    const status = mostRecentVersion.state

    // Return all the actions available for this particular status
    return availableActions[status] || []
  }

  const updateDailyCalls = () => {
    setDialog({
      type: 'updatePurposeDailyCalls',
      initialValues: { dailyCalls: 1 },
      validationSchema: object({ dailyCalls: number().required() }),
      onSubmit: async ({ dailyCalls }: DialogUpdatePurposeDailyCallsFormInputValues) => {
        const { outcome, response } = (await runAction(
          {
            path: {
              endpoint: 'PURPOSE_VERSION_DRAFT_CREATE',
              endpointParams: { purposeId: data?.id },
            },
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

  const addClients = async (newClientsData: Array<Client>) => {
    const alreadyPostedClients = (data?.clients || []).map((c) => c.id)
    const newClients = newClientsData.filter((c) => !alreadyPostedClients.includes(c.id))

    // TEMP REFACTOR: improve this with error messages, failure handling, etc
    await Promise.all(
      newClients.map(async ({ id: clientId }) => {
        return await runAction({
          path: { endpoint: 'CLIENT_JOIN_WITH_PURPOSE', endpointParams: { clientId } },
          config: { data: { purposeId } },
        })
      })
    )
  }

  const showClientsDialog = () => {
    setDialog({ type: 'addClients', exclude: data?.clients || [], onSubmit: addClients })
  }

  return (
    <React.Fragment>
      <StyledIntro isLoading={isLoading}>
        {{ title: data?.title, description: data?.description }}
      </StyledIntro>

      <TabContext value={activeTab}>
        <TabList
          onChange={updateActiveTab}
          aria-label={t('view.tabs.ariaLabel')}
          variant="fullWidth"
        >
          <Tab label={t('view.tabs.details')} value="details" />
          <Tab label={t('view.tabs.clients')} value="clients" />
        </TabList>

        <TabPanel value="details">
          {data && data.currentVersion && data.mostRecentVersion ? (
            <React.Fragment>
              <DescriptionBlock label={t('view.accessGrantedField.label')}>
                <Typography component="span">{getComputedPurposeState(data)}</Typography>
              </DescriptionBlock>

              <DescriptionBlock label={t('view.dailyCallsEstimateField.label')}>
                <Typography component="span">
                  {formatThousands(data.currentVersion.dailyCalls)}{' '}
                  {t('view.dailyCallsEstimateField.unitLabel')}
                </Typography>
              </DescriptionBlock>

              {data.awaitingApproval && (
                <DescriptionBlock label={t('view.upgradeRequestField.label')}>
                  <Typography component="span">
                    {t('view.upgradeRequestField.nextLabel')}:{' '}
                    {formatThousands(data.mostRecentVersion.dailyCalls)}{' '}
                    {t('view.upgradeRequestField.unitLabel')}
                  </Typography>
                  <br />
                  <Typography component="span">
                    {data.mostRecentVersion.expectedApprovalDate
                      ? `${t('view.upgradeRequestField.estimatedDateLabel')}: ${formatDateString(
                          data.mostRecentVersion.expectedApprovalDate
                        )}`
                      : t('view.upgradeRequestField.noEstimateLabel')}
                  </Typography>
                </DescriptionBlock>
              )}

              <DescriptionBlock label={t('view.currentEServiceVersionField.label')}>
                <StyledLink
                  to={buildDynamicPath(routes.SUBSCRIBE_CATALOG_VIEW.PATH, {
                    eserviceId: data.eservice.id,
                    descriptorId: data.eservice.descriptor.id,
                  })}
                >
                  {data.eservice.name}, {t('view.currentEServiceVersionField.versionLabel')}{' '}
                  {data.eservice.descriptor.version}
                </StyledLink>
              </DescriptionBlock>

              <DescriptionBlock label={t('view.agreementField.label')}>
                <StyledLink
                  to={buildDynamicPath(routes.SUBSCRIBE_AGREEMENT_READ.PATH, {
                    agreementId: data.agreement.id,
                  })}
                >
                  {t('view.agreementField.link.label')}
                </StyledLink>
              </DescriptionBlock>

              <DescriptionBlock label={t('view.purposeStatusField.label')}>
                <Typography component="span">
                  {t(`status.purpose.${data.currentVersion.state}`, { ns: 'common' })}
                </Typography>
              </DescriptionBlock>

              <DescriptionBlock label="Risorse">
                <ResourceList
                  resources={[
                    {
                      label: 'Analisi del rischio',
                      onClick: downloadDocument,
                    },
                  ]}
                />
              </DescriptionBlock>

              {data.versions.length > 1 && (
                <DescriptionBlock label={t('view.versionHistoryField.label')}>
                  {data.versions.map((v, i) => {
                    const date = v.firstActivationAt || v.expectedApprovalDate
                    return (
                      <Typography component="span" key={i} sx={{ display: 'inline-block' }}>
                        {formatThousands(v.dailyCalls)} {t('view.versionHistoryField.unitLabel')};
                        {t('view.versionHistoryField.approvalDateLabel')}:{' '}
                        {date ? formatDateString(date) : 'n/d'}
                      </Typography>
                    )
                  })}
                </DescriptionBlock>
              )}

              <PageBottomActions>
                {getPurposeAvailableActions().map(({ onClick, label }, i) => (
                  <StyledButton
                    variant={i === 0 ? 'contained' : 'outlined'}
                    key={i}
                    onClick={onClick}
                  >
                    {label}
                  </StyledButton>
                ))}

                <StyledButton variant="outlined" to={routes.SUBSCRIBE_PURPOSE_LIST.PATH}>
                  {t('view.actions.backToList')}
                </StyledButton>
              </PageBottomActions>
            </React.Fragment>
          ) : (
            <LoadingWithMessage label={t('loadingSingleLabel')} transparentBackground />
          )}
        </TabPanel>

        <TabPanel value="clients">
          <PageTopFilters>
            <StyledButton variant="contained" size="small" onClick={showClientsDialog}>
              {t('addBtn', { ns: 'common' })}
            </StyledButton>
          </PageTopFilters>

          <AsyncTableClientInPurpose runAction={runAction} purposeId={purposeId} data={data} />
        </TabPanel>
      </TabContext>
    </React.Fragment>
  )
}
