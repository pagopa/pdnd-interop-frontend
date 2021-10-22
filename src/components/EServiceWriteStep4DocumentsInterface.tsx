import React, { useEffect, useState } from 'react'
import isEmpty from 'lodash/isEmpty'
import { Form } from 'react-bootstrap'
import {
  EServiceDescriptorRead,
  EServiceDocumentRead,
  EServiceDocumentWrite,
  EServiceReadType,
} from '../../types'
import { getActiveInterface } from '../lib/eservice-utils'
import { StyledDeleteableDocument } from './Shared/StyledDeleteableDocument'
import { StyledInputFile } from './Shared/StyledInputFile'
import { StyledInputTextArea } from './Shared/StyledInputTextArea'
import { StyledButton } from './Shared/StyledButton'

type EServiceWriteStep4DocumentsInterfaceProps = {
  data: EServiceReadType
  uploadDescriptorDocument: any
  deleteDescriptorDocument: any
  activeDescriptorId: string
}

export function EServiceWriteStep4DocumentsInterface({
  data,
  uploadDescriptorDocument,
  deleteDescriptorDocument,
  activeDescriptorId,
}: EServiceWriteStep4DocumentsInterfaceProps) {
  const [readDoc, setReadDoc] = useState<EServiceDocumentRead | undefined>()
  const [writeDoc, setWriteDoc] = useState<Partial<EServiceDocumentWrite>>()

  useEffect(() => {
    const initialInterface = getActiveInterface(data, activeDescriptorId)
    setReadDoc(initialInterface)

    return () => {
      setReadDoc(undefined)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const deletePreviousInterfaceDoc = async () => {
    const { outcome } = await deleteDescriptorDocument(readDoc!.id)

    if (outcome === 'success') {
      setReadDoc(undefined)
    }
  }

  const uploadNewInterfaceDoc = async (e: any) => {
    e.preventDefault()

    if (!isEmpty(readDoc)) {
      await deletePreviousInterfaceDoc()
    }

    const { outcome, response } = await uploadDescriptorDocument(writeDoc, 'interface')

    if (outcome === 'success') {
      const activeDescriptor = response.data.descriptors.find(
        (d: EServiceDescriptorRead) => d.id === activeDescriptorId
      )
      const file = activeDescriptor.interface
      setReadDoc(file)
      setWriteDoc(undefined)
    }
  }

  const wrapUpdateDoc = (type: 'doc' | 'description') => (e: any) => {
    const value = type === 'doc' ? e.target.files[0] : e.target.value
    setWriteDoc({ ...writeDoc, [type]: value })
  }

  return readDoc ? (
    <StyledDeleteableDocument
      eserviceId={data.id}
      descriptorId={data.activeDescriptor!.id}
      readable={readDoc}
      deleteDocument={deletePreviousInterfaceDoc}
    />
  ) : (
    <Form className="px-3 py-3 rounded bg-secondary" onSubmit={uploadNewInterfaceDoc}>
      <StyledInputFile
        className="mt-2 mb-0"
        id="interface-doc"
        label="seleziona documento"
        value={writeDoc?.doc}
        onChange={wrapUpdateDoc('doc')}
      />

      <StyledInputTextArea
        className="mt-3 mb-3"
        id="interface-descr"
        label="Descrizione"
        value={writeDoc?.description || ''}
        onChange={wrapUpdateDoc('description')}
      />

      <div className="d-flex justify-content-end">
        <StyledButton type="submit" variant="primary">
          <i
            className="fs-5 bi bi-upload me-2 position-relative"
            style={{ transform: 'translateY(0.1rem)' }}
          />{' '}
          carica
        </StyledButton>
      </div>
    </Form>
  )
}
