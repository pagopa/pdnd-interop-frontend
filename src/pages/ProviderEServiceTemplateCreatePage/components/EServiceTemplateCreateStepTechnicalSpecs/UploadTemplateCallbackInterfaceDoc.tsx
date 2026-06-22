import { EServiceTemplateDownloads } from '@/api/eserviceTemplate/eserviceTemplate.downloads'
import { EServiceTemplateMutations } from '@/api/eserviceTemplate'
import type { EServiceDoc } from '@/api/api.generatedTypes'
import { DocumentContainer } from '@/components/layout/containers/DocumentContainer'
import { UploadDocumentsInterface } from '@/components/shared/UploadDocumentsInterface'
import { getDownloadDocumentName } from '@/utils/eservice.utils'
import { type SubmitHandler } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { match, P } from 'ts-pattern'
import { useEServiceTemplateCreateContext } from '../ProviderEServiceTemplateContext'

type UploadTemplateCallbackInterfaceDocFormValues = {
  interfaceDoc: File | null
}

export const UploadTemplateCallbackInterfaceDoc: React.FC = () => {
  const { t } = useTranslation('eserviceTemplate', {
    keyPrefix: 'create.step3.technicalSpecs.asyncExchangeSection',
  })
  const { eserviceTemplateVersion } = useEServiceTemplateCreateContext()

  const downloadDocument = EServiceTemplateDownloads.useDownloadVersionDocument()
  const { mutate: deleteDocument } = EServiceTemplateMutations.useDeleteVersionDraftDocument()
  const { mutate: uploadDocument } = EServiceTemplateMutations.usePostVersionDraftDocument()

  const actualInterface: EServiceDoc | null =
    eserviceTemplateVersion?.asyncExchangeCallbackInterface ?? null

  const onSubmit: SubmitHandler<UploadTemplateCallbackInterfaceDocFormValues> = ({
    interfaceDoc,
  }) => {
    if (!interfaceDoc || !eserviceTemplateVersion) return

    uploadDocument({
      eServiceTemplateId: eserviceTemplateVersion.eserviceTemplate.id,
      eServiceTemplateVersionId: eserviceTemplateVersion.id,
      doc: interfaceDoc,
      prettyName: t('callbackInterface.prettyName'),
      kind: 'ASYNC_EXCHANGE_CALLBACK_INTERFACE',
    })
  }

  const handleDeleteInterface = () => {
    if (!actualInterface || !eserviceTemplateVersion) return

    deleteDocument({
      eServiceTemplateId: eserviceTemplateVersion.eserviceTemplate.id,
      eServiceTemplateVersionId: eserviceTemplateVersion.id,
      documentId: actualInterface.id,
    })
  }

  const handleDownloadInterface = () => {
    if (!actualInterface || !eserviceTemplateVersion) return

    downloadDocument(
      {
        eServiceTemplateId: eserviceTemplateVersion.eserviceTemplate.id,
        eServiceTemplateVersionId: eserviceTemplateVersion.id,
        documentId: actualInterface.id,
      },
      getDownloadDocumentName(actualInterface)
    )
  }

  return match(actualInterface)
    .with(null, () => (
      <UploadDocumentsInterface
        onSubmit={onSubmit}
        sxBox={{ py: 2 }}
        dropzoneLabel={t('callbackInterface.dropzoneLabel')}
      />
    ))
    .with(P.not(null), (actualInterface) => (
      <DocumentContainer
        sx={{ mt: 4 }}
        doc={actualInterface}
        onDelete={handleDeleteInterface}
        onDownload={handleDownloadInterface}
        size="small"
      />
    ))
    .exhaustive()
}
