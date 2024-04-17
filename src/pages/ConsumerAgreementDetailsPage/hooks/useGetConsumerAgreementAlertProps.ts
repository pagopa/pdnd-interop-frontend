import type { Agreement } from '@/api/api.generatedTypes'
import { PurposeQueries } from '@/api/purpose'
import type { Link, RouteKey } from '@/router'
import type { AlertProps } from '@mui/material'
import { useTranslation } from 'react-i18next'

export function useGetConsumerAgreementAlertProps(agreement: Agreement | undefined):
  | {
      severity: AlertProps['severity']
      content: string
      link?: {
        to: RouteKey
        params?: React.ComponentProps<typeof Link>['params']
        options?: React.ComponentProps<typeof Link>['options']
      }
    }
  | undefined {
  const { t } = useTranslation('agreement')

  const { data: purposes } = PurposeQueries.useGetConsumersList(
    {
      limit: 50,
      offset: 0,
      producersIds: [agreement?.producer.id as string],
      eservicesIds: [agreement?.eservice.id as string],
    },
    { suspense: false, enabled: !!agreement && agreement.state === 'ACTIVE' }
  )

  if (!agreement) return undefined

  const suspendedBy = (() => {
    if (agreement.state !== 'SUSPENDED') return undefined
    if (agreement.suspendedByProducer) return 'byProducer'
    if (agreement.suspendedByConsumer) return 'byConsumer'
    if (agreement.suspendedByPlatform) return 'byPlatform'
  })()

  if (suspendedBy) {
    return {
      severity: 'error',
      content: t(`consumerRead.suspendedAlert.${suspendedBy}`),
    }
  }

  if (agreement.state === 'MISSING_CERTIFIED_ATTRIBUTES') {
    return {
      severity: 'warning',
      content: t('consumerRead.missingCertifiedAttributesAlert'),
    }
  }

  const isWithoutPurposes =
    purposes?.results.length === 0 ||
    purposes?.results.every((purpose) => purpose.currentVersion?.state === 'ARCHIVED')

  if (isWithoutPurposes) {
    return {
      severity: 'info',
      content: t('consumerRead.noPurposeAlert'),
      link: {
        to: 'SUBSCRIBE_PURPOSE_CREATE',
      },
    }
  }
}
