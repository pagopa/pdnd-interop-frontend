import React, { useState } from 'react'
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

function EServiceWriteStep4DocumentsComponent({
  back,
  fetchedData,
}: StepperStepComponentProps & UserFeedbackHOCProps & EServiceWriteStepProps) {
  const [interfaceDoc, setInterfaceDoc] = useState<Partial<EServiceDocumentWrite>>()
  const [documents, setDocuments] = useState<EServiceDocumentWrite[]>([])

  const publishVersion = (e: any) => {
    e.preventDefault()
  }

  const deleteVersion = (e: any) => {
    e.preventDefault()
  }

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
            label="seleziona file OpenAPI/WSDL"
            value={interfaceDoc?.doc}
            onChange={noop}
          />
          <StyledInputText
            id="interface-description"
            label="Descrizione"
            value={interfaceDoc?.description || ''}
            onChange={noop}
          />
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
                  label="seleziona documento da caricare"
                  value={singleDocument.doc}
                  onChange={noop}
                />
                <StyledInputText
                  id={`${id}-description`}
                  label="Descrizione"
                  value={singleDocument.description || ''}
                  onChange={noop}
                />
                <div className="d-flex justify-content-end">
                  <Button variant="outline-primary" onClick={noop}>
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
        <div className="mt-5 d-flex">
          <Button
            className="me-3"
            variant="primary"
            as={Link}
            to={ROUTES.PROVIDE.SUBROUTES!.ESERVICE_LIST.PATH}
          >
            salva bozza e torna ai servizi
          </Button>
          <Button variant="outline-primary" onClick={back}>
            indietro
          </Button>
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
