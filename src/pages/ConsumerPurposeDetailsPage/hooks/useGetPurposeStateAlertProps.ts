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
    }
  | undefined {
  const { t } = useTranslation('purpose', { keyPrefix: 'consumerView' })

  if (!purpose) return undefined

  const isPurposeSuspended = purpose.currentVersion?.state === 'SUSPENDED'
  const isFirstVersionPending =
    Boolean(purpose.waitingForApprovalVersion) && Boolean(!purpose.currentVersion)
  const isPurposeActive = purpose.currentVersion?.state === 'ACTIVE'
  const isPurposeArchived = purpose.currentVersion?.state === 'ARCHIVED'

  if (isPurposeSuspended) {
    return {
      severity: 'error',
      content: t('suspendedAlert'),
    }
  }

  if (isFirstVersionPending) {
    return {
      severity: 'warning',
      content: t('waitingForApprovalAlert'),
    }
  }

  if (isPurposeArchived) {
    return {
      severity: 'info',
      content: t('archivedPurposeAlert'),
      link: {
        to: 'SUBSCRIBE_PURPOSE_CREATE',
      },
    }
  }

  if (isPurposeActive && purpose.clients.length === 0) {
    return {
      severity: 'info',
      content: t('noClientsAlert'),
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
