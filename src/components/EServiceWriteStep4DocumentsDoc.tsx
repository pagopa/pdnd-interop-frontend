import React, { useEffect, useState } from 'react'
import keyBy from 'lodash/keyBy'
import { Button, Form } from 'react-bootstrap'
import {
  EServiceDescriptorRead,
  EServiceDocumentRead,
  EServiceDocumentWrite,
  EServiceReadType,
} from '../../types'
import { getActiveDocs } from '../lib/eservice-utils'
import { StyledDeleteableDocument } from './StyledDeleteableDocument'
import { StyledInputFile } from './StyledInputFile'
import { StyledInputTextArea } from './StyledInputTextArea'
import { StyledIntro } from './StyledIntro'
import { WhiteBackground } from './WhiteBackground'

type EServiceWriteStep4DocumentsDocProps = {
  fetchedData: EServiceReadType
  uploadDescriptorDocument: any
  deleteDescriptorDocument: any
  activeDescriptorId: string
  runAction: any
}

type EServiceDocumentsReadObject = { [key: string]: EServiceDocumentRead }

export function EServiceWriteStep4DocumentsDoc({
  fetchedData,
  uploadDescriptorDocument,
  deleteDescriptorDocument,
  activeDescriptorId,
  runAction,
}: EServiceWriteStep4DocumentsDocProps) {
  const initialDocs = getActiveDocs(fetchedData, activeDescriptorId)

  const toArray = (obj: EServiceDocumentsReadObject) => Object.values(obj)
  const toObject = (arr: EServiceDocumentRead[]) => keyBy(arr, 'id')

  const [readDocs, setReadDocs] = useState<EServiceDocumentsReadObject>({})
  const [writeDoc, setWriteDoc] = useState<Partial<EServiceDocumentWrite>>()
  const [showWriteDocInput, setShowWriteDocInput] = useState(false)

  useEffect(() => {
    setReadDocs(toObject(initialDocs))
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const wrapDeletePreviousDoc = (id: string) => async () => {
    const { outcome } = await deleteDescriptorDocument(id)

    if (outcome === 'success') {
      const newDocsObject = { ...readDocs }
      delete newDocsObject[id]
      setReadDocs(newDocsObject)
    }
  }

  const uploadNewDoc = async (e: any) => {
    e.preventDefault()

    const { outcome, response } = await uploadDescriptorDocument(writeDoc, 'document')

    if (outcome === 'success') {
      const activeDescriptor = response.data.descriptors.find(
        (d: EServiceDescriptorRead) => d.id === activeDescriptorId
      )
      const files = activeDescriptor.docs
      setReadDocs(toObject(files))
      setWriteDoc(undefined)
      setShowWriteDocInput(false)
    }
  }

  const wrapUpdateDoc = (type: 'doc' | 'description') => (e: any) => {
    const value = type === 'doc' ? e.target.files[0] : e.target.value
    setWriteDoc({ ...writeDoc, [type]: value })
  }

  const showFileInputForm = (_: any) => {
    setShowWriteDocInput(true)
  }

  return (
    <WhiteBackground>
      <StyledIntro priority={2}>
        {{
          title: 'Documentazione',
          description: 'Inserisci la documentazione tecnica utile all’utilizzo di questo e-service',
        }}
      </StyledIntro>

      {toArray(readDocs).map((readDoc, i) => {
        return (
          <StyledDeleteableDocument
            key={i}
            eserviceId={fetchedData.id}
            descriptorId={fetchedData.activeDescriptor!.id}
            readable={readDoc}
            deleteDocument={wrapDeletePreviousDoc(readDoc.id)}
            runAction={runAction}
          />
        )
      })}

      {showWriteDocInput ? (
        <Form className="px-3 py-3 rounded bg-secondary" onSubmit={uploadNewDoc}>
          <StyledInputFile
            className="mt-2 mb-0"
            id="doc-doc"
            label="seleziona documento"
            value={writeDoc?.doc}
            onChange={wrapUpdateDoc('doc')}
          />

          <StyledInputTextArea
            className="mt-3 mb-3"
            id="doc-descr"
            label="Descrizione"
            value={writeDoc?.description || ''}
            onChange={wrapUpdateDoc('description')}
          />

          <div className="d-flex justify-content-end">
            <Button type="submit" variant="primary">
              <i
                className="fs-5 bi bi-upload me-2 position-relative"
                style={{ transform: 'translateY(0.1rem)' }}
              />{' '}
              carica
            </Button>
          </div>
        </Form>
      ) : (
        <Button variant="primary" onClick={showFileInputForm}>
          Aggiungi documento
        </Button>
      )}
    </WhiteBackground>
  )
}
