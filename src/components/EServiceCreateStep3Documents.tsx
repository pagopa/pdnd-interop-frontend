import React from 'react'
import { useHistory } from 'react-router'
import {
  EServiceDescriptorRead,
  EServiceDocumentRead,
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
import { Box } from '@mui/material'
import { useEserviceCreateFetch } from '../hooks/useEserviceCreateFetch'
import { useRoute } from '../hooks/useRoute'
import { LoadingWithMessage } from './Shared/LoadingWithMessage'
import { useTranslation } from 'react-i18next'
import { StyledPaper } from './StyledPaper'
import { downloadFile } from '../lib/file-utils'
import { AxiosResponse } from 'axios'
import { getDownloadDocumentName } from '../lib/eservice-utils'
import PageBottomActionsCard from './Shared/PageBottomActionsCard'

export function EServiceCreateStep3Documents({ back }: StepperStepComponentProps) {
  const { routes } = useRoute()
  const history = useHistory()
  const { runAction } = useFeedback()
  const { data: fetchedData, descriptorId, isLoading } = useEserviceCreateFetch()
  const sureFetchedData = fetchedData as EServiceReadType
  const activeDescriptorId = descriptorId as string
  const { t } = useTranslation(['eservice', 'toast'])

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

  const downloadDescriptorDocument = async (document: EServiceDocumentRead) => {
    const activeDescriptor = sureFetchedData.activeDescriptor as EServiceDescriptorRead
    const { response, outcome } = (await runAction(
      {
        path: {
          endpoint: 'ESERVICE_VERSION_DOWNLOAD_DOCUMENT',
          endpointParams: {
            eserviceId: sureFetchedData.id,
            descriptorId: activeDescriptor.id,
            documentId: document.id,
          },
        },
        config: { responseType: 'arraybuffer' },
      },
      { suppressToast: ['success'] }
    )) as RunActionOutput

    if (outcome === 'success') {
      const filename = getDownloadDocumentName(document)
      downloadFile((response as AxiosResponse).data, filename)
    }
  }

  const updateDescriptorDocumentDescription = async (
    documentId: string,
    newDescription: string
  ) => {
    const activeDescriptor = sureFetchedData.activeDescriptor as EServiceDescriptorRead
    const { outcome } = (await runAction(
      {
        path: {
          endpoint: 'ESERVICE_VERSION_DRAFT_UPDATE_DOCUMENT_DESCRIPTION',
          endpointParams: {
            eserviceId: sureFetchedData.id,
            descriptorId: activeDescriptor.id,
            documentId: documentId,
          },
        },
        config: { data: { prettyName: newDescription } },
      },
      { suppressToast: ['success'] }
    )) as RunActionOutput

    return outcome
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
      { suppressToast: ['success'] }
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
        suppressToast: ['success'],
      }
    )) as RunActionOutput

    return { outcome, response }
  }

  return (
    <React.Fragment>
      {!isLoading ? (
        <React.Fragment>
          <StyledPaper>
            <StyledIntro component="h2">
              {{
                title: t('create.step3.interface.title'),
                description: `${t('create.step3.interface.description.before')} ${
                  fetchedData?.technology === 'REST' ? 'OpenAPI' : 'WSDL'
                }  ${t('create.step3.interface.description.after')}`,
              }}
            </StyledIntro>

            {fetchedData && (
              <Box sx={{ my: 3 }}>
                <EServiceCreateStep3DocumentsInterface
                  data={fetchedData}
                  uploadDescriptorDocument={uploadDescriptorDocument}
                  deleteDescriptorDocument={deleteDescriptorDocument}
                  updateDescriptorDocumentDescription={updateDescriptorDocumentDescription}
                  downloadDescriptorDocument={downloadDescriptorDocument}
                  activeDescriptorId={activeDescriptorId}
                />
              </Box>
            )}

            <StyledIntro component="h2" sx={{ mt: 8, mb: 2 }}>
              {{
                title: t('create.step3.documentation.title'),
                description: t('create.step3.documentation.description'),
              }}
            </StyledIntro>

            {fetchedData && (
              <EServiceCreateStep3DocumentsDoc
                data={fetchedData}
                uploadDescriptorDocument={uploadDescriptorDocument}
                deleteDescriptorDocument={deleteDescriptorDocument}
                updateDescriptorDocumentDescription={updateDescriptorDocumentDescription}
                downloadDescriptorDocument={downloadDescriptorDocument}
                activeDescriptorId={activeDescriptorId}
              />
            )}
          </StyledPaper>

          <StepActions
            back={{ label: t('create.backWithoutSaveBtn'), type: 'button', onClick: back }}
            forward={{
              label: t('create.endWithSaveBtn'),
              type: 'button',
              onClick: () => {
                const successMessage = t('ESERVICE_VERSION_DRAFT_UPDATE.success.message', {
                  ns: 'toast',
                })
                history.push(routes.PROVIDE_ESERVICE_LIST.PATH, {
                  toast: {
                    outcome: 'success',
                    message: successMessage,
                  },
                })
              },
            }}
          />
        </React.Fragment>
      ) : (
        <LoadingWithMessage label={t('loadingSingleLabel')} transparentBackground />
      )}

      <PageBottomActionsCard
        title={t('create.quickPublish.title')}
        description={t('create.quickPublish.description')}
        isLoading={isLoading}
        loadingMessage={t('loadingSingleLabel')}
      >
        <StyledButton variant="outlined" onClick={deleteVersion}>
          {t('create.quickPublish.deleteBtn')}
        </StyledButton>
        <StyledButton variant="contained" onClick={publishVersion}>
          {t('create.quickPublish.publishBtn')}
        </StyledButton>
      </PageBottomActionsCard>
    </React.Fragment>
  )
}
