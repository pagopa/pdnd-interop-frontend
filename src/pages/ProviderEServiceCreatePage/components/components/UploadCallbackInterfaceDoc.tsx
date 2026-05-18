import { useTranslation } from 'react-i18next'
import { DocumentContainer } from '@/components/layout/containers/DocumentContainer'
import type { EServiceDoc } from '@/api/api.generatedTypes'
import { UploadDocumentsInterface } from '@/components/shared/UploadDocumentsInterface'
import { type SubmitHandler } from 'react-hook-form'
import { useEServiceCreateContext } from '../EServiceCreateContext'
import { useInterfaceDocActions } from './useInterfaceDocActions'

type UploadCallbackInterfaceDocFormValues = {
  interfaceDoc: File | null
}

type UploadCallbackInterfaceDocProps = {
  error?: string
  readOnly?: boolean
}

export const UploadCallbackInterfaceDoc: React.FC<UploadCallbackInterfaceDocProps> = ({
  error,
  readOnly = false,
}) => {
  const { t } = useTranslation('eservice', { keyPrefix: 'create.step4.asyncExchangeSection' })
  const { descriptor } = useEServiceCreateContext()
  const actualInterface: EServiceDoc | null = descriptor?.asyncExchangeCallbackInterface ?? null

  const { onUpload, onDelete, onDownload } = useInterfaceDocActions({
    doc: actualInterface,
    kind: 'ASYNC_EXCHANGE_CALLBACK_INTERFACE',
    prettyName: t('callbackInterface.prettyName'),
  })

  const onSubmit: SubmitHandler<UploadCallbackInterfaceDocFormValues> = ({ interfaceDoc }) => {
    if (!interfaceDoc) return
    onUpload(interfaceDoc)
  }

  if (readOnly) {
    if (!actualInterface) return <>-</>
    return (
      <DocumentContainer
        doc={actualInterface}
        onDownload={onDownload}
        size="small"
      />
    )
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

  return (
    <UploadDocumentsInterface
      onSubmit={onSubmit}
      sxBox={{ py: 2 }}
      error={error}
      dropzoneLabel={t('callbackInterface.dropzoneLabel')}
    />
  )
}
