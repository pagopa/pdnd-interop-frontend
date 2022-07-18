import React, { useEffect, useState } from 'react'
import { Formik } from 'formik'
import { object, string, mixed } from 'yup'
import keyBy from 'lodash/keyBy'
import { UploadFile as UploadFileIcon } from '@mui/icons-material'
import {
  EServiceDescriptorRead,
  EServiceDocumentRead,
  EServiceDocumentWrite,
  EServiceReadType,
  EServiceDocumentKind,
} from '../../types'
import { getActiveDocs } from '../lib/eservice-utils'
import { StyledDeleteableDocument } from './Shared/StyledDeleteableDocument'
import { StyledButton } from './Shared/StyledButton'
import { StyledForm } from './Shared/StyledForm'
import { AxiosResponse } from 'axios'
import { StyledInputControlledText } from './Shared/StyledInputControlledText'
import { StyledInputControlledFile } from './Shared/StyledInputControlledFile'
import { Alert, Stack, Box } from '@mui/material'
import { RunActionOutput } from '../hooks/useFeedback'
import { useTranslation } from 'react-i18next'

type EServiceCreateStep3DocumentsDocProps = {
  data: EServiceReadType
  uploadDescriptorDocument: (document: EServiceDocumentWrite) => Promise<RunActionOutput>
  deleteDescriptorDocument: (documentId: string) => Promise<RunActionOutput>
  activeDescriptorId: string
}

type InputValues = {
  doc: File | null
  prettyName?: string
}

export function EServiceCreateStep3DocumentsDoc({
  data,
  uploadDescriptorDocument,
  deleteDescriptorDocument,
  activeDescriptorId,
}: EServiceCreateStep3DocumentsDocProps) {
  const { t } = useTranslation(['eservice', 'common'])
  const validationSchema = object({
    doc: mixed().required(),
    prettyName: string().required(),
  })
  const initialValues: InputValues = { doc: null, prettyName: '' }

  const initialDocs = getActiveDocs(data, activeDescriptorId)

  const toArray = (obj: Record<string, EServiceDocumentRead>) => Object.values(obj)
  const toObject = (arr: Array<EServiceDocumentRead>) => keyBy(arr, 'id')

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

  const uploadNewDoc = async (data: InputValues) => {
    const dataToPost = {
      doc: data.doc as File,
      prettyName: data.prettyName as string,
      kind: 'DOCUMENT' as EServiceDocumentKind,
    }

    const { outcome, response } = await uploadDescriptorDocument(dataToPost)

    if (outcome === 'success') {
      const activeDescriptor = (response as AxiosResponse).data.descriptors.find(
        (d: EServiceDescriptorRead) => d.id === activeDescriptorId
      )
      const files = activeDescriptor.docs
      setReadDocs(toObject(files))
      setShowWriteDocInput(false)
    }
  }

  const showFileInputForm = () => {
    setShowWriteDocInput(true)
  }

  const readDocsArray = toArray(readDocs)

  return (
    <Box sx={{ mb: 3 }}>
      <Box sx={{ mb: 3 }}>
        {Boolean(readDocsArray.length > 0) ? (
          readDocsArray.map((readDoc) => (
            <StyledDeleteableDocument
              key={readDoc.id}
              eserviceId={data.id}
              descriptorId={(data.activeDescriptor as EServiceDescriptorRead).id}
              readable={readDoc}
              deleteDocument={wrapDeletePreviousDoc(readDoc.id)}
            />
          ))
        ) : (
          <Alert severity="info">{t('create.step3.documentation.noFileUploaded')}</Alert>
        )}
      </Box>

      {showWriteDocInput ? (
        <Box
          sx={{ px: 2, py: 2, borderLeft: 4, borderColor: 'primary.main' }}
          bgcolor="common.white"
        >
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={uploadNewDoc}
            validateOnChange={false}
            validateOnBlur={false}
            enableReinitialize={true}
          >
            {({ handleSubmit, errors, values, handleChange, setFieldValue }) => (
              <StyledForm onSubmit={handleSubmit}>
                <StyledInputControlledFile
                  sx={{ my: 0 }}
                  name="doc"
                  label={t('create.step3.uploadFileField.label')}
                  value={values.doc}
                  error={errors.doc as string | undefined}
                  setFieldValue={setFieldValue}
                />

                <StyledInputControlledText
                  sx={{ my: 2 }}
                  name="prettyName"
                  label={t('create.step3.nameField.label')}
                  value={values.prettyName}
                  error={errors.prettyName}
                  onChange={handleChange}
                  rows={4}
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
      ) : (
        <StyledButton variant="contained" size="small" onClick={showFileInputForm}>
          {t('addBtn', { ns: 'common' })}
        </StyledButton>
      )}
    </Box>
  )
}
