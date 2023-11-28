import type { Purpose } from '@/api/api.generatedTypes'
import type { AlertProps } from '@mui/material'
import { useTranslation } from 'react-i18next'

function useGetPurposeStateAlertProps(
  purpose: Purpose | undefined
): { severity: AlertProps['severity']; content: AlertProps['children'] } | undefined {
  const { t } = useTranslation('purpose', { keyPrefix: 'providerView' })

  if (!purpose) return undefined

  const isSuspended = purpose.currentVersion?.state === 'SUSPENDED'
  const isUpgradePending =
    Boolean(purpose.waitingForApprovalVersion) && Boolean(purpose.currentVersion)
  const isArchived = purpose.currentVersion?.state === 'ARCHIVED'

  if (isSuspended) {
    return {
      severity: 'error',
      content: t('suspendedAlert'),
    }
  }

  if (isUpgradePending) {
    return {
      severity: 'warning',
      content: t('waitingForApprovalAlert'),
    }
  }

  if (isArchived) {
    return {
      severity: 'info',
      content: t('archivedPurposeAlert'),
    }
  }

  return undefined
}

export default useGetPurposeStateAlertProps
