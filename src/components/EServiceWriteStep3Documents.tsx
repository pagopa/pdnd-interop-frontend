import React from 'react'
import { useLocation, useHistory } from 'react-router'
import { Box } from '@mui/system'
import {
  EServiceDescriptorRead,
  EServiceDocumentWrite,
  EServiceReadType,
  StepperStepComponentProps,
} from '../../types'
import { getBits } from '../lib/router-utils'
import { ROUTES } from '../config/routes'
import { useFeedback } from '../hooks/useFeedback'
import { StyledIntro } from './Shared/StyledIntro'
import { StyledButton } from './Shared/StyledButton'
import { EServiceWriteStep3DocumentsInterface } from './EServiceWriteStep3DocumentsInterface'
import { EServiceWriteStep3DocumentsDoc } from './EServiceWriteStep3DocumentsDoc'
import { EServiceWriteActions } from './Shared/EServiceWriteActions'
import { Paper } from '@mui/material'
import { TOAST_CONTENTS } from '../config/toast'
import { useEservice } from '../hooks/useEservice'

export function EServiceWriteStep3Documents({ back }: StepperStepComponentProps) {
  const history = useHistory()
  const { data } = useEservice()
  const { runAction, runActionWithDestination, wrapActionInDialog } = useFeedback()
  const location = useLocation()
  const bits = getBits(location)
  const activeDescriptorId: string = bits.pop() as string
  const fetchedData = data as EServiceReadType

  const publishVersion = async () => {
    const activeDescriptor = fetchedData.activeDescriptor as EServiceDescriptorRead
    await runActionWithDestination(
      {
        path: {
          endpoint: 'ESERVICE_VERSION_PUBLISH',
          endpointParams: {
            eserviceId: fetchedData.id,
            descriptorId: activeDescriptor.id,
          },
        },
      },
      { destination: ROUTES.PROVIDE_ESERVICE_LIST, suppressToast: false }
    )
  }

  const deleteVersion = async () => {
    const activeDescriptor = fetchedData.activeDescriptor as EServiceDescriptorRead
    await runActionWithDestination(
      {
        path: {
          endpoint: 'ESERVICE_VERSION_DELETE',
          endpointParams: {
            eserviceId: fetchedData.id,
            descriptorId: activeDescriptor.id,
          },
        },
      },
      { destination: ROUTES.PROVIDE_ESERVICE_LIST, suppressToast: false }
    )
  }

  const deleteDescriptorDocument = async (documentId: string) => {
    const activeDescriptor = fetchedData.activeDescriptor as EServiceDescriptorRead
    const { outcome, response } = await runAction(
      {
        path: {
          endpoint: 'ESERVICE_VERSION_DELETE_DOCUMENT',
          endpointParams: {
            eserviceId: fetchedData.id,
            descriptorId: activeDescriptor.id,
            documentId,
          },
        },
      },
      { suppressToast: true }
    )

    return { outcome, response }
  }

  const uploadDescriptorDocument = async ({ description, doc, kind }: EServiceDocumentWrite) => {
    const formData = new FormData()
    formData.append('kind', kind)
    formData.append('description', description || '')
    formData.append('doc', doc)

    const activeDescriptor = fetchedData.activeDescriptor as EServiceDescriptorRead
    const { outcome, response } = await runAction(
      {
        path: {
          endpoint: 'ESERVICE_VERSION_POST_DOCUMENT',
          endpointParams: {
            eserviceId: fetchedData.id,
            descriptorId: activeDescriptor.id,
          },
        },
        config: {
          headers: { 'Content-Type': 'multipart/form-data' },
          data: formData,
        },
      },
      {
        suppressToast: false,
      }
    )

    return { outcome, response }
  }

  return (
    <React.Fragment>
      <StyledIntro variant="h2" sx={{ mb: 0 }}>
        {{
          title: 'Interfaccia*',
          description: `Carica il file ${
            fetchedData?.technology === 'REST' ? 'OpenAPI' : 'WSDL'
          }  che descrive l'API`,
        }}
      </StyledIntro>

      {fetchedData && (
        <EServiceWriteStep3DocumentsInterface
          data={fetchedData}
          uploadDescriptorDocument={uploadDescriptorDocument}
          deleteDescriptorDocument={deleteDescriptorDocument}
          activeDescriptorId={activeDescriptorId}
          interfaceAcceptedMimeTypes={
            fetchedData.technology === 'REST'
              ? { mime: ['application/x-yaml'], format: 'yaml (MIME type: application/x-yaml)' }
              : {
                  mime: ['application/xml', 'text/xml'],
                  format: 'xml (MIME type: application/xml o text/xml)',
                }
          }
        />
      )}

      <StyledIntro variant="h2" sx={{ mt: 8, mb: 2, pt: 4, borderTop: 1, borderColor: 'divider' }}>
        {{
          title: 'Documentazione',
          description: 'Inserisci la documentazione tecnica utile all’utilizzo di questo e-service',
        }}
      </StyledIntro>

      {fetchedData && (
        <EServiceWriteStep3DocumentsDoc
          data={fetchedData}
          uploadDescriptorDocument={uploadDescriptorDocument}
          deleteDescriptorDocument={deleteDescriptorDocument}
          activeDescriptorId={activeDescriptorId}
        />
      )}

      <EServiceWriteActions
        back={{ label: 'Indietro', onClick: back }}
        forward={{
          label: 'Salva bozza',
          onClick: () => {
            history.push(ROUTES.PROVIDE_ESERVICE_LIST.PATH, {
              toast: { outcome: 'success', ...TOAST_CONTENTS.ESERVICE_VERSION_UPDATE.success },
            })
          },
        }}
      />

      <Paper sx={{ px: 3, py: 4, mt: 8 }}>
        <StyledIntro variant="h2" sx={{ my: 0, pt: 0 }}>
          {{
            title: 'Azioni rapide di pubblicazione',
            description:
              'Hai inserito tutte le informazioni per questo e-service? Da qui puoi pubblicare immediatamente una bozza, oppure cancellarla. Se desideri pubblicare più tardi, salva solo la bozza sopra o abbandona questa pagina',
          }}
        </StyledIntro>
        <Box sx={{ display: 'flex' }}>
          <StyledButton
            sx={{ mr: 3 }}
            variant="contained"
            onClick={wrapActionInDialog(publishVersion, 'ESERVICE_VERSION_PUBLISH')}
          >
            Pubblica bozza
          </StyledButton>
          <StyledButton
            variant="outlined"
            onClick={wrapActionInDialog(deleteVersion, 'ESERVICE_VERSION_DELETE')}
          >
            Cancella bozza
          </StyledButton>
        </Box>
      </Paper>
    </React.Fragment>
  )
}
