import React, { useEffect, useState } from 'react'
import { Formik } from 'formik'
import { object, mixed, string } from 'yup'
import isEmpty from 'lodash/isEmpty'
import { AxiosResponse } from 'axios'
import { UploadFile as UploadFileIcon } from '@mui/icons-material'
import { Box } from '@mui/system'
import {
  EServiceDescriptorRead,
  EServiceDocumentKind,
  EServiceDocumentRead,
  EServiceDocumentWrite,
  EServiceReadType,
} from '../../types'
import { getActiveInterface } from '../lib/eservice-utils'
import { StyledDeleteableDocument } from './Shared/StyledDeleteableDocument'
import { StyledButton } from './Shared/StyledButton'
import { StyledForm } from './Shared/StyledForm'
import { StyledInputControlledFile } from './Shared/StyledInputControlledFile'
import { StyledInputControlledText } from './Shared/StyledInputControlledText'
import { RunActionOutput } from '../hooks/useFeedback'

type EServiceCreateStep3DocumentsInterfaceProps = {
  data: EServiceReadType
  uploadDescriptorDocument: (document: EServiceDocumentWrite) => Promise<RunActionOutput>
  deleteDescriptorDocument: (documentId: string) => Promise<RunActionOutput>
  activeDescriptorId: string
}

type InputValues = {
  interface: File | null
  prettyName?: string
}

export function EServiceCreateStep3DocumentsInterface({
  data,
  uploadDescriptorDocument,
  deleteDescriptorDocument,
  activeDescriptorId,
}: EServiceCreateStep3DocumentsInterfaceProps) {
  const validationSchema = object({
    interface: mixed().required(),
    prettyName: string().required(),
  })
  const initialValues: InputValues = { interface: null, prettyName: 'Documento specifica API' }

  const [readDoc, setReadDoc] = useState<EServiceDocumentRead | undefined>()

  useEffect(() => {
    const initialInterface = getActiveInterface(data, activeDescriptorId)
    setReadDoc(initialInterface)

    return () => {
      setReadDoc(undefined)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const deletePreviousInterfaceDoc = async () => {
    if (!readDoc) {
      return
    }

    const { outcome } = await deleteDescriptorDocument(readDoc.id)

    if (outcome === 'success') {
      setReadDoc(undefined)
    }
  }

  const uploadNewInterfaceDoc = async (data: InputValues) => {
    if (!isEmpty(readDoc)) {
      await deletePreviousInterfaceDoc()
    }

    const dataToPost = {
      doc: data.interface as File,
      prettyName: data.prettyName as string,
      kind: 'INTERFACE' as EServiceDocumentKind,
    }
    const { outcome, response } = await uploadDescriptorDocument(dataToPost)

    if (outcome === 'success') {
      const activeDescriptor = (response as AxiosResponse).data.descriptors.find(
        (d: EServiceDescriptorRead) => d.id === activeDescriptorId
      )
      const file = activeDescriptor.interface
      setReadDoc(file)
    }
  }

  const activeDescriptor = data.activeDescriptor as EServiceDescriptorRead
  return readDoc ? (
    <StyledDeleteableDocument
      isLabelEditable={false}
      eserviceId={data.id}
      descriptorId={activeDescriptor.id}
      readable={readDoc}
      deleteDocument={deletePreviousInterfaceDoc}
    />
  ) : (
    <Box sx={{ px: 2, py: 2, borderLeft: 4, borderColor: 'primary.main' }} bgcolor="common.white">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={uploadNewInterfaceDoc}
        validateOnChange={false}
        validateOnBlur={false}
        enableReinitialize={true}
      >
        {({ handleSubmit, errors, values, setFieldValue }) => (
          <StyledForm onSubmit={handleSubmit}>
            <StyledInputControlledFile
              sx={{ my: 0 }}
              name="interface"
              label="Seleziona documento"
              value={values.interface}
              error={errors.interface}
              setFieldValue={setFieldValue}
            />

            <StyledInputControlledText
              sx={{ my: 2 }}
              name="prettyName"
              label="Nome documento"
              value={values.prettyName}
              disabled={true}
            />

            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <StyledButton type="submit" variant="contained">
                <UploadFileIcon fontSize="small" sx={{ mr: 1 }} /> Carica
              </StyledButton>
            </Box>
          </StyledForm>
        )}
      </Formik>
    </Box>
  )
}
