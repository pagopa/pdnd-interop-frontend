import React from 'react'
import { AgreementDownloads, AgreementMutations } from '@/api/agreement'
import { SectionContainer, SectionContainerSkeleton } from '@/components/layout/containers'
import { useTranslation } from 'react-i18next'
import { Box, Button, Stack } from '@mui/material'
import { FormProvider, useForm } from 'react-hook-form'
import { RHFSingleFileInput, RHFTextField } from '@/components/shared/react-hook-form-inputs'
import { DocumentContainer } from '@/components/layout/containers/DocumentContainer'
import { getDownloadDocumentName } from '@/utils/eservice.utils'
import type { EServiceDoc } from '@/api/api.generatedTypes'
import { useAgreementDetailsContext } from '@/components/shared/AgreementDetails/AgreementDetailsContext'

type AgreementDocsInputSectionProps = {
  agreementId: string
}

type AddDocFormValues = {
  doc: File | null
  prettyName: string
}

const defaultValues: AddDocFormValues = {
  doc: null,
  prettyName: '',
}

export const AgreementDocsInputSection: React.FC<AgreementDocsInputSectionProps> = ({
  agreementId,
}) => {
  const { t } = useTranslation('agreement', { keyPrefix: 'edit.documents' })
  const { t: tCommon } = useTranslation('common')
  const [showDocInput, setShowDocInput] = React.useState(false)
  const { mutate: uploadDocument } = AgreementMutations.useUploadDraftDocument()
  const { mutate: deleteDocument } = AgreementMutations.useDeleteDraftDocument()
  const downloadDocument = AgreementDownloads.useDownloadDocument()

  const { agreement } = useAgreementDetailsContext()

  const formMethods = useForm<AddDocFormValues>({
    defaultValues,
    shouldUnregister: true,
    mode: 'onSubmit',
  })

  const selectedDoc = formMethods.watch('doc')

  const onSubmit = ({ doc, prettyName }: AddDocFormValues) => {
    if (!doc) return
    uploadDocument(
      { agreementId, doc, name: doc.name, prettyName },
      {
        onSuccess() {
          setShowDocInput(false)
        },
      }
    )
  }

  const handleDeleteDocument = (doc: EServiceDoc) => {
    deleteDocument({ agreementId, documentId: doc.id })
  }

  const handleDownloadDocument = (doc: EServiceDoc) => {
    downloadDocument({ agreementId, documentId: doc.id }, getDownloadDocumentName(doc))
  }

  const docs = agreement?.consumerDocuments ?? []

  return (
    <SectionContainer newDesign innerSection title={t('title')} description={t('description')}>
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

      <FormProvider {...formMethods}>
        <Box
          component="form"
          noValidate
          onSubmit={formMethods.handleSubmit(onSubmit)}
          mt={docs.length > 0 ? 4 : 0}
        >
          {!showDocInput ? (
            <Button
              type="button"
              variant="text"
              color="primary"
              onClick={setShowDocInput.bind(null, true)}
            >
              {tCommon('addBtn')}
            </Button>
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
