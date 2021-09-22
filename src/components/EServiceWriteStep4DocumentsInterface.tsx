import React, { useEffect, useState } from 'react'
import { Button, Form } from 'react-bootstrap'
import { EServiceDocumentRead, EServiceDocumentWrite } from '../../types'
import { remapBackendDocumentToFrontend } from '../lib/eservice-utils'
import { StyledDeleteableDocument } from './StyledDeleteableDocument'
import { StyledInputFile } from './StyledInputFile'
import { StyledInputTextArea } from './StyledInputTextArea'
import { StyledIntro } from './StyledIntro'
import { WhiteBackground } from './WhiteBackground'
import { withUserFeedback } from './withUserFeedback'

type EServiceWriteStep4DocumentsInterfaceProps = {
  fetchedData: any
  uploadDescriptorDocument: any
  runAction: any
}

export function EServiceWriteStep4DocumentsInterface({
  fetchedData,
  uploadDescriptorDocument,
  runAction,
}: EServiceWriteStep4DocumentsInterfaceProps) {
  // const { interface: _interfaceDoc, docs: _docs } = fetchedData.activeDescriptor!
  // const _interfaceDoc: EServiceDocumentRead = {
  //   name: 'il_mio_file.yml',
  //   description: 'dsjfiodsfndoisnfodis',
  //   id: 'dsjfoidsnfodi',
  //   contentType: '',
  // }

  const [doc, setDoc] = useState<Partial<EServiceDocumentWrite>>()

  const deletePreviousInterfaceDoc = async () => {
    const { outcome } = await runAction(
      {
        path: {
          endpoint: 'ESERVICE_VERSION_DELETE_DOCUMENT',
          endpointParams: {
            eserviceId: fetchedData.id,
            descriptorId: fetchedData.activeDescriptor!.id,
            documentId: doc!.doc.id,
          },
        },
        config: { method: 'DELETE' },
      },
      { suppressToast: true }
    )

    if (outcome === 'success') {
      setDoc(undefined)
    }
  }

  const postDoc = async (e: any) => {
    e.preventDefault()

    if (doc) {
      await deletePreviousInterfaceDoc()
    }

    const { outcome, response } = await uploadDescriptorDocument(doc)

    console.log('posting doc')
  }

  const wrapUpdateDoc = (type: 'doc' | 'description') => (e: any) => {
    const value = type === 'doc' ? e.target.files[0] : e.target.value
    setDoc({ ...doc, [type]: value })
  }

  useEffect(() => {
    console.log(doc)
  }, [doc])

  return (
    <WhiteBackground>
      <StyledIntro>
        {{
          title: 'Interfaccia*',
          description: "Carica il file OpenAPI/WSDL che descrive l'API",
        }}
      </StyledIntro>

      <Form onSubmit={postDoc}>
        <StyledInputFile
          id="interface-doc"
          label="Seleziona documento"
          value={doc?.doc}
          onChange={wrapUpdateDoc('doc')}
        />

        <StyledInputTextArea
          label="Descrizione"
          value={doc?.description || ''}
          onChange={wrapUpdateDoc('description')}
        />

        <div className="d-flex justify-content-end">
          <Button type="submit" variant="primary">
            carica
          </Button>
        </div>
      </Form>
    </WhiteBackground>
  )
}
