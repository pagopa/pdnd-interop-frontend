import { INTEROP_RESOURCES_BASE_URL } from '@/config/env'
import axios from 'axios'
import React, { useCallback, useState } from 'react'
import differenceInHours from 'date-fns/differenceInHours'
import isWithinInterval from 'date-fns/isWithinInterval'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'

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

export type MaintenanceData = {
  start: { date: string; time: string }
  end: { date: string; time: string }
}

async function getMaintenanceJson() {
  const response = await axios.get<MaintenanceData>(
    `${INTEROP_RESOURCES_BASE_URL}/maintenance-window/data.json`
  )
  return response.data
}

export function useGetMaintenanceJson() {
  return useQuery(['Maintenance json'], getMaintenanceJson, {
    suspense: false,
    useErrorBoundary: false,
    retry: false,
    staleTime: Infinity,
    cacheTime: Infinity,
  })
}

export function useMaintenanceBanner() {
  const { t } = useTranslation('shared-components', {
    keyPrefix: 'maintenanceBanner',
  })
  const { data } = useGetMaintenanceJson()

  const maintenanceStartString = `${data?.start.date} ${data?.start.time}`
  const maintenanceEndString = `${data?.end.date} ${data?.end.time}`

  const maintenanceStart = Date.parse(maintenanceStartString)
  const maintenanceEnd = Date.parse(maintenanceEndString)

  const [isOpen, setIsOpen] = useState<boolean>()

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
      const interval: Interval = { start: maintenanceStart, end: maintenanceEnd }
      /* isWithinInterval(now, interval) */ setIsOpen(!isWithinInterval(now, interval))
      return
    }
    setIsOpen(false)
  }, [data, maintenanceEnd, maintenanceEndString, maintenanceStart])

  React.useEffect(() => {
    if (data) {
      openBanner()
    }
  }, [data, openBanner])

  const text =
    isSingleOrMultipleDays === 'single'
      ? t('bodySingleDay', {
          maintenanceStartDay: formatDateString(data?.start.date, 'single'),
          maintenanceStartHour: data?.start.time,
          hoursDuration: durationInHours,
        })
      : t('bodyMultipleDay', {
          maintenanceStartHour: data?.start.time,
          maintenanceStartDay: formatDateString(data?.start.date, 'multiple'),
          maintenanceEndHour: data?.end.time,
          maintenanceEndDay: formatDateString(data?.end.date, 'multiple'),
        })

  return { text, isOpen, closeBanner }
}
