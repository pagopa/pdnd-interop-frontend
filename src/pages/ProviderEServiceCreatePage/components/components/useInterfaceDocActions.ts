import { EServiceDownloads, EServiceMutations } from '@/api/eservice'
import { AuthHooks } from '@/api/auth'
import { getDownloadDocumentName } from '@/utils/eservice.utils'
import type { EServiceDoc } from '@/api/api.generatedTypes'
import { useEServiceCreateContext } from '../EServiceCreateContext'

type InterfaceDocKind = 'INTERFACE' | 'ASYNC_EXCHANGE_CALLBACK_INTERFACE'

type UseInterfaceDocActionsParams = {
  doc: EServiceDoc | null
  kind: InterfaceDocKind
  prettyName: string
}

export const useInterfaceDocActions = ({
  doc,
  kind,
  prettyName,
}: UseInterfaceDocActionsParams) => {
  const { descriptor } = useEServiceCreateContext()
  const downloadDocument = EServiceDownloads.useDownloadVersionDocument()
  const { mutate: deleteDocument } = EServiceMutations.useDeleteVersionDraftDocument()
  const { mutate: uploadDocument } = EServiceMutations.usePostVersionDraftDocument()
  const { jwt } = AuthHooks.useJwt()

  const onUpload = (file: File) => {
    if (!descriptor) return
    uploadDocument({
      eserviceId: descriptor.eservice.id,
      descriptorId: descriptor.id,
      doc: file,
      prettyName: `${prettyName}_${descriptor.eservice.name}_${jwt?.organization.name}_v${descriptor.version}`,
      kind,
    })
  }

  const onDelete = () => {
    if (!doc || !descriptor) return
    deleteDocument({
      eserviceId: descriptor.eservice.id,
      descriptorId: descriptor.id,
      documentId: doc.id,
    })
  }

  const onDownload = () => {
    if (!doc || !descriptor) return
    downloadDocument(
      {
        eserviceId: descriptor.eservice.id,
        descriptorId: descriptor.id,
        documentId: doc.id,
      },
      getDownloadDocumentName(doc)
    )
  }

  return { onUpload, onDelete, onDownload }
}
