import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import keyBy from 'lodash/keyBy'
import { Box } from '@mui/system'
import { UploadFile as UploadFileIcon } from '@mui/icons-material'
import {
  EServiceDescriptorRead,
  EServiceDocumentRead,
  EServiceDocumentWrite,
  EServiceReadType,
} from '../../types'
import { getActiveDocs } from '../lib/eservice-utils'
import { StyledDeleteableDocument } from './Shared/StyledDeleteableDocument'
import { StyledInputControlledFile } from './Shared/StyledInputControlledFile'
import { StyledButton } from './Shared/StyledButton'
import { StyledForm } from './Shared/StyledForm'
import { requiredValidationPattern } from '../lib/validation'
import { StyledInputControlledText } from './Shared/StyledInputControlledText'

type EServiceWriteStep4DocumentsDocProps = {
  data: EServiceReadType
  uploadDescriptorDocument: any
  deleteDescriptorDocument: any
  activeDescriptorId: string
}

export function EServiceWriteStep4DocumentsDoc({
  data,
  uploadDescriptorDocument,
  deleteDescriptorDocument,
  activeDescriptorId,
}: EServiceWriteStep4DocumentsDocProps) {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm()

  const initialDocs = getActiveDocs(data, activeDescriptorId)

  const toArray = (obj: Record<string, EServiceDocumentRead>) => Object.values(obj)
  const toObject = (arr: EServiceDocumentRead[]) => keyBy(arr, 'id')

  const [readDocs, setReadDocs] = useState<Record<string, EServiceDocumentRead>>({})
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

  const uploadNewDoc = async (data: Partial<EServiceDocumentWrite>) => {
    const dataToPost = { ...data, doc: data.doc[0], kind: 'document' }
    const { outcome, response } = await uploadDescriptorDocument(dataToPost)

    if (outcome === 'success') {
      const activeDescriptor = response.data.descriptors.find(
        (d: EServiceDescriptorRead) => d.id === activeDescriptorId
      )
      const files = activeDescriptor.docs
      setReadDocs(toObject(files))
      setShowWriteDocInput(false)
    }
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
        <Box
          sx={{ px: 2, py: 2, borderLeft: 6, borderColor: 'primary.main' }}
          bgcolor="common.white"
        >
          <StyledForm onSubmit={handleSubmit(uploadNewDoc)}>
            <StyledInputControlledFile
              sx={{ my: 0 }}
              name="doc"
              label="Seleziona documento"
              control={control}
              rules={{ required: requiredValidationPattern }}
              errors={errors}
            />

            <StyledInputControlledText
              sx={{ my: 2 }}
              name="description"
              label="Descrizione"
              control={control}
              rules={{}}
              errors={errors}
              multiline={true}
              rows={4}
            />

            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <StyledButton type="submit" variant="contained">
                <UploadFileIcon fontSize="small" sx={{ mr: 1 }} /> Carica
              </StyledButton>
            </Box>
          </StyledForm>
        </Box>
      ) : (
        <StyledButton variant="contained" onClick={showFileInputForm}>
          + Aggiungi
        </StyledButton>
      )}
    </React.Fragment>
  )
}
