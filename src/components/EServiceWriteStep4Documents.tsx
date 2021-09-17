import React, { useEffect, useState } from 'react'
import noop from 'lodash/noop'
import { Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { EServiceDocumentWrite, StepperStepComponentProps } from '../../types'
import { ROUTES } from '../lib/constants'
import { EServiceWriteStepProps } from '../views/EServiceWrite'
import { StyledInputFileUploader } from './StyledInputFileUploader'
import { StyledInputText } from './StyledInputText'
import { StyledIntro } from './StyledIntro'
import { WhiteBackground } from './WhiteBackground'
import { UserFeedbackHOCProps, withUserFeedback } from './withUserFeedback'
import { isEmpty } from 'lodash'

function EServiceWriteStep4DocumentsComponent({
  back,
  fetchedData,
  runAction,
}: StepperStepComponentProps & UserFeedbackHOCProps & EServiceWriteStepProps) {
  const [interfaceDoc, setInterfaceDoc] = useState<Partial<EServiceDocumentWrite>>()
  const [documents, setDocuments] = useState<EServiceDocumentWrite[]>([])

  /*
   * API Actions
   */
  const publishVersion = (e: any) => {
    e.preventDefault()
  }

  const deleteVersion = (e: any) => {
    e.preventDefault()
  }

  /*
   * Documents operations
   */
  const wrapUpdateEntry =
    (entryType: 'interfaceDoc' | 'documents', fieldKey: 'doc' | 'description') => (e: any) => {
      const fieldValue = fieldKey === 'doc' ? e.target.files[0] : e.target.value
      if (entryType === 'interfaceDoc') {
        setInterfaceDoc({ ...interfaceDoc, [fieldKey]: fieldValue })
      }
    }

  const wrapDeleteEntry = (entryType: 'interfaceDoc' | 'documents') => (e: any) => {
    if (entryType === 'interfaceDoc') {
      setInterfaceDoc(undefined)
    }
  }

  const wrapUploadFile = (entryType: 'interfaceDoc' | 'documents') => async (e: any) => {
    e.preventDefault()

    if (isEmpty(interfaceDoc)) {
      return
    }

    const formData = new FormData()
    formData.append('kind', 'interface')
    formData.append('description', interfaceDoc!.description!)
    formData.append('doc', interfaceDoc!.doc)

    await runAction(
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
      { suppressToast: false }
    )
  }

  useEffect(() => {
    console.log({ interfaceDoc, documents })
  }, [interfaceDoc, documents])

  return (
    <React.Fragment>
      <WhiteBackground>
        <StyledIntro>
          {{
            title: 'Interfaccia*',
            description: "Carica il file OpenAPI/WSDL che descrive l'API",
          }}
        </StyledIntro>

        <div className="mb-3 px-3 py-3 rounded" style={{ backgroundColor: '#dedede' }}>
          <StyledInputFileUploader
            id="interface-doc"
            label="seleziona"
            value={interfaceDoc?.doc}
            onChange={wrapUpdateEntry('interfaceDoc', 'doc')}
          />
          <StyledInputText
            className="mt-3 mb-3"
            id="interface-description"
            label="Descrizione"
            value={interfaceDoc?.description || ''}
            onChange={wrapUpdateEntry('interfaceDoc', 'description')}
          />
          <div className="d-flex justify-content-end">
            <Button className="me-3" variant="primary" onClick={wrapUploadFile('interfaceDoc')}>
              <i
                className="fs-5 bi bi-upload me-2 position-relative"
                style={{ transform: 'translateY(0.1rem)' }}
              />{' '}
              carica
            </Button>
            <Button variant="outline-primary" onClick={wrapDeleteEntry('interfaceDoc')}>
              elimina
            </Button>
          </div>
        </div>
      </WhiteBackground>

      <WhiteBackground>
        <StyledIntro>
          {{
            title: 'Documentazione',
            description:
              'Inserisci tutta la documentazione tecnica utile all’utilizzo di questa API',
          }}
        </StyledIntro>

        {documents.length > 0 &&
          documents.map((singleDocument, i) => {
            const id = `document-${i}`
            return (
              <div
                className="mb-3 px-3 py-3 rounded"
                key={i}
                style={{ backgroundColor: '#dedede' }}
              >
                <StyledInputFileUploader
                  id={`${id}-doc`}
                  label="seleziona documento"
                  value={singleDocument.doc}
                  onChange={wrapUpdateEntry('documents', 'doc')}
                />
                <StyledInputText
                  id={`${id}-description`}
                  label="Descrizione"
                  value={singleDocument.description || ''}
                  onChange={wrapUpdateEntry('documents', 'description')}
                />
                <div className="d-flex justify-content-end">
                  <Button variant="outline-primary" onClick={wrapDeleteEntry('documents')}>
                    elimina documento
                  </Button>
                </div>
              </div>
            )
          })}

        <Button variant="primary" onClick={noop}>
          aggiungi documento
        </Button>
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
