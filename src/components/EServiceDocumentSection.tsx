import React from 'react'
import { Button } from 'react-bootstrap'
import { EServiceDocumentKind, EServiceDocumentWrite } from '../../types'
import { StyledInputFile } from './StyledInputFile'
import { StyledInputText } from './StyledInputText'
import { StyledIntro } from './StyledIntro'
import { WhiteBackground } from './WhiteBackground'

type EServiceDocumentSectionProps = {
  documents: { [key: string]: EServiceDocumentWrite }
  wrapUpdateDocuments: (
    kind: EServiceDocumentKind,
    id: string,
    key?: 'doc' | 'description'
  ) => (e: any) => void
  wrapDeleteDocuments: (id: string) => (_: any) => void
}

export function EServiceDocumentSection({
  documents,
  wrapUpdateDocuments,
  wrapDeleteDocuments,
}: EServiceDocumentSectionProps) {
  const interfaceDocument = documents['interface']
  const documentationDocuments = Object.values(documents).filter(
    (document) => document.kind !== 'interface'
  )

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
          <StyledInputFile
            id="interface-doc"
            label="seleziona file OpenAPI/WSDL"
            value={interfaceDocument?.doc}
            onChange={wrapUpdateDocuments('interface', 'interface', 'doc')}
          />
          <StyledInputText
            id="interface-description"
            label="Descrizione"
            value={interfaceDocument?.description || ''}
            onChange={wrapUpdateDocuments('interface', 'interface', 'description')}
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

        {documentationDocuments.length > 0 &&
          documentationDocuments.map((documentationDocument, i) => {
            const id = `document-${i}`
            return (
              <div
                className="mb-3 px-3 py-3 rounded"
                key={i}
                style={{ backgroundColor: '#dedede' }}
              >
                <StyledInputFile
                  id={`${id}-doc`}
                  label="seleziona documento da caricare"
                  value={documentationDocument.doc}
                  onChange={wrapUpdateDocuments('document', id, 'doc')}
                />
                <StyledInputText
                  id={`${id}-description`}
                  label="Descrizione"
                  value={documentationDocument.description || ''}
                  onChange={wrapUpdateDocuments('document', id, 'description')}
                />
                <div className="d-flex justify-content-end">
                  <Button variant="outline-primary" onClick={wrapDeleteDocuments(id)}>
                    elimina documento
                  </Button>
                </div>
              </div>
            )
          })}

        <Button
          variant="primary"
          onClick={wrapUpdateDocuments('document', `document-${documentationDocuments.length}`)}
        >
          aggiungi documento
        </Button>
      </WhiteBackground>
    </React.Fragment>
  )
}
