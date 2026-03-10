import React from 'react'
import { Stack, Box, Button, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { DocumentContainer } from '@/components/layout/containers/DocumentContainer'
import { getDownloadDocumentName } from '@/utils/eservice.utils'
import { useEServiceTemplateCreateContext } from '../ProviderEServiceTemplateContext'
import { EServiceTemplateDownloads } from '@/api/eserviceTemplate/eserviceTemplate.downloads'
import { EServiceTemplateMutations } from '@/api/eserviceTemplate'
import { FormProvider, useForm } from 'react-hook-form'
import { RHFSingleFileInput, RHFTextField } from '@/components/shared/react-hook-form-inputs'
import type { EServiceDoc } from '@/api/api.generatedTypes'
import AddIcon from '@mui/icons-material/Add'

type EServiceTemplateCreateStepVersionDocFormValues = {
  doc: File | null
  prettyName: string
}

const defaultValues: EServiceTemplateCreateStepVersionDocFormValues = {
  doc: null,
  prettyName: '',
}

export function EServiceTemplateCreateStepVersionDoc() {
  const { t } = useTranslation('eserviceTemplate', {
    keyPrefix: 'create.step4.documentationSection',
  })
  const { eserviceTemplateVersion } = useEServiceTemplateCreateContext()
  const downloadDocument = EServiceTemplateDownloads.useDownloadVersionDocument()
  const { mutate: deleteDocument } = EServiceTemplateMutations.useDeleteVersionDraftDocument()
  const { mutate: uploadDocument } = EServiceTemplateMutations.usePostVersionDraftDocument()
  const { mutate: updateDocumentName } =
    EServiceTemplateMutations.useUpdateVersionDraftDocumentDescription()

  const docs = eserviceTemplateVersion?.docs ?? []

  const [showUploadForm, setShowUploadForm] = React.useState(!docs.length)
  const [uploadKey, setUploadKey] = React.useState(0)

  const formMethods = useForm({
    defaultValues,
    shouldUnregister: true,
  })

  const selectedDoc = formMethods.watch('doc')
  const isDocSelected = Boolean(selectedDoc)

  const onSubmit = ({ doc, prettyName }: EServiceTemplateCreateStepVersionDocFormValues) => {
    if (!doc || !eserviceTemplateVersion) return
    uploadDocument(
      {
        eServiceTemplateId: eserviceTemplateVersion.eserviceTemplate.id,
        eServiceTemplateVersionId: eserviceTemplateVersion.id,
        doc,
        prettyName: prettyName || doc.name,
        kind: 'DOCUMENT',
      },
      {
        onSuccess: () => {
          formMethods.reset(defaultValues)
          setUploadKey((k) => k + 1)
          setShowUploadForm(false)
        },
      }
    )
  }

  const handleUpdateDescription = (documentId: string, prettyName: string) => {
    if (!eserviceTemplateVersion) return
    updateDocumentName({
      eServiceTemplateId: eserviceTemplateVersion.eserviceTemplate.id,
      eServiceTemplateVersionId: eserviceTemplateVersion.id,
      documentId,
      prettyName,
    })
  }

  const handleDeleteDocument = (document: EServiceDoc) => {
    if (!eserviceTemplateVersion) return
    deleteDocument({
      eServiceTemplateId: eserviceTemplateVersion.eserviceTemplate.id,
      eServiceTemplateVersionId: eserviceTemplateVersion.id,
      documentId: document.id,
    })
  }

  const handleDownloadDocument = (document: EServiceDoc) => {
    if (!eserviceTemplateVersion) return
    downloadDocument(
      {
        eServiceTemplateId: eserviceTemplateVersion.eserviceTemplate.id,
        eServiceTemplateVersionId: eserviceTemplateVersion.id,
        documentId: document.id,
      },
      getDownloadDocumentName(document)
    )
  }

  return (
    <Box>
      <Stack spacing={2} sx={{ mt: docs.length > 0 ? 3 : 0, mb: docs.length > 0 ? 2 : 0 }}>
        {docs.map((doc, index) => (
          <Box key={doc.id}>
            <Typography variant="body2" sx={{ mb: 3, color: 'text.secondary' }}>
              {t('documentLabel', { number: index + 1 })}
            </Typography>
            <DocumentContainer
              doc={doc}
              onUpdateDescription={handleUpdateDescription.bind(null, doc.id)}
              onDelete={handleDeleteDocument}
              onDownload={handleDownloadDocument}
            />
          </Box>
        ))}
      </Stack>

      {showUploadForm ? (
        <>
          {isDocSelected && (
            <Typography variant="body2" sx={{ mb: 3, color: 'text.secondary' }}>
              {t('documentLabel', { number: docs.length + 1 })}
            </Typography>
          )}

          <FormProvider {...formMethods}>
            <Box
              component="form"
              noValidate
              onSubmit={formMethods.handleSubmit(onSubmit)}
              bgcolor="common.white"
            >
              <RHFSingleFileInput
                key={uploadKey}
                sx={{ my: 0 }}
                name="doc"
                rules={{ required: true }}
              />

              {isDocSelected && (
                <>
                  <RHFTextField
                    size="small"
                    name="prettyName"
                    label={t('nameField.label')}
                    infoLabel={t('nameField.infoLabel')}
                    inputProps={{ maxLength: 60 }}
                  />

                  <Stack direction="row" justifyContent="flex-start" mt={3}>
                    <Button
                      type="button"
                      variant="contained"
                      onClick={formMethods.handleSubmit(onSubmit)}
                    >
                      {t('saveDocumentBtn')}
                    </Button>
                  </Stack>
                </>
              )}
            </Box>
          </FormProvider>
        </>
      ) : (
        <Button
          startIcon={<AddIcon fontSize="small" />}
          size="small"
          variant="text"
          onClick={() => setShowUploadForm(true)}
        >
          {t('addAnotherFileBtn')}
        </Button>
      )}
    </Box>
  )
}
