import React from 'react'
import { Button } from 'react-bootstrap'
import { EServiceDocumentKind, StepperStepComponentProps } from '../../types'
import { EServiceWriteStepProps } from '../views/EServiceWrite'
import { WhiteBackground } from './WhiteBackground'
import { EServiceWriteStep4DocumentsInterface } from './EServiceWriteStep4DocumentsInterface'
import { UserFeedbackHOCProps, withUserFeedback } from './withUserFeedback'
import { ROUTES } from '../lib/constants'
import { Link } from 'react-router-dom'
import { useLocation } from 'react-router'
import { getBits } from '../lib/url-utils'
import { EServiceWriteStep4DocumentsDoc } from './EServiceWriteStep4DocumentsDoc'
import { StyledIntro } from './StyledIntro'

function EServiceWriteStep4DocumentsComponent({
  back,
  fetchedData,
  runAction,
  runActionWithDestination,
}: StepperStepComponentProps & EServiceWriteStepProps & UserFeedbackHOCProps) {
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
        config: { method: 'POST' },
      },
      { destination: ROUTES.PROVIDE.SUBROUTES!.ESERVICE_LIST, suppressToast: false }
    )
  }

  const deleteVersion = () => {}

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
        config: { method: 'DELETE' },
      },
      { suppressToast: true }
    )

    return { outcome, response }
  }

  const uploadDescriptorDocument = async (
    { description, doc }: any,
    kind: EServiceDocumentKind
  ) => {
    const formData = new FormData()
    formData.append('kind', kind)
    formData.append('description', description)
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
          method: 'POST',
          headers: { 'Content-Type': 'multipart/form-data' },
          data: formData,
        },
      },
      {
        suppressToast: true,
      }
    )

    return { outcome, response }
  }

  return (
    <React.Fragment>
      <WhiteBackground>
        <StyledIntro priority={2}>{{ title: 'Crea e-service: documentazione' }}</StyledIntro>
      </WhiteBackground>

      <EServiceWriteStep4DocumentsInterface
        fetchedData={fetchedData}
        uploadDescriptorDocument={uploadDescriptorDocument}
        deleteDescriptorDocument={deleteDescriptorDocument}
        runAction={runAction}
        activeDescriptorId={activeDescriptorId}
      />

      <EServiceWriteStep4DocumentsDoc
        fetchedData={fetchedData}
        uploadDescriptorDocument={uploadDescriptorDocument}
        deleteDescriptorDocument={deleteDescriptorDocument}
        runAction={runAction}
        activeDescriptorId={activeDescriptorId}
      />

      <WhiteBackground>
        <div className="d-flex">
          <Button
            className="me-3"
            variant="primary"
            as={Link}
            to={ROUTES.PROVIDE.SUBROUTES!.ESERVICE_LIST.PATH}
          >
            salva bozza e torna ai servizi
          </Button>
          <Button className="me-3" variant="outline-primary" onClick={back}>
            indietro
          </Button>
        </div>
      </WhiteBackground>

      <WhiteBackground>
        <div className="d-flex">
          <Button className="me-3" variant="primary" onClick={publishVersion}>
            pubblica bozza
          </Button>
          <Button variant="outline-primary" onClick={deleteVersion}>
            cancella bozza
          </Button>
        </div>
      </WhiteBackground>
    </React.Fragment>
  )
}

export const EServiceWriteStep4Documents = withUserFeedback(EServiceWriteStep4DocumentsComponent)
