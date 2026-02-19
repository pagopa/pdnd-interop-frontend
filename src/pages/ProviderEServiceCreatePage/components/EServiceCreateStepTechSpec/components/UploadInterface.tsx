import { useTranslation } from 'react-i18next'
import { DocumentContainer } from '@/components/layout/containers/DocumentContainer'
import { EServiceDownloads, EServiceMutations } from '@/api/eservice'
import { getDownloadDocumentName } from '@/utils/eservice.utils'
import type { EServiceDoc } from '@/api/api.generatedTypes'
import { AuthHooks } from '@/api/auth'
import { UploadDocumentsInterface } from '@/components/shared/UploadDocumentsInterface'
import { useEServiceCreateContext } from '../../EServiceCreateContext'
import { type SubmitHandler } from 'react-hook-form'

type UploadInterfaceFormValues = {
  interfaceDoc: File | null
}

export function UploadInterface() {
  const { t } = useTranslation('eservice')
  const { descriptor } = useEServiceCreateContext()
  const downloadDocument = EServiceDownloads.useDownloadVersionDocument()
  const { mutate: deleteDocument } = EServiceMutations.useDeleteVersionDraftDocument()
  const { mutate: uploadDocument } = EServiceMutations.usePostVersionDraftDocument()
  const { jwt } = AuthHooks.useJwt()
  const actualInterface: EServiceDoc | null = descriptor?.interface ?? null

  const onSubmit: SubmitHandler<UploadInterfaceFormValues> = ({ interfaceDoc }) => {
    if (!interfaceDoc || !descriptor) return

    const prettyName = t('create.step4.interface.prettyName')

    uploadDocument({
      eserviceId: descriptor.eservice.id,
      descriptorId: descriptor.id,
      doc: interfaceDoc,
      prettyName: `${prettyName}_${descriptor.eservice.name}_${jwt?.organization.name}_v${descriptor.version}`,
      kind: 'INTERFACE',
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

  return <UploadDocumentsInterface onSubmit={onSubmit} sxBox={{ py: 2 }} />
}
