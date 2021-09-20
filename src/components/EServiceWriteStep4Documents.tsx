import React, { useEffect, useState } from 'react'
import cryptoRandomString from 'crypto-random-string'
import { Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { EServiceDocumentKind, EServiceDocumentWrite, StepperStepComponentProps } from '../../types'
import { ROUTES } from '../lib/constants'
import { EServiceWriteStepProps } from '../views/EServiceWrite'
import { StyledIntro } from './StyledIntro'
import { WhiteBackground } from './WhiteBackground'
import { UserFeedbackHOCProps, withUserFeedback } from './withUserFeedback'
import { StyledInputFileUploaderWithControls } from './StyledInputFileUploaderWithControls'

type DecoratedEServiceDocumentWrite = EServiceDocumentWrite & { id: string }

function EServiceWriteStep4DocumentsComponent({
  back,
  fetchedData,
  runAction,
}: StepperStepComponentProps & UserFeedbackHOCProps & EServiceWriteStepProps) {
  const [documents, setDocuments] = useState<{
    [id: string]: Partial<DecoratedEServiceDocumentWrite>
  }>({})

  /*
   * EService API operations
   */
  const publishVersion = (e: any) => {
    e.preventDefault()
  }

  const deleteVersion = (e: any) => {
    e.preventDefault()
  }

  /*
   * Descriptor documents operations
   */
  const addDocument = () => {
    const newId = `document-${cryptoRandomString({ length: 8 })}`
    setDocuments({ ...documents, [newId]: {} })
  }

  const wrapUpdateEntry =
    (kind: EServiceDocumentKind, documentId: string, fieldKey: 'doc' | 'description') =>
    (e: any) => {
      const fieldValue = fieldKey === 'doc' ? e.target.files[0] : e.target.value
      setDocuments({
        ...documents,
        [documentId]: { ...documents[documentId], kind, [fieldKey]: fieldValue },
      })
    }

  const wrapDeleteEntry = (documentId: string) => (e: any) => {
    // Make API call to delete entry

    // The delete from local state
    const _documents = { ...documents }
    delete _documents[documentId]
    setDocuments(_documents)
  }

  const wrapUploadFile = (documentId: string) => async (e: any) => {
    e.preventDefault()

    const { kind, description, doc } = documents[documentId]

    if (!kind || !description) {
      // Throw error?
      return
    }

    const formData = new FormData()
    formData.append('kind', kind)
    formData.append('description', description)
    formData.append('doc', doc)

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

  const remapDocumentsAsArray = (): Partial<DecoratedEServiceDocumentWrite>[] =>
    Object.keys(documents)
      .filter((id) => documents[id].kind !== 'interface')
      .map((id) => ({ ...documents[id], id }))

  useEffect(() => {
    console.log('documents', documents)
  }, [documents])

  const documentationDocuments = remapDocumentsAsArray()

  return (
    <React.Fragment>
      <WhiteBackground>
        <StyledIntro>
          {{
            title: 'Interfaccia*',
            description: "Carica il file OpenAPI/WSDL che descrive l'API",
          }}
        </StyledIntro>

        <StyledInputFileUploaderWithControls
          file={documents['interface']?.doc}
          onChangeFile={wrapUpdateEntry('interface', 'interface', 'doc')}
          description={documents['interface']?.description}
          onChangeDescription={wrapUpdateEntry('interface', 'interface', 'description')}
          requestUpload={wrapUploadFile('interface')}
          requestDelete={wrapDeleteEntry('interface')}
          id="interface"
        />
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
          documentationDocuments.map(({ doc, description, id }, i) => {
            return (
              <StyledInputFileUploaderWithControls
                key={i}
                file={doc}
                onChangeFile={wrapUpdateEntry('document', id!, 'doc')}
                description={description}
                onChangeDescription={wrapUpdateEntry('document', id!, 'description')}
                requestUpload={wrapUploadFile(id!)}
                requestDelete={wrapDeleteEntry(id!)}
                id={id!}
              />
            )
          })}

        <Button variant="primary" onClick={addDocument}>
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
