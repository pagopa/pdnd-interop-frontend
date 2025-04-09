import type { Document } from '@/api/api.generatedTypes'
import { Drawer } from '@/components/shared/Drawer'
import { Box, Button, Divider, Stack, Tooltip, Typography } from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { DocumentContainer } from '@/components/layout/containers/DocumentContainer'
import { getDownloadDocumentName } from '@/utils/eservice.utils'
import { FormProvider, useForm } from 'react-hook-form'
import { RHFSingleFileInput, RHFTextField } from '@/components/shared/react-hook-form-inputs'
import UploadFileIcon from '@mui/icons-material/UploadFile'
import AddIcon from '@mui/icons-material/Add'
import DownloadIcon from '@mui/icons-material/Download'
import InfoIcon from '@mui/icons-material/Info'
import CloseIcon from '@mui/icons-material/Close'
import { Pagination, usePagination } from '@pagopa/interop-fe-commons'
import { TemplateMutations } from '@/api/template'
import { TemplateDownloads } from '@/api/template/template.downloads'

type EServiceTemplateCreateStepDocumentsDocFormValues = {
  doc: File | null
  prettyName: string
}

const defaultValues: EServiceTemplateCreateStepDocumentsDocFormValues = {
  doc: null,
  prettyName: '',
}

type EServiceTemplateUpdateDocumentationDrawerProps = {
  isOpen: boolean
  onClose: VoidFunction
  templateId: string
  templateVersionId: string
  interfaceDocs?: Document
  templateDocs: Document[]
}

export const EServiceTemplateUpdateDocumentationDrawer: React.FC<
  EServiceTemplateUpdateDocumentationDrawerProps
