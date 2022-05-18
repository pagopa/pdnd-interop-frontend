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
// import { downloadFile } from '../lib/file-utils'
import { AxiosResponse } from 'axios'
import { formatDateString } from '../lib/format-utils'
import { StyledIntro } from '../components/Shared/StyledIntro'
import { DialogContext } from '../lib/context'
// import { ResourceList } from '../components/Shared/ResourceList'
import { useActiveTab } from '../hooks/useActiveTab'
import { useRoute } from '../hooks/useRoute'
import { RunActionOutput } from '../hooks/useFeedback'
import { PageBottomActions } from '../components/Shared/PageBottomActions'
import { PageTopFilters } from '../components/Shared/PageTopFilters'
import { AsyncTableClientInPurpose } from '../components/Shared/AsyncTableClient'
import { LoadingWithMessage } from '../components/Shared/LoadingWithMessage'
// import { axiosErrorToError } from '../lib/error-utils'
import { useTranslation } from 'react-i18next'

// TEMP REFACTOR: this view will need a loooot of refactor after the BFF is implemented
// and the fetches for clients and purpose become separated

export const PurposeView = () => {
  const { t } = useTranslation('common')
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

  // const downloadDocument = async () => {
  //   const { response, outcome } = await runAction(
  //     {
  //       path: {
  //         endpoint: 'PURPOSE_VERSION_RISK_ANALYSIS_DOWNLOAD',
  //         endpointParams: {
  //           purposeId,
  //           versionId: data?.currentVersion.id,
  //           documentId: data?.currentVersion.riskAnalysisDocument.id,
  //         },
  //       },
  //     },
  //     { suppressToast: true }
  //   )

  //   if (outcome === 'success') {
  //     downloadFile((response as AxiosResponse).data, 'document')
  //   }
  // }

  /*
   * List of possible actions to perform in the purpose tab
   */
  const activate = async () => {
    await runAction(
      {
        path: {
          endpoint: 'PURPOSE_VERSION_ACTIVATE',
          endpointParams: { purposeId: data?.id, versionId: data?.currentVersion.id },
        },
      },
      { showConfirmDialog: true }
    )
  }

  const suspend = async () => {
    await runAction(
      {
        path: {
          endpoint: 'PURPOSE_VERSION_SUSPEND',
          endpointParams: { purposeId: data?.id, versionId: data?.currentVersion.id },
        },
      },
      { showConfirmDialog: true }
    )
  }

  const archive = async () => {
    await runAction(
      {
        path: {
          endpoint: 'PURPOSE_VERSION_ARCHIVE',
          endpointParams: { purposeId: data?.id, versionId: data?.currentVersion.id },
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
      { showConfirmDialog: true }
    )
  }

  const deleteVersionPurpose = async () => {
    await runAction(
      {
        path: {
          endpoint: 'PURPOSE_VERSION_DELETE',
          endpointParams: { purposeId: data?.id, versionId: data?.mostRecentVersion.id },
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

    const archiveAction = { onClick: archive, label: 'Archivia' }
    const suspendAction = { onClick: suspend, label: 'Sospendi' }
    const activateAction = { onClick: activate, label: 'Attiva' }
    const deleteAction = { onClick: deletePurpose, label: 'Elimina' }
    const deleteVersionAction = {
      onClick: deleteVersionPurpose,
      label: 'Elimina aggiornamento numero chiamate',
    }

    const updateDailyCallsAction = {
      onClick: updateDailyCalls,
      label: 'Aggiorna numero chiamate',
    }

    const availableActions: Record<PurposeState, Array<ActionProps>> = {
      DRAFT: [], // If in draft, it will go to the PurposeCreate component
      ACTIVE: [suspendAction, updateDailyCallsAction],
      SUSPENDED: [activateAction, archiveAction],
      WAITING_FOR_APPROVAL: [data?.versions.length > 1 ? deleteVersionAction : deleteAction],
      ARCHIVED: [],
    }

    const status = data.mostRecentVersion.state

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
          aria-label="Due tab diverse per i dettagli della finalità e i client associati"
          variant="fullWidth"
        >
          <Tab label="Dettagli finalità" value="details" />
          <Tab label="Client associati" value="clients" />
        </TabList>

        <TabPanel value="details">
          {data ? (
            <React.Fragment>
              <DescriptionBlock label="Accesso consentito?">
                <Typography component="span">{getComputedPurposeState(data)}</Typography>
              </DescriptionBlock>

              <DescriptionBlock label="Stima di carico corrente">
                <Typography component="span">
                  {formatThousands(data.currentVersion.dailyCalls)} chiamate/giorno
                </Typography>
              </DescriptionBlock>

              {data.awaitingApproval && (
                <DescriptionBlock label="Richiesta di aggiornamento">
                  <Typography component="span">
                    Stima di carico: {formatThousands(data.mostRecentVersion.dailyCalls)}{' '}
                    chiamate/giorno
                  </Typography>
                  <br />
                  <Typography component="span">
                    {data.mostRecentVersion.expectedApprovalDate
                      ? `Data di completamento stimata: ${formatDateString(
                          data.mostRecentVersion.expectedApprovalDate
                        )}`
                      : 'Non è stata determinata una data di completamento'}
                  </Typography>
                </DescriptionBlock>
              )}

              <DescriptionBlock label="La versione dell'E-Service che stai usando">
                <StyledLink
                  to={buildDynamicPath(routes.SUBSCRIBE_CATALOG_VIEW.PATH, {
                    eserviceId: data.eservice.id,
                    descriptorId: data.eservice.descriptor.id,
                  })}
                >
                  {data.eservice.name}, versione {data.eservice.descriptor.version}
                </StyledLink>
              </DescriptionBlock>

              <DescriptionBlock label="Richiesta di fruizione">
                <StyledLink
                  to={buildDynamicPath(routes.SUBSCRIBE_AGREEMENT_EDIT.PATH, {
                    agreementId: data.agreement.id,
                  })}
                >
                  Vedi richiesta
                </StyledLink>
              </DescriptionBlock>

              <DescriptionBlock label="Stato della finalità">
                <Typography component="span">
                  {t(`status.purpose.${data.currentVersion.state}`)}
                </Typography>
              </DescriptionBlock>

              {/* TEMP PIN-1139 and PIN-1178 */}
              {/* <DescriptionBlock label="Risorse">
            <ResourceList
            downloads={[
              {
                label: 'Analisi del rischio',
                onClick: downloadDocument,
              },
            ]}
            />
          </DescriptionBlock> */}

              {data.versions.length > 1 && (
                <DescriptionBlock label="Storico di questa finalità">
                  {data.versions.map((v, i) => {
                    const date = v.firstActivationAt || v.expectedApprovalDate
                    return (
                      <Typography component="span" key={i} sx={{ display: 'inline-block' }}>
                        {formatThousands(v.dailyCalls)} chiamate/giorno; data di approvazione:{' '}
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
                  Torna alla lista delle finalità
                </StyledButton>
              </PageBottomActions>
            </React.Fragment>
          ) : (
            <LoadingWithMessage
              label="Stiamo caricando la finalità richiesta"
              transparentBackground
            />
          )}
        </TabPanel>

        <TabPanel value="clients">
          <PageTopFilters>
            <StyledButton variant="contained" size="small" onClick={showClientsDialog}>
              + Aggiungi
            </StyledButton>
          </PageTopFilters>

          <AsyncTableClientInPurpose runAction={runAction} purposeId={purposeId} data={data} />
        </TabPanel>
      </TabContext>
    </React.Fragment>
  )
}
