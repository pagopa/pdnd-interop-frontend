import { useQueryWrapper } from '@/api/react-query-wrappers'
import { INTEROP_RESOURCES_BASE_URL } from '@/config/env'
import axios from 'axios'
import { useCallback, useState } from 'react'
import differenceInHours from 'date-fns/differenceInHours'
import isWithinInterval from 'date-fns/isWithinInterval'
import type { UseQueryWrapperOptions } from '@/api/react-query-wrappers/react-query-wrappers.types'
import { useQuery } from '@tanstack/react-query'

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

export function useGetMaintenanceJson(config?: UseQueryWrapperOptions<MaintenanceData>) {
  return useQuery(['Maintenance json'], () => getMaintenanceJson(), config)
}

export function useMaintenanceBanner(data: MaintenanceData | undefined) {
  const maintenanceStartString = `${data?.start.date} ${data?.start.time}`
  const maintenanceEndString = `${data?.end.date} ${data?.end.time}`

  const maintenanceStart = Date.parse(maintenanceStartString)
  const maintenanceEnd = Date.parse(maintenanceEndString)

  // const openBanner = useCallback(() => {
  //   if (data && data.start && data.end) {
  //     const lastMaintenanceViewed = window.localStorage.getItem('lastMaintenanceViewed')
  //     if (lastMaintenanceViewed && lastMaintenanceViewed === maintenanceEndString) {
  //       console.log('La stringa di maintenance è già presente')
  //       return false
  //     }
  //     const now = Date.now()
  //     const interval: Interval = { start: maintenanceStart, end: maintenanceEnd }
  //     console.log("Verifichiamo che now sia dentro l'intervallo", !isWithinInterval(now, interval))
  //     return /* isWithinInterval(now, interval) */ !isWithinInterval(now, interval)
  //   }
  //   console.log('Non ci sono i data')
  //   return false
  // }, [data, maintenanceEnd, maintenanceEndString, maintenanceStart])

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
        console.log('La stringa di maintenance è già presente')
        setIsOpen(false)
        return
      }
      const now = Date.now()
      const interval: Interval = { start: maintenanceStart, end: maintenanceEnd }
      console.log("Verifichiamo che now sia dentro l'intervallo", !isWithinInterval(now, interval))
      /* isWithinInterval(now, interval) */ setIsOpen(!isWithinInterval(now, interval))
      return
    }
    console.log('Non ci sono i data')
    setIsOpen(false)
  }, [data, maintenanceEnd, maintenanceEndString, maintenanceStart])

  console.log('BBBBBBBBBBBBBBBBBBB', isOpen)

  return { isSingleOrMultipleDays, isOpen, closeBanner, durationInHours, openBanner }
}
