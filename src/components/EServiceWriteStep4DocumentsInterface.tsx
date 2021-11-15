import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import isEmpty from 'lodash/isEmpty'
import {
  EServiceDescriptorRead,
  EServiceDocumentRead,
  EServiceDocumentWrite,
  EServiceReadType,
} from '../../types'
import { getActiveInterface } from '../lib/eservice-utils'
import { StyledDeleteableDocument } from './Shared/StyledDeleteableDocument'
import { StyledInputFile } from './Shared/StyledInputFile'
import { StyledButton } from './Shared/StyledButton'
import { StyledForm } from './Shared/StyledForm'
import { UploadFile as UploadFileIcon } from '@mui/icons-material'
import { Box } from '@mui/system'
import { StyledInputControlledText } from './Shared/StyledInputControlledText'
import { requiredValidationPattern } from '../lib/validation'

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
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm()
  const [readDoc, setReadDoc] = useState<EServiceDocumentRead | undefined>()

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

  const uploadNewInterfaceDoc = async (data: Partial<EServiceDocumentWrite>) => {
    if (!isEmpty(readDoc)) {
      await deletePreviousInterfaceDoc()
    }

    const dataToPost = { ...data, doc: data.doc[0], kind: 'interface' }
    const { outcome, response } = await uploadDescriptorDocument(dataToPost)

    if (outcome === 'success') {
      const activeDescriptor = response.data.descriptors.find(
        (d: EServiceDescriptorRead) => d.id === activeDescriptorId
      )
      const file = activeDescriptor.interface
      setReadDoc(file)
    }
  }

  return readDoc ? (
    <StyledDeleteableDocument
      eserviceId={data.id}
      descriptorId={data.activeDescriptor!.id}
      readable={readDoc}
      deleteDocument={deletePreviousInterfaceDoc}
    />
  ) : (
    <Box sx={{ px: 2, py: 2 }} bgcolor="common.white">
      <StyledForm onSubmit={handleSubmit(uploadNewInterfaceDoc)}>
        <StyledInputFile
          name="doc"
          label="Seleziona documento"
          control={control}
          errors={errors}
          rules={{ required: requiredValidationPattern }}
        />

        <StyledInputControlledText
          name="description"
          label="Descrizione"
          control={control}
          rules={{}}
          errors={errors}
          multiline={true}
        />

        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <StyledButton type="submit" variant="contained">
            <UploadFileIcon fontSize="small" sx={{ mr: 1 }} /> Carica
          </StyledButton>
        </Box>
      </StyledForm>
    </Box>
  )
}
