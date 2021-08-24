import React, { useState } from 'react'
import { Button } from 'react-bootstrap'
import { EServiceDocumentType } from '../../types'
import { StyledInputFile } from './StyledInputFile'
import { StyledIntro } from './StyledIntro'
import { TableAction } from './TableAction'
import { TableWithLoader } from './TableWithLoader'
import { WhiteBackground } from './WhiteBackground'

type EServiceDocumentSectionProps = {
  interfaceDocument?: EServiceDocumentType
  documents: EServiceDocumentType[]
  setInterface: any
  deleteInterface: any
  setDocuments: any
  deleteDocuments: any
}

export function EServiceDocumentSection({
  interfaceDocument,
  documents,
  setInterface,
  deleteInterface,
  setDocuments,
  deleteDocuments,
}: EServiceDocumentSectionProps) {
  const [inputFileUpload, showInputFileUpload] = useState(false)

  const updateInputFileUpload = () => {
    showInputFileUpload(true)
  }

  const updateDocuments = (e: any) => {
    setDocuments(e)
    showInputFileUpload(false)
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

        {interfaceDocument ? (
          <TableWithLoader isLoading={false} headData={['nome file', '']}>
            {[interfaceDocument].map((document, i) => (
              <tr key={i}>
                <td style={{ verticalAlign: 'middle' }}>{document.file.name}</td>
                <td className="d-flex justify-content-end">
                  <TableAction
                    btnProps={{ onClick: deleteInterface }}
                    label="Elimina"
                    iconClass="bi-trash"
                  />
                </td>
              </tr>
            ))}
          </TableWithLoader>
        ) : (
          <StyledInputFile onChange={setInterface} id="interfaccia" />
        )}
      </WhiteBackground>

      <WhiteBackground>
        <StyledIntro>
          {{
            title: 'Documentazione',
            description:
              'Inserisci tutta la documentazione tecnica utile all’utilizzo di questa API',
          }}
        </StyledIntro>

        {documents.length > 0 && (
          <TableWithLoader isLoading={false} headData={['nome file', '']}>
            {documents.map((document, i) => (
              <tr key={i}>
                <td style={{ verticalAlign: 'middle' }}>{document.file.name}</td>
                <td className="d-flex justify-content-end">
                  <TableAction
                    btnProps={{ onClick: deleteDocuments(document.file.name) }}
                    label="Elimina"
                    iconClass="bi-trash"
                  />
                </td>
              </tr>
            ))}
          </TableWithLoader>
        )}

        {inputFileUpload && (
          <div className="my-4">
            <StyledInputFile onChange={updateDocuments} id="documenti" />
          </div>
        )}

        <Button variant="primary" onClick={updateInputFileUpload}>
          aggiungi documento
        </Button>
      </WhiteBackground>
    </React.Fragment>
  )
}
