import React from 'react'
import { Box } from '@mui/system'
import { EServiceDocumentWrite, StepperStepComponentProps } from '../../types'
import { EServiceWriteStepProps } from '../views/EServiceWrite'
import { EServiceWriteStep4DocumentsInterface } from './EServiceWriteStep4DocumentsInterface'
import { useLocation } from 'react-router'
import { getBits } from '../lib/url-utils'
import { EServiceWriteStep4DocumentsDoc } from './EServiceWriteStep4DocumentsDoc'
import { StyledIntro } from './Shared/StyledIntro'
import { useFeedback } from '../hooks/useFeedback'
import { StyledButton } from './Shared/StyledButton'
import { StyledLink } from './Shared/StyledLink'
import { ROUTES } from '../config/routes'

export function EServiceWriteStep4Documents({
  back,
  fetchedData,
}: StepperStepComponentProps & EServiceWriteStepProps) {
  const { runAction, runActionWithDestination, wrapActionInDialog } = useFeedback()
  const location = useLocation()
  const bits = getBits(location)
  const activeDescriptorId: string = bits.pop() as string

  const publishVersion = async (_: any) => {
    await runActionWithDestination(
      {
        path: {
          endpoint: 'ESERVICE_VERSION_PUBLISH',
          endpointParams: {
            eserviceId: fetchedData.id,
            descriptorId: fetchedData.activeDescriptor!.id,
          },
        },
      },
      { destination: ROUTES.PROVIDE.SUBROUTES!.ESERVICE.SUBROUTES!.LIST, suppressToast: false }
    )
  }

  const deleteVersion = async (_: any) => {
    await runActionWithDestination(
      {
        path: {
          endpoint: 'ESERVICE_VERSION_DELETE',
          endpointParams: {
            eserviceId: fetchedData.id,
            descriptorId: fetchedData.activeDescriptor!.id,
          },
        },
      },
      { destination: ROUTES.PROVIDE.SUBROUTES!.ESERVICE.SUBROUTES!.LIST, suppressToast: false }
    )
  }

  const deleteDescriptorDocument = async (documentId: string) => {
    const { outcome, response } = await runAction(
      {
        path: {
          endpoint: 'ESERVICE_VERSION_DELETE_DOCUMENT',
          endpointParams: {
            eserviceId: fetchedData.id,
            descriptorId: fetchedData.activeDescriptor!.id,
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
    formData.append('doc', doc!)

    const { outcome, response } = await runAction(
      {
        path: {
          endpoint: 'ESERVICE_VERSION_POST_DOCUMENT',
          endpointParams: {
            eserviceId: fetchedData.id,
            descriptorId: fetchedData.activeDescriptor!.id,
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
      <StyledIntro variant="h1">{{ title: 'Crea e-service: documentazione' }}</StyledIntro>

      <StyledIntro variant="h2" sx={{ mb: 0 }}>
        {{
          title: 'Interfaccia*',
          description: `Carica il file ${
            fetchedData.technology === 'REST' ? 'OpenAPI' : 'WSDL'
          }  che descrive l'API`,
        }}
      </StyledIntro>

      <EServiceWriteStep4DocumentsInterface
        data={fetchedData}
        uploadDescriptorDocument={uploadDescriptorDocument}
        deleteDescriptorDocument={deleteDescriptorDocument}
        activeDescriptorId={activeDescriptorId}
      />

      <StyledIntro variant="h2" sx={{ mt: 6, mb: 0 }}>
        {{
          title: 'Documentazione',
          description: 'Inserisci la documentazione tecnica utile all’utilizzo di questo e-service',
        }}
      </StyledIntro>

      <EServiceWriteStep4DocumentsDoc
        data={fetchedData}
        uploadDescriptorDocument={uploadDescriptorDocument}
        deleteDescriptorDocument={deleteDescriptorDocument}
        activeDescriptorId={activeDescriptorId}
      />

      <Box sx={{ mt: 8, display: 'flex' }}>
        <StyledButton
          sx={{ mr: 3 }}
          variant="contained"
          component={StyledLink}
          to={ROUTES.PROVIDE.SUBROUTES!.ESERVICE.SUBROUTES!.LIST.PATH}
        >
          Salva bozza e torna ai servizi
        </StyledButton>
        <StyledButton sx={{ mr: 3 }} variant="outlined" onClick={back}>
          Indietro
        </StyledButton>
      </Box>

      <StyledIntro variant="h2" sx={{ mt: 8, mb: 0 }}>
        {{ title: 'Pubblicazione della versione' }}
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
    </React.Fragment>
  )
}
