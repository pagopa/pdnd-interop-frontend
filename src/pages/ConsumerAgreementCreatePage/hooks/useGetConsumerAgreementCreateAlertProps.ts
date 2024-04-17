import type { Agreement } from '@/api/api.generatedTypes'
import { useDialog } from '@/stores'
import type { AlertProps } from '@mui/material'
import { useTranslation } from 'react-i18next'

export function useGetConsumerAgreementCreateAlertProps(agreement: Agreement | undefined):
  | {
      severity: AlertProps['severity']
      content: string
      action?: VoidFunction
    }
  | undefined {
  const { t } = useTranslation('agreement')

  const { openDialog } = useDialog()

  if (!agreement || agreement.state !== 'DRAFT') return undefined

  const eserviceActiveDescriptor = agreement.eservice.activeDescriptor
  const hasNewEserviceVersion =
    eserviceActiveDescriptor &&
    parseInt(eserviceActiveDescriptor.version, 10) > parseInt(agreement.eservice.version, 10)
  if (hasNewEserviceVersion) {
    return {
      severity: 'warning',
      content: t('edit.newVersionAlert'),
    }
  }

  const hasSetContactEmail = agreement && !!agreement?.consumer.contactMail?.address
  if (!hasSetContactEmail) {
    return {
      severity: 'warning',
      content: t('edit.noContactEmailAlert'),
      action: () => openDialog({ type: 'setTenantMail' }),
    }
  }
}
