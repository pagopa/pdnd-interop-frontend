import React from 'react'
import { AgreementDownloads, AgreementMutations } from '@/api/agreement'
import { SectionContainer, SectionContainerSkeleton } from '@/components/layout/containers'
import { useTranslation } from 'react-i18next'
import { ButtonNaked } from '@pagopa/mui-italia'
import { Box, Button, Divider, Stack } from '@mui/material'
import { FormProvider, useForm } from 'react-hook-form'
import { RHFSingleFileInput, RHFTextField } from '@/components/shared/react-hook-form-inputs'
import { DocumentContainer } from '@/components/layout/containers/DocumentContainer'
import { getDownloadDocumentName } from '@/utils/eservice.utils'
import type { Agreement, EServiceDoc } from '@/api/api.generatedTypes'

type AgreementDocsInputSectionProps = {
  agreement?: Agreement
}

type AddDocFormValues = {
  doc: File | null
  prettyName: string
}

export const AgreementDocsInputSection: React.FC<AgreementDocsInputSectionProps> = ({
  agreement,
}) => {
  const { t } = useTranslation('agreement', { keyPrefix: 'edit.documents' })
  const { t: tCommon } = useTranslation('common')
  const [showDocInput, setShowDocInput] = React.useState(false)
  const { mutate: uploadDocument } = AgreementMutations.useUploadDraftDocument()
  const { mutate: deleteDocument } = AgreementMutations.useDeleteDraftDocument()
  const downloadDocument = AgreementDownloads.useDownloadDocument()

  const defaultValues: AddDocFormValues = {
    doc: null,
    prettyName: '',
  }

  const formMethods = useForm<AddDocFormValues>({
    defaultValues,
    shouldUnregister: true,
    mode: 'onSubmit',
  })

  const selectedDoc = formMethods.watch('doc')

  const onSubmit = ({ doc, prettyName }: AddDocFormValues) => {
    if (!doc || !agreement) return
    uploadDocument(
      { agreementId: agreement.id, doc, name: doc.name, prettyName },
      {
        onSuccess() {
          setShowDocInput(false)
        },
      }
    )
  }

  const handleDeleteDocument = (doc: EServiceDoc) => {
    deleteDocument({ agreementId: agreement!.id, documentId: doc.id })
  }

  const handleDownloadDocument = (doc: EServiceDoc) => {
    downloadDocument(
      { agreementId: agreement!.id, documentId: doc.id },
      getDownloadDocumentName(doc)
    )
  }

  const docs = agreement?.consumerDocuments ?? []

  return (
    <SectionContainer title={t('title')} description={t('description')}>
      <Stack spacing={2}>
        {docs.map((doc) => (
          <DocumentContainer
            doc={doc}
            key={doc.id}
            onDownload={handleDownloadDocument}
            onDelete={handleDeleteDocument}
          />
        ))}
      </Stack>

      {docs.length > 0 && <Divider sx={{ my: 2 }} />}

      <FormProvider {...formMethods}>
        <Box component="form" noValidate onSubmit={formMethods.handleSubmit(onSubmit)}>
          {!showDocInput ? (
            <ButtonNaked type="button" color="primary" onClick={setShowDocInput.bind(null, true)}>
              {tCommon('addBtn')}
            </ButtonNaked>
          ) : (
            <>
              <RHFSingleFileInput name="doc" sx={{ my: 0 }} />
              {selectedDoc && (
                <>
                  <RHFTextField
                    name="prettyName"
                    autoFocus
                    label={t('documentPrettynameField.label')}
                    infoLabel={t('documentPrettynameField.infoLabel')}
                    inputProps={{ maxLength: 60 }}
                    sx={{ mt: 3 }}
                    rules={{ required: true, minLength: 5 }}
                  />
                  <Stack direction="row" justifyContent="flex-end">
                    <Button type="submit" variant="contained">
                      {t('uploadBtn')}
                    </Button>
                  </Stack>
                </>
              )}
            </>
          )}
        </Box>
      </FormProvider>
    </SectionContainer>
  )
}

export const AgreementDocsInputSectionSkeleton: React.FC = () => {
  return <SectionContainerSkeleton height={127} />
}
