import React, { useCallback, useState } from 'react'
import differenceInHours from 'date-fns/differenceInHours'
import { useTranslation } from 'react-i18next'
import { useGetMaintenanceJson } from '@/api/maintenance'
import isBefore from 'date-fns/isBefore'
import { PAGOPA_ENV } from '@/config/env'

export type MaintenanceData = {
  start: { date: string; time: string }
  end: { date: string; time: string }
}

const singleDateFormatter = new Intl.DateTimeFormat('it', {
  day: '2-digit',
  month: '2-digit',
})
const multipleDateFormatter = new Intl.DateTimeFormat('it', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
})

function formatDateString(dateString: string | undefined, type: 'single' | 'multiple') {
  if (dateString === undefined) return ''
  if (type === 'single') {
    return singleDateFormatter.format(new Date(dateString))
  }
  if (type === 'multiple') {
    return multipleDateFormatter.format(new Date(dateString))
  }
}

export function useMaintenanceBanner() {
  const { t } = useTranslation('shared-components', {
    keyPrefix: 'maintenanceBanner',
  })
  const { data } = useGetMaintenanceJson()

  const maintenanceStartString = `${data?.start?.date} ${data?.start?.time}`
  const maintenanceEndString = `${data?.end?.date} ${data?.end?.time}`

  const maintenanceStart = Date.parse(maintenanceStartString)
  const maintenanceEnd = Date.parse(maintenanceEndString)

  const [isOpen, setIsOpen] = useState<boolean>(false)

  const durationInHours = differenceInHours(maintenanceEnd, maintenanceStart)
  const isSingleOrMultipleDays = durationInHours <= 24 ? 'single' : 'multiple'

  const closeBanner = useCallback(() => {
    setIsOpen(false)

    window.localStorage.setItem('lastMaintenanceViewed', maintenanceEndString)
  }, [maintenanceEndString])

  const openBanner = useCallback(() => {
    if (data && data.start && data.end) {
      const lastMaintenanceViewed = window.localStorage.getItem('lastMaintenanceViewed')
      if (lastMaintenanceViewed && lastMaintenanceViewed === maintenanceEndString) {
        setIsOpen(false)
        return
      }
      const now = Date.now()
      setIsOpen(isBefore(now, maintenanceEnd))
      return
    }
    setIsOpen(false)
  }, [data, maintenanceEnd, maintenanceEndString])

  React.useEffect(() => {
    if (data) {
      openBanner()
    }
  }, [data, openBanner])

  const text =
    isSingleOrMultipleDays === 'single'
      ? t('bodySingleDay', {
          maintenanceStartDay: formatDateString(data?.start?.date, 'single'),
          maintenanceStartHour: data?.start?.time,
          hoursDuration: durationInHours,
        })
      : t('bodyMultipleDay', {
          maintenanceStartHour: data?.start?.time,
          maintenanceStartDay: formatDateString(data?.start?.date, 'multiple'),
          maintenanceEndHour: data?.end?.time,
          maintenanceEndDay: formatDateString(data?.end?.date, 'multiple'),
        })

  const title = PAGOPA_ENV && PAGOPA_ENV.STAGE === 'PROD' ? t('titleProdEnv') : t('titleTestEnv')

  return { title, text, isOpen, closeBanner }
}
