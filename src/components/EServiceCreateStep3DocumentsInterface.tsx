import React, { useEffect, useState } from 'react'
import { Formik } from 'formik'
import { object, mixed, string } from 'yup'
import isEmpty from 'lodash/isEmpty'
import { AxiosResponse } from 'axios'
import { UploadFile as UploadFileIcon } from '@mui/icons-material'
import {
  EServiceDescriptorRead,
  EServiceDocumentKind,
  EServiceDocumentRead,
  EServiceDocumentWrite,
  EServiceReadType,
  RequestOutcome,
} from '../../types'
import { getActiveInterface } from '../lib/eservice-utils'
import { StyledDeleteableDocument } from './Shared/StyledDeleteableDocument'
import { StyledButton } from './Shared/StyledButton'
import { StyledForm } from './Shared/StyledForm'
import { StyledInputControlledFile } from './Shared/StyledInputControlledFile'
import { StyledInputControlledText } from './Shared/StyledInputControlledText'
import { RunActionOutput } from '../hooks/useFeedback'
import { useTranslation } from 'react-i18next'
import { Stack, Box } from '@mui/material'

type EServiceCreateStep3DocumentsInterfaceProps = {
  data: EServiceReadType
  uploadDescriptorDocument: (document: EServiceDocumentWrite) => Promise<RunActionOutput>
  deleteDescriptorDocument: (documentId: string) => Promise<RunActionOutput>
  updateDescriptorDocumentDescription: (
    documentId: string,
    newDescription: string
  ) => Promise<RequestOutcome>
  downloadDescriptorDocument: (document: EServiceDocumentRead) => Promise<void>
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
  updateDescriptorDocumentDescription,
  downloadDescriptorDocument,
  activeDescriptorId,
}: EServiceCreateStep3DocumentsInterfaceProps) {
  const { t } = useTranslation('eservice')
  const validationSchema = object({
    interface: mixed().required(),
    prettyName: string().required(),
  })
  const initialValues: InputValues = {
    interface: null,
    prettyName: t('create.step3.interface.prettyName'),
  }

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

  const wrapDownloadDoc = (document: EServiceDocumentRead) => async () => {
    console.log({ document })
    await downloadDescriptorDocument(document)
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

  return readDoc ? (
    <StyledDeleteableDocument
      isLabelEditable={false}
      readable={readDoc}
      updateDescription={updateDescriptorDocumentDescription.bind(null, readDoc.id)}
      deleteDocument={deletePreviousInterfaceDoc}
      downloadDocument={wrapDownloadDoc(readDoc)}
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
              label={t('create.step3.uploadFileField.label')}
              value={values.interface}
              error={errors.interface}
              setFieldValue={setFieldValue}
            />

            <StyledInputControlledText
              sx={{ my: 2 }}
              name="prettyName"
              label={t('create.step3.nameField.label')}
              value={values.prettyName}
              disabled={true}
            />

            <Stack direction="row" justifyContent="flex-end">
              <StyledButton type="submit" variant="contained">
                <UploadFileIcon fontSize="small" sx={{ mr: 1 }} /> {t('create.step3.uploadBtn')}
              </StyledButton>
            </Stack>
          </StyledForm>
        )}
      </Formik>
    </Box>
  )
}
