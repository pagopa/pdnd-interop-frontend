import React, { useEffect, useState } from 'react'
import { Box } from '@mui/system'
import { UploadFile as UploadFileIcon } from '@mui/icons-material'
import keyBy from 'lodash/keyBy'
import {
  EServiceDescriptorRead,
  EServiceDocumentRead,
  EServiceDocumentWrite,
  EServiceReadType,
} from '../../types'
import { getActiveDocs } from '../lib/eservice-utils'
import { StyledDeleteableDocument } from './Shared/StyledDeleteableDocument'
import { StyledInputFile } from './Shared/StyledInputFile'
import { StyledInputTextArea } from './Shared/StyledInputTextArea'
import { StyledButton } from './Shared/StyledButton'
import { StyledForm } from './Shared/StyledForm'

type EServiceWriteStep4DocumentsDocProps = {
  data: EServiceReadType
  uploadDescriptorDocument: any
  deleteDescriptorDocument: any
  activeDescriptorId: string
}

type EServiceDocumentsReadObject = { [key: string]: EServiceDocumentRead }

export function EServiceWriteStep4DocumentsDoc({
  data,
  uploadDescriptorDocument,
  deleteDescriptorDocument,
  activeDescriptorId,
}: EServiceWriteStep4DocumentsDocProps) {
  const initialDocs = getActiveDocs(data, activeDescriptorId)

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
    <React.Fragment>
      {toArray(readDocs).map((readDoc, i) => {
        return (
          <StyledDeleteableDocument
            key={i}
            eserviceId={data.id}
            descriptorId={data.activeDescriptor!.id}
            readable={readDoc}
            deleteDocument={wrapDeletePreviousDoc(readDoc.id)}
          />
        )
      })}

      {showWriteDocInput ? (
        <Box sx={{ px: '1rem', py: '1rem' }} bgcolor="grey.500">
          <StyledForm onSubmit={uploadNewDoc}>
            <StyledInputFile
              id="doc-doc"
              label="Seleziona documento"
              value={writeDoc?.doc}
              onChange={wrapUpdateDoc('doc')}
            />

            <StyledInputTextArea
              id="doc-descr"
              label="Descrizione"
              value={writeDoc?.description || ''}
              onChange={wrapUpdateDoc('description')}
            />

            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <StyledButton type="submit" variant="contained">
                <UploadFileIcon fontSize="small" sx={{ mr: '0.5rem' }} /> Carica Carica
              </StyledButton>
            </Box>
          </StyledForm>
        </Box>
      ) : (
        <StyledButton variant="contained" onClick={showFileInputForm}>
          Aggiungi documento
        </StyledButton>
      )}
    </React.Fragment>
  )
}
