import type { Purpose } from '@/api/api.generatedTypes'
import type { RouteKey } from '@/router'
import type { AlertProps } from '@mui/material'
import type { Link } from '@/router'
import { useTranslation } from 'react-i18next'
import type React from 'react'

function useGetPurposeStateAlertProps(purpose: Purpose | undefined):
  | {
      severity: AlertProps['severity']
      content: AlertProps['children']
      link?: {
        to: RouteKey
        params?: React.ComponentProps<typeof Link>['params']
        options?: React.ComponentProps<typeof Link>['options']
      }
      variant: AlertProps['variant']
    }
  | undefined {
  const { t } = useTranslation('purpose', { keyPrefix: 'consumerView' })

  if (!purpose) return undefined

  const isPurposeSuspended = purpose.currentVersion?.state === 'SUSPENDED'
  const isFirstVersionPending =
    Boolean(purpose.waitingForApprovalVersion) && Boolean(!purpose.currentVersion)
  const isPurposeActive = purpose.currentVersion?.state === 'ACTIVE'
  const isPurposeArchived = purpose.currentVersion?.state === 'ARCHIVED'
  const isPurposeRejected = Boolean(purpose.rejectedVersion)

  if (isPurposeSuspended) {
    return {
      severity: 'error',
      content: t('suspendedAlert'),
      variant: 'standard',
    }
  }

  if (isFirstVersionPending) {
    return {
      severity: 'warning',
      content: t('waitingForApprovalAlert'),
      variant: 'standard',
    }
  }

  if (isPurposeArchived) {
    return {
      severity: 'info',
      content: t('archivedPurposeAlert'),
      variant: 'standard',
      link: {
        to: 'SUBSCRIBE_PURPOSE_CREATE',
      },
    }
  }

  if (isPurposeRejected && purpose.currentVersion) {
    return {
      severity: 'info',
      content: t('rejectedUpdatePlanInfoAlert'),
      variant: 'standard',
      link: {
        to: 'SUBSCRIBE_PURPOSE_DETAILS',
        params: { purposeId: purpose.id },
        options: {
          urlParams: {
            tab: 'details',
          },
        },
      },
    }
  }

  if (isPurposeRejected && !purpose.currentVersion) {
    return {
      severity: 'error',
      content: t('rejectedPurposeAlert'),
      variant: 'outlined',
    }
  }

  if (isPurposeActive && purpose.clients.length === 0) {
    return {
      severity: 'info',
      content: t('noClientsAlert'),
      variant: 'standard',
      link: {
        to: 'SUBSCRIBE_PURPOSE_DETAILS',
        params: { purposeId: purpose.id },
        options: {
          urlParams: {
            tab: 'clients',
          },
        },
      },
    }
  }

  return undefined
}

export default useGetPurposeStateAlertProps
