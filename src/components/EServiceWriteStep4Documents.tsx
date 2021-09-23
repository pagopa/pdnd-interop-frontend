import React from 'react'
import { Button } from 'react-bootstrap'
import { StepperStepComponentProps } from '../../types'
import { EServiceWriteStepProps } from '../views/EServiceWrite'
import { StyledIntro } from './StyledIntro'
import { WhiteBackground } from './WhiteBackground'
import { EServiceWriteStep4DocumentsInterface } from './EServiceWriteStep4DocumentsInterface'
import { UserFeedbackHOCProps, withUserFeedback } from './withUserFeedback'
import { ROUTES } from '../lib/constants'
import { Link } from 'react-router-dom'
import { useLocation } from 'react-router'
import { getBits } from '../lib/url-utils'

function EServiceWriteStep4DocumentsComponent({
  back,
  fetchedData,
  runAction,
}: StepperStepComponentProps & EServiceWriteStepProps & UserFeedbackHOCProps) {
  const location = useLocation()
  const bits = getBits(location)
  const activeDescriptorId: string = bits.pop() as string

  const publishVersion = () => {}
  const deleteVersion = () => {}

  const deleteDescriptorDocument = async (documentId: string, onSuccessCallback: VoidFunction) => {
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

  const uploadDescriptorDocument = async ({ description, doc }: any) => {
    const formData = new FormData()
    formData.append('kind', 'interface')
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
      <EServiceWriteStep4DocumentsInterface
        fetchedData={fetchedData}
        uploadDescriptorDocument={uploadDescriptorDocument}
        deleteDescriptorDocument={deleteDescriptorDocument}
        runAction={runAction}
        activeDescriptorId={activeDescriptorId}
      />

      <WhiteBackground>
        <StyledIntro>
          {{
            title: 'Documentazione',
            description:
              'Inserisci tutta la documentazione tecnica utile all’utilizzo di questo e-service',
          }}
        </StyledIntro>

        {/* <Button variant="primary" onClick={addDocument}>
          aggiungi documento
        </Button> */}
      </WhiteBackground>

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
