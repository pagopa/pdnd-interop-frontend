import { useTranslation } from 'react-i18next'
import { DocumentContainer } from '@/components/layout/containers/DocumentContainer'
import type { EServiceDoc } from '@/api/api.generatedTypes'
import { UploadDocumentsInterface } from '@/components/shared/UploadDocumentsInterface'
import { type SubmitHandler } from 'react-hook-form'
import { useEServiceCreateContext } from '../EServiceCreateContext'
import { useInterfaceDocActions } from './useInterfaceDocActions'

type UploadInterfaceDocFormValues = {
  interfaceDoc: File | null
}

type UploadInterfaceDocProps = {
  error?: string
}

export const UploadInterfaceDoc: React.FC<UploadInterfaceDocProps> = ({ error }) => {
  const { t } = useTranslation('eservice')
  const { descriptor } = useEServiceCreateContext()
  const actualInterface: EServiceDoc | null = descriptor?.interface ?? null

  const { onUpload, onDelete, onDownload } = useInterfaceDocActions({
    doc: actualInterface,
    kind: 'INTERFACE',
    prettyName: t('create.step4.interface.prettyName'),
  })

  const onSubmit: SubmitHandler<UploadInterfaceDocFormValues> = ({ interfaceDoc }) => {
    if (!interfaceDoc) return
    onUpload(interfaceDoc)
  }

  if (actualInterface) {
    return (
      <DocumentContainer
        sx={{ mt: 4 }}
        doc={actualInterface}
        onDelete={onDelete}
        onDownload={onDownload}
        size="small"
      />
    )
  }

  return <UploadDocumentsInterface onSubmit={onSubmit} sxBox={{ py: 2 }} error={error} />
}
