import { useTranslation } from 'react-i18next'
import { DocumentContainer } from '@/components/layout/containers/DocumentContainer'
import { EServiceDownloads, EServiceMutations } from '@/api/eservice'
import { getDownloadDocumentName } from '@/utils/eservice.utils'
import type { CreateEServiceDocumentPayload, EServiceDoc } from '@/api/api.generatedTypes'
import { AuthHooks } from '@/api/auth'
import { UploadDocumentsInterface } from '@/components/shared/UploadDocumentsInterface'
import { type SubmitHandler } from 'react-hook-form'
import { useEServiceCreateContext } from '../EServiceCreateContext'

type UploadCallbackInterfaceDocFormValues = {
  interfaceDoc: File | null
}

type UploadCallbackInterfaceDocProps = {
  error?: string
}

export const UploadCallbackInterfaceDoc: React.FC<UploadCallbackInterfaceDocProps> = ({
  error,
}) => {
  const { t } = useTranslation('eservice', { keyPrefix: 'create.step4.asyncExchangeSection' })
  const { descriptor } = useEServiceCreateContext()
  const downloadDocument = EServiceDownloads.useDownloadVersionDocument()
  const { mutate: deleteDocument } = EServiceMutations.useDeleteVersionDraftDocument()
  const { mutate: uploadDocument } = EServiceMutations.usePostVersionDraftDocument()
  const { jwt } = AuthHooks.useJwt()
  const actualInterface: EServiceDoc | null = descriptor?.asyncExchangeCallbackInterface ?? null

  const onSubmit: SubmitHandler<UploadCallbackInterfaceDocFormValues> = ({ interfaceDoc }) => {
    if (!interfaceDoc || !descriptor) return

    const prettyName = t('callbackInterface.prettyName')

    uploadDocument({
      eserviceId: descriptor.eservice.id,
      descriptorId: descriptor.id,
      doc: interfaceDoc,
      prettyName: `${prettyName}_${descriptor.eservice.name}_${jwt?.organization.name}_v${descriptor.version}`,
      // TODO: rimuovere il cast quando l'OpenAPI esporrà il kind ASYNC_EXCHANGE_CALLBACK_INTERFACE
      kind: 'ASYNC_EXCHANGE_CALLBACK_INTERFACE' as CreateEServiceDocumentPayload['kind'],
    })
  }

  const handleDeleteInterface = () => {
    if (!actualInterface || !descriptor) return
    deleteDocument({
      eserviceId: descriptor.eservice.id,
      descriptorId: descriptor.id,
      documentId: actualInterface.id,
    })
  }

  const handleDownloadInterface = () => {
    if (!actualInterface || !descriptor) return
    downloadDocument(
      {
        eserviceId: descriptor.eservice.id,
        descriptorId: descriptor.id,
        documentId: actualInterface.id,
      },
      getDownloadDocumentName(actualInterface)
    )
  }

  if (actualInterface) {
    return (
      <DocumentContainer
        sx={{ mt: 4 }}
        doc={actualInterface}
        onDelete={handleDeleteInterface}
        onDownload={handleDownloadInterface}
        size="small"
      />
    )
  }

  return (
    <UploadDocumentsInterface
      onSubmit={onSubmit}
      sxBox={{ py: 2 }}
      error={error}
      dropzoneLabel={t('callbackInterface.dropzoneLabel')}
    />
  )
}
