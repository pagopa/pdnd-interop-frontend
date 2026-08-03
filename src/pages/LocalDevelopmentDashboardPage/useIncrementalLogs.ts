import { useRef } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  localDevelopmentLogsSchema,
  type LocalDevelopmentLogs,
} from './localDevelopmentDashboard.schemas'

const logsEndpoint = '/__local-dashboard/api/logs'
const maxCachedEntries = 500

const getLogs = async (
  query: string,
  source: string,
  level: string,
  service: string,
  cursors?: Record<string, number>
) => {
  const parameters = new URLSearchParams({ limit: '500' })
  if (query) parameters.set('query', query)
  if (source) parameters.set('source', source)
  if (level) parameters.set('level', level)
  if (service) parameters.set('service', service)
  if (cursors && Object.keys(cursors).length > 0) {
    parameters.set('cursors', JSON.stringify(cursors))
  }

  const response = await fetch(`${logsEndpoint}?${parameters}`)
  if (!response.ok) throw new Error(`Log request failed with ${response.status}`)
  return localDevelopmentLogsSchema.parse(await response.json())
}

const mergeLogs = (
  previous: LocalDevelopmentLogs | undefined,
  incoming: LocalDevelopmentLogs
): LocalDevelopmentLogs => {
  if (!previous) return incoming

  const resetSources = new Set(incoming.resetSources)
  const incomingKeys = new Set(incoming.results.map(({ source, offset }) => `${source}:${offset}`))
  const retainedResults = previous.results.filter(
    ({ source, offset }) => !resetSources.has(source) && !incomingKeys.has(`${source}:${offset}`)
  )

  return {
    ...incoming,
    results: [...incoming.results, ...retainedResults].slice(0, maxCachedEntries),
  }
}

export const useIncrementalLogs = (
  query: string,
  source: string,
  level: string,
  service: string
) => {
  const filterKey = JSON.stringify([query, source, level, service])
  const cacheRef = useRef<{
    filterKey: string
    data: LocalDevelopmentLogs | undefined
  }>({ filterKey, data: undefined })

  if (cacheRef.current.filterKey !== filterKey) {
    cacheRef.current = { filterKey, data: undefined }
  }

  return useQuery({
    queryKey: ['local-development-dashboard', 'logs', query, source, level, service],
    queryFn: async () => {
      const cachedData =
        cacheRef.current.filterKey === filterKey ? cacheRef.current.data : undefined
      const incoming = await getLogs(query, source, level, service, cachedData?.cursors)
      const merged = mergeLogs(cachedData, incoming)

      if (cacheRef.current.filterKey === filterKey) {
        cacheRef.current.data = merged
      }

      return merged
    },
    refetchInterval: 3_000,
    gcTime: 0,
  })
}
