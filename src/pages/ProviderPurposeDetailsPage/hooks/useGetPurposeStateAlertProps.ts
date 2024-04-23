import type { Purpose } from '@/api/api.generatedTypes'
import type { AlertProps } from '@mui/material'
import { useTranslation } from 'react-i18next'

function useGetPurposeStateAlertProps(purpose: Purpose | undefined):
  | {
      severity: AlertProps['severity']
      content: AlertProps['children']
      variant: AlertProps['variant']
    }
  | undefined {
  const { t } = useTranslation('purpose', { keyPrefix: 'providerView' })

  if (!purpose) return undefined

  const isSuspended = purpose.currentVersion?.state === 'SUSPENDED'
  const isUpgradePending =
    Boolean(purpose.waitingForApprovalVersion) && Boolean(purpose.currentVersion)
  const isArchived = purpose.currentVersion?.state === 'ARCHIVED'
  const isRejected = Boolean(purpose.rejectedVersion)

  if (isSuspended) {
    return {
      severity: 'error',
      content: t('suspendedAlert'),
      variant: 'standard',
    }
  }

  if (isUpgradePending) {
    return {
      severity: 'warning',
      content: t('waitingForApprovalAlert'),
      variant: 'standard',
    }
  }

  if (isArchived) {
    return {
      severity: 'info',
      content: t('archivedPurposeAlert'),
      variant: 'standard',
    }
  }

  if (isRejected && purpose.currentVersion) {
    return {
      severity: 'info',
      content: t('rejectedUpdatePlanInfoAlert'),
      variant: 'standard',
    }
  }

  if (isRejected && !purpose.currentVersion) {
    return {
      severity: 'error',
      content: t('rejectedPurposeAlert'),
      variant: 'outlined',
    }
  }

  return undefined
}

export default useGetPurposeStateAlertProps
