import React from 'react'
import { useHistory } from 'react-router'
import { Box } from '@mui/system'
import {
  EServiceDescriptorRead,
  EServiceDocumentWrite,
  EServiceReadType,
  StepperStepComponentProps,
} from '../../types'
import { RunActionOutput, useFeedback } from '../hooks/useFeedback'
import { StyledIntro } from './Shared/StyledIntro'
import { StyledButton } from './Shared/StyledButton'
import { EServiceCreateStep3DocumentsInterface } from './EServiceCreateStep3DocumentsInterface'
import { EServiceCreateStep3DocumentsDoc } from './EServiceCreateStep3DocumentsDoc'
import { StepActions } from './Shared/StepActions'
import { Divider, Paper } from '@mui/material'
import { TOAST_CONTENTS } from '../config/toast'
import { useEserviceCreateFetch } from '../hooks/useEserviceCreateFetch'
import { useRoute } from '../hooks/useRoute'
import { LoadingWithMessage } from './Shared/LoadingWithMessage'
import { useTranslation } from 'react-i18next'

export function EServiceCreateStep3Documents({ back }: StepperStepComponentProps) {
  const { routes } = useRoute()
  const history = useHistory()
  const { runAction } = useFeedback()
  const { data: fetchedData, descriptorId, isLoading } = useEserviceCreateFetch()
  const sureFetchedData = fetchedData as EServiceReadType
  const activeDescriptorId = descriptorId as string
  const { t } = useTranslation('eservice')

  const publishVersion = async () => {
    const activeDescriptor = sureFetchedData.activeDescriptor as EServiceDescriptorRead
    await runAction(
      {
        path: {
          endpoint: 'ESERVICE_VERSION_DRAFT_PUBLISH',
          endpointParams: {
            eserviceId: sureFetchedData.id,
            descriptorId: activeDescriptor.id,
          },
        },
      },
      { onSuccessDestination: routes.PROVIDE_ESERVICE_LIST, showConfirmDialog: true }
    )
  }

  const deleteVersion = async () => {
    const activeDescriptor = sureFetchedData.activeDescriptor as EServiceDescriptorRead
    await runAction(
      {
        path: {
          endpoint: 'ESERVICE_VERSION_DRAFT_DELETE',
          endpointParams: {
            eserviceId: sureFetchedData.id,
            descriptorId: activeDescriptor.id,
          },
        },
      },
      { onSuccessDestination: routes.PROVIDE_ESERVICE_LIST, showConfirmDialog: true }
    )
  }

  const deleteDescriptorDocument = async (documentId: string) => {
    const activeDescriptor = sureFetchedData.activeDescriptor as EServiceDescriptorRead
    const { outcome, response } = (await runAction(
      {
        path: {
          endpoint: 'ESERVICE_VERSION_DRAFT_DELETE_DOCUMENT',
          endpointParams: {
            eserviceId: sureFetchedData.id,
            descriptorId: activeDescriptor.id,
            documentId,
          },
        },
      },
      { suppressToast: ['success', 'error'] }
    )) as RunActionOutput

    return { outcome, response }
  }

  const uploadDescriptorDocument = async ({ prettyName, doc, kind }: EServiceDocumentWrite) => {
    const formData = new FormData()
    formData.append('kind', kind)
    formData.append('prettyName', prettyName || '')
    formData.append('doc', doc)

    const activeDescriptor = sureFetchedData.activeDescriptor as EServiceDescriptorRead
    const { outcome, response } = (await runAction(
      {
        path: {
          endpoint: 'ESERVICE_VERSION_DRAFT_POST_DOCUMENT',
          endpointParams: {
            eserviceId: sureFetchedData.id,
            descriptorId: activeDescriptor.id,
          },
        },
        config: {
          headers: { 'Content-Type': 'multipart/form-data' },
          data: formData,
        },
      },
      {
        suppressToast: ['success', 'error'],
      }
    )) as RunActionOutput

    return { outcome, response }
  }

  return (
    <React.Fragment>
      <Paper sx={{ bgcolor: 'background.paper', p: 3, mt: 2 }}>
        {!isLoading ? (
          <React.Fragment>
            <StyledIntro component="h2">
              {{
                title: t('step3.interface.title'),
                description: `${t('step3.interface.description.before')} ${
                  fetchedData?.technology === 'REST' ? 'OpenAPI' : 'WSDL'
                }  ${t('step3.interface.description.after')}`,
              }}
            </StyledIntro>

            {fetchedData && (
              <Box sx={{ my: 3 }}>
                <EServiceCreateStep3DocumentsInterface
                  data={fetchedData}
                  uploadDescriptorDocument={uploadDescriptorDocument}
                  deleteDescriptorDocument={deleteDescriptorDocument}
                  activeDescriptorId={activeDescriptorId}
                />
              </Box>
            )}

            <Divider />

            <StyledIntro component="h2" sx={{ mt: 8, mb: 2 }}>
              {{
                title: t('step3.documentation.title'),
                description: t('step3.documentation.description'),
              }}
            </StyledIntro>

            {fetchedData && (
              <EServiceCreateStep3DocumentsDoc
                data={fetchedData}
                uploadDescriptorDocument={uploadDescriptorDocument}
                deleteDescriptorDocument={deleteDescriptorDocument}
                activeDescriptorId={activeDescriptorId}
              />
            )}

            <StepActions
              back={{ label: t('backWithoutSaveBtn'), type: 'button', onClick: back }}
              forward={{
                label: t('endWithSaveBtn'),
                type: 'button',
                onClick: () => {
                  history.push(routes.PROVIDE_ESERVICE_LIST.PATH, {
                    toast: {
                      outcome: 'success',
                      ...TOAST_CONTENTS.ESERVICE_VERSION_DRAFT_UPDATE.success,
                    },
                  })
                },
              }}
            />
          </React.Fragment>
        ) : (
          <LoadingWithMessage label={t('loadingLabel')} transparentBackground />
        )}
      </Paper>

      <Paper sx={{ p: 3, mt: 2 }}>
        <StyledIntro component="h2">
          {{
            title: t('quickPublish.title'),
            description: t('quickPublish.description'),
          }}
        </StyledIntro>
        {!isLoading ? (
          <Box sx={{ display: 'flex', mt: 3 }}>
            <StyledButton sx={{ mr: 2 }} variant="contained" onClick={publishVersion}>
              {t('quickPublish.publishBtn')}
            </StyledButton>
            <StyledButton variant="outlined" onClick={deleteVersion}>
              {t('quickPublish.deleteBtn')}
            </StyledButton>
          </Box>
        ) : (
          <LoadingWithMessage label={t('loadingLabel')} transparentBackground />
        )}
      </Paper>
    </React.Fragment>
  )
}