> = ({ isOpen, onClose, templateId, templateVersionId, interfaceDocs, templateDocs }) => {
  const { t } = useTranslation('template', { keyPrefix: 'read.drawers.updateDocumentationDrawer' })
  const { t: tCommon } = useTranslation('common')

  const { mutate: uploadDocument } = TemplateMutations.usePostVersionDraftDocument()
  const { mutate: deleteDocument } = TemplateMutations.useDeleteVersionDraftDocument()
  const { mutate: updateDocumentName } =
    TemplateMutations.useUpdateVersionDraftDocumentDescription()
  const downloadDocument = TemplateDownloads.useDownloadVersionDocument()

  const [showWriteDocInput, setShowWriteDocInput] = React.useState(false)

  const docs = [interfaceDocs, ...templateDocs]

  const { paginationParams, paginationProps, getTotalPageCount } = usePagination({ limit: 3 })

  const paginatedDocs = docs.slice(
    paginationParams.offset,
    paginationParams.offset + paginationParams.limit
  )

  const handleShowFileInput = () => {
    setShowWriteDocInput(true)
  }
  const handleHideFileInput = () => {
    setShowWriteDocInput(false)
  }

  const formMethods = useForm({
    defaultValues,
    shouldUnregister: true,
  })

  const onSubmit = ({ doc, prettyName }: EServiceTemplateCreateStepDocumentsDocFormValues) => {
    if (!doc) return

    // the current total page number (before uploading the new doc)
    const totalPages = getTotalPageCount(docs.length)

    // check if the upload of a new doc will create a new page
    const isNewPageAdded = docs.length % paginationParams.limit === 0

    // check if the current page is the last one
    const isNotInLastPage = paginationProps.pageNum !== totalPages

    uploadDocument(
      {
        eServiceTemplateId: templateId,
        eServiceTemplateVersionId: templateVersionId,
        prettyName,
        kind: 'DOCUMENT',
        doc,
      },
      {
        onSuccess: () => {
          // if there is a new page added we should go to the new created page where the new doc will be visible
          if (isNewPageAdded) paginationProps.onPageChange(totalPages + 1)

          // if there is not a new page added and we are not in the last page we should go to the last page where the new doc will be visible
          if (isNotInLastPage && !isNewPageAdded) paginationProps.onPageChange(totalPages)

          handleHideFileInput()
        },
      }
    )
  }

  const handleDeleteDocument = (document: Document) => {
    //if (!descriptor) return
    // check if the only document in the current page, that means we should go to the previous page when this is deleted
    const isTheOnlyDocumentInCurrentPage = paginatedDocs.length === 1
    deleteDocument(
      {
        eServiceTemplateId: templateId,
        eServiceTemplateVersionId: templateVersionId,
        documentId: document.id,
      },
      {
        onSuccess: () => {
          // we check also that the pageNum is greater than the first page, otherwise we stay in the first page
          if (isTheOnlyDocumentInCurrentPage && paginationProps.pageNum > 1) {
            paginationProps.onPageChange(paginationProps.pageNum - 1)
          }
        },
      }
    )
  }

  const handleUpdateDescription = (documentId: string, prettyName: string) => {
    //if (!descriptor) return
    updateDocumentName({
      eServiceTemplateId: templateId,
      eServiceTemplateVersionId: templateVersionId,
      documentId,
      prettyName,
    })
  }

  const handleDownloadDocument = (document: Document) => {
    downloadDocument(
      {
        eServiceTemplateId: templateId,
        eServiceTemplateVersionId: templateVersionId,
        documentId: document.id,
      },
      getDownloadDocumentName(document)
    )
  }

  const handleCloseDrawer = () => {
    onClose()
  }

  const handleTransitionExited = () => {
    setShowWriteDocInput(false)
    paginationProps.onPageChange(1)
    formMethods.reset(defaultValues)
  }

  return (
    <Drawer
      isOpen={isOpen}
      onClose={handleCloseDrawer}
      title={t('title')}
      subtitle={t('subtitle')}
      onTransitionExited={handleTransitionExited}
    >
      <Stack spacing={4} pb={4}>
        {paginatedDocs.map((doc, index) => {
          if (!doc) return null
          if (index === 0 && paginationParams.offset === 0)
            return (
              <Stack spacing={1}>
                <InterfaceDocumentContainer doc={doc} onDownload={handleDownloadDocument} />
                <Divider />
              </Stack>
            )
          return (
            <DocumentContainer
              key={doc.id}
              doc={doc}
              onDelete={handleDeleteDocument}
              onDownload={handleDownloadDocument}
              onUpdateDescription={handleUpdateDescription.bind(null, doc.id)}
              isDrawerStyle={true}
            />
          )
        })}
        <Pagination
          {...paginationProps}
          totalPages={getTotalPageCount(docs.length)}
          justifyContent="center"
          alignItems="flex-end"
          flexGrow={1}
        />
      </Stack>

      {showWriteDocInput ? (
        <FormProvider {...formMethods}>
          <Box
            component="form"
            noValidate
            onSubmit={formMethods.handleSubmit(onSubmit)}
            bgcolor="common.white"
          >
            <Typography variant="body2" fontWeight={700} pb={2}>
              {t('addDocumentLabel')}
            </Typography>

            <RHFSingleFileInput sx={{ my: 0 }} name="doc" rules={{ required: true }} drawerStyle />

            <RHFTextField
              size="small"
              sx={{ my: 2 }}
              name="prettyName"
              label={t('nameField.label')}
              inputProps={{ maxLength: 60 }}
              rules={{ required: true, minLength: 5 }}
            />

            <Stack direction="row" justifyContent="flex-end" spacing={1} mb={2}>
              <Button variant="text" onClick={handleHideFileInput} size="small">
                <CloseIcon fontSize="small" sx={{ mr: 1 }} /> {tCommon('actions.cancel')}
              </Button>
              <Button type="submit" variant="contained" size="small">
                <UploadFileIcon fontSize="small" sx={{ mr: 1 }} /> {tCommon('actions.upload')}
              </Button>
            </Stack>
          </Box>
        </FormProvider>
      ) : (
        <Button
          startIcon={<AddIcon fontSize="small" />}
          size="small"
          variant="naked"
          onClick={handleShowFileInput}
        >
          {t('addDocumentLabel')}
        </Button>
      )}
    </Drawer>
  )
}

type InterfaceDocumentContainerProps = {
  doc: Document
  onDownload?: (document: Document) => void
}

const InterfaceDocumentContainer: React.FC<InterfaceDocumentContainerProps> = ({
  doc,
  onDownload,
}) => {
  const { t } = useTranslation('eservice', { keyPrefix: 'read.drawers.updateDocumentationDrawer' })
  const { t: tCommon } = useTranslation('common')

  return (
    <Stack direction="row" justifyContent="space-between" alignItems="center">
      <Stack direction="row" alignItems="center" spacing={1}>
        <Typography variant="body2">{doc.prettyName}</Typography>
        <Tooltip title={t('interfaceInfoTooltip')}>
          <InfoIcon fontSize="small" sx={{ color: 'text.secondary' }} />
        </Tooltip>
      </Stack>
      {onDownload && (
        <Tooltip title={t('downloadDocumentTooltip')}>
          <Button
            sx={{ p: 1 }}
            onClick={onDownload.bind(null, doc)}
            variant={'naked'}
            size="small"
            startIcon={<DownloadIcon fontSize="small" />}
          >
            {tCommon('actions.download')}
          </Button>
        </Tooltip>
      )}
    </Stack>
  )
}
