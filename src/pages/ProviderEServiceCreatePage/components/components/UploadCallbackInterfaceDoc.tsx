import { useTranslation } from 'react-i18next'
import { match, P } from 'ts-pattern'
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
  onBeforeUpload?: () => boolean | Promise<boolean>
  readOnly?: boolean
}

export const UploadCallbackInterfaceDoc: React.FC<UploadCallbackInterfaceDocProps> = ({
  error,
  onBeforeUpload,
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

  const onSubmit: SubmitHandler<UploadCallbackInterfaceDocFormValues> = async ({
    interfaceDoc,
  }) => {
    if (!interfaceDoc) return
    const canUpload = onBeforeUpload ? await onBeforeUpload() : true
    if (!canUpload) return

    onUpload(interfaceDoc)
  }

  return match({ readOnly, actualInterface })
    .with({ readOnly: true, actualInterface: null }, () => <>-</>)
    .with({ readOnly: true, actualInterface: P.not(null) }, ({ actualInterface }) => (
      <DocumentContainer doc={actualInterface} onDownload={onDownload} size="small" />
    ))
    .with({ readOnly: false, actualInterface: null }, () => (
      <UploadDocumentsInterface
        onSubmit={onSubmit}
        sxBox={{ py: 2 }}
        error={error}
        dropzoneLabel={t('callbackInterface.dropzoneLabel')}
      />
    ))
    .with({ readOnly: false, actualInterface: P.not(null) }, ({ actualInterface }) => (
      <DocumentContainer
        sx={{ mt: 4 }}
        doc={actualInterface}
        onDelete={onDelete}
        onDownload={onDownload}
        size="small"
      />
    ))
    .exhaustive()
}
