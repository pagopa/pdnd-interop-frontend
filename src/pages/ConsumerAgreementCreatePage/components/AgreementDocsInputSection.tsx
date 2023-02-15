import React from 'react'
import { AgreementDownloads, AgreementMutations, AgreementQueries } from '@/api/agreement'
import { SectionContainer, SectionContainerSkeleton } from '@/components/layout/containers'
import { useTranslation } from 'react-i18next'
import { ButtonNaked } from '@pagopa/mui-italia'
import { Box, Button, Divider, Stack } from '@mui/material'
import { FormProvider, useForm } from 'react-hook-form'
import { object, string } from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { SingleFileInput, TextField } from '@/components/shared/ReactHookFormInputs'
import { DocumentContainer } from '@/components/layout/containers/DocumentContainer'
import { DocumentRead } from '@/types/common.types'
import { getDownloadDocumentName } from '@/utils/eservice.utils'

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

  const { data: agreement } = AgreementQueries.useGetSingle(agreementId)

  const validationSchema = object({
    prettyName: string().required().min(5),
  })

  const formMethods = useForm<AddDocFormValues>({
    resolver: yupResolver(validationSchema),
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

  const handleDeleteDocument = (doc: DocumentRead) => {
    deleteDocument({ agreementId, documentId: doc.id })
  }

  const handleDownloadDocument = (doc: DocumentRead) => {
    downloadDocument({ agreementId, documentId: doc.id }, getDownloadDocumentName(doc))
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
        <Box component="form" onSubmit={formMethods.handleSubmit(onSubmit)}>
          {!showDocInput ? (
            <ButtonNaked type="button" color="primary" onClick={setShowDocInput.bind(null, true)}>
              {tCommon('addBtn')}
            </ButtonNaked>
          ) : (
            <>
              <SingleFileInput name="doc" sx={{ my: 0 }} />
              {selectedDoc && (
                <>
                  <TextField
                    name="prettyName"
                    autoFocus
                    label={t('documentPrettynameField.label')}
                    infoLabel={t('documentPrettynameField.infoLabel')}
                    inputProps={{ maxLength: 60 }}
                    sx={{ mt: 3 }}
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
