import isEmpty from 'lodash/isEmpty'
import React, { useEffect, useState } from 'react'
import { Button, Form } from 'react-bootstrap'
import { useLocation } from 'react-router'
import { EServiceDescriptorRead, EServiceDocumentRead, EServiceDocumentWrite } from '../../types'
import { getActiveDescriptor } from '../lib/eservice-utils'
import { getBits } from '../lib/url-utils'
import { StyledDeleteableDocument } from './StyledDeleteableDocument'
import { StyledInputFile } from './StyledInputFile'
import { StyledInputTextArea } from './StyledInputTextArea'
import { StyledIntro } from './StyledIntro'
import { WhiteBackground } from './WhiteBackground'

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
  const location = useLocation()
  const bits = getBits(location)
  const activeDescriptorId: string = bits.pop() as string
  const initialActiveDescriptor = fetchedData
    ? getActiveDescriptor(fetchedData, activeDescriptorId)
    : undefined
  const initialInterface: EServiceDocumentRead | undefined = !isEmpty(initialActiveDescriptor)
    ? initialActiveDescriptor!.interface
    : undefined

  const [readDoc, setReadDoc] = useState<EServiceDocumentRead | undefined>(initialInterface)
  const [writeDoc, setWriteDoc] = useState<Partial<EServiceDocumentWrite>>()

  const deletePreviousInterfaceDoc = async () => {
    const { outcome } = await runAction(
      {
        path: {
          endpoint: 'ESERVICE_VERSION_DELETE_DOCUMENT',
          endpointParams: {
            eserviceId: fetchedData.id,
            descriptorId: fetchedData.activeDescriptor!.id,
            documentId: readDoc!.id,
          },
        },
        config: { method: 'DELETE' },
      },
      { suppressToast: true }
    )

    if (outcome === 'success') {
      setReadDoc(undefined)
      setWriteDoc(undefined)
    }
  }

  const postDoc = async (e: any) => {
    e.preventDefault()

    if (!isEmpty(readDoc)) {
      await deletePreviousInterfaceDoc()
    }

    const { outcome, response } = await uploadDescriptorDocument(writeDoc)

    if (outcome === 'success') {
      const activeDescriptor = response.data.descriptors.find(
        (d: EServiceDescriptorRead) => d.id === activeDescriptorId
      )
      const file = activeDescriptor.interface
      setReadDoc(file)
    }
  }

  const wrapUpdateDoc = (type: 'doc' | 'description') => (e: any) => {
    const value = type === 'doc' ? e.target.files[0] : e.target.value
    setWriteDoc({ ...writeDoc, [type]: value })
  }

  useEffect(() => {
    console.log({ writeDoc, readDoc })
  }, [writeDoc, readDoc])

  return (
    <WhiteBackground>
      <StyledIntro>
        {{
          title: 'Interfaccia*',
          description: "Carica il file OpenAPI/WSDL che descrive l'API",
        }}
      </StyledIntro>

      {readDoc ? (
        <StyledDeleteableDocument
          eserviceId={fetchedData.id}
          descriptorId={fetchedData.activeDescriptor.id}
          readable={readDoc}
          deleteDocument={deletePreviousInterfaceDoc}
          runAction={runAction}
        />
      ) : (
        <Form onSubmit={postDoc}>
          <StyledInputFile
            id="interface-doc"
            label="Seleziona documento"
            value={writeDoc?.doc}
            onChange={wrapUpdateDoc('doc')}
          />

          <StyledInputTextArea
            label="Descrizione"
            value={writeDoc?.description || ''}
            onChange={wrapUpdateDoc('description')}
          />

          <div className="d-flex justify-content-end">
            <Button type="submit" variant="primary">
              carica
            </Button>
          </div>
        </Form>
      )}
    </WhiteBackground>
  )
}
