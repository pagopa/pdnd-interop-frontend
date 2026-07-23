import React from 'react'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, vi } from 'vitest'
import { queryClient } from '@/config/query-client'
import { renderWithApplicationContext } from '@/utils/testing.utils'
import LocalDevelopmentDashboardPage from '../LocalDevelopmentDashboard.page'

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) =>
      ({
        title: 'Local environment',
        description: 'Inspect local runtime health and logs.',
        openFrontend: 'Open frontend',
        searchLabel: 'Search logs',
        searchPlaceholder: 'Correlation ID, service, error message',
        sourceLabel: 'Source',
        allLogs: 'All logs',
        levelLabel: 'Level',
        allLevels: 'All levels',
        processLabel: 'Process',
        allProcesses: 'All processes',
        startupTitle: 'Startup',
        servicesTitle: 'Services',
        processesTab: 'Processes',
        infrastructureTab: 'Docker',
        serviceColumn: 'Service',
        stateColumn: 'State',
        portColumn: 'Port',
        pidColumn: 'PID',
        logsTitle: 'Logs',
        noLogs: 'No matching log lines',
        lines: 'lines',
        copyFilteredLogs: 'Copy filtered logs',
        filteredLogsCopied: 'Logs copied',
        clearLogFilters: 'Clear filters',
        degradedTitle: 'Why the environment is degraded',
        degradedDescription: 'These runtime checks require attention:',
        sessionDiagnostic: 'Session',
        processDiagnostic: 'Process',
        infrastructureDiagnostic: 'Docker service',
        'states.stopped': 'Stopped',
      })[key] ?? key,
  }),
}))

vi.mock('i18next', () => ({
  default: { addResourceBundle: vi.fn() },
}))

vi.mock('@tanstack/react-virtual', () => ({
  useVirtualizer: ({ count }: { count: number }) => ({
    getTotalSize: () => count * 92,
    getVirtualItems: () =>
      Array.from({ length: Math.min(count, 20) }, (_, index) => ({
        index,
        key: index,
        start: index * 92,
      })),
    measureElement: vi.fn(),
  }),
}))

const statusResponse = {
  timestamp: '2026-07-22T13:43:10.058Z',
  overall: 'ready',
  startup: {
    state: 'ready',
    checks: [
      { id: 'infrastructure', label: 'Infrastructure', state: 'passed' },
      { id: 'backend', label: 'Backend', state: 'passed' },
    ],
  },
  sessions: [{ name: 'interop-backend', state: 'running' }],
  processes: [
    { name: 'pagopa-interop-catalog-process', pid: 120, port: 3000, state: 'running' },
    { name: 'pagopa-interop-backend-for-frontend', pid: 121, port: 3600, state: 'running' },
  ],
  infrastructure: [
    { name: 'kafka', container: 'interop-kafka-1', state: 'running', health: 'healthy' },
  ],
  logs: [
    { source: 'backend', size: 100, updatedAt: '2026-07-22T13:43:10.058Z' },
    { source: 'frontend', size: 100, updatedAt: '2026-07-22T13:43:10.058Z' },
  ],
}

const createLogEntry = (offset: number, message: string, source = 'backend') => ({
  source,
  line: offset + 1,
  offset,
  timestamp: '2026-07-22T13:43:10.058Z',
  level: 'INFO',
  service: 'catalog-process',
  correlationId: null,
  message,
})

afterEach(() => {
  queryClient.clear()
  vi.unstubAllGlobals()
})

describe('Local development dashboard', () => {
  it('explains a degraded status even when every process and Docker service is running', async () => {
    const degradedStatusResponse = {
      ...statusResponse,
      overall: 'degraded',
      sessions: [
        { name: 'interop-backend', state: 'running' },
        { name: 'interop-frontend', state: 'stopped' },
      ],
    }
    const fetchMock = vi.fn(async (input: RequestInfo | URL) => {
      if (String(input).includes('/api/status')) {
        return new Response(JSON.stringify(degradedStatusResponse), { status: 200 })
      }

      return new Response(
        JSON.stringify({
          query: '',
          source: null,
          cursors: {},
          results: [],
        }),
        { status: 200 }
      )
    })
    vi.stubGlobal('fetch', fetchMock)

    renderWithApplicationContext(<LocalDevelopmentDashboardPage />, {
      withReactQueryContext: true,
    })

    expect(
      await screen.findByRole('heading', { name: 'Why the environment is degraded' })
    ).toBeVisible()
    expect(screen.getByRole('alert')).toHaveTextContent(/Session.*interop-frontend.*Stopped/)
    expect(screen.getByRole('alert')).not.toHaveTextContent(/interop-backend.*Running/)
  })

  it('shows services and searches logs by correlation ID', async () => {
    const fetchMock = vi.fn(async (input: RequestInfo | URL) => {
      const url = String(input)
      if (url.includes('/api/status')) {
        return new Response(JSON.stringify(statusResponse), { status: 200 })
      }
      return new Response(
        JSON.stringify({
          query: 'cid-123',
          source: null,
          cursors: { backend: 200 },
          results: url.includes('cid-123')
            ? [
                {
                  source: 'backend',
                  line: 42,
                  offset: 100,
                  timestamp: '2026-07-22T13:43:10.058Z',
                  level: 'ERROR',
                  service: 'catalog-process',
                  correlationId: 'cid-123',
                  message: 'ERROR [catalog-process] [CID=cid-123] Request failed',
                },
              ]
            : [],
        }),
        { status: 200 }
      )
    })
    vi.stubGlobal('fetch', fetchMock)

    renderWithApplicationContext(<LocalDevelopmentDashboardPage />, {
      withReactQueryContext: true,
    })

    expect(await screen.findByRole('heading', { name: 'Local environment' })).toBeVisible()
    const bffProcess = await screen.findByText('pagopa-interop-backend-for-frontend')
    const catalogProcess = screen.getByText('pagopa-interop-catalog-process')
    expect(
      bffProcess.compareDocumentPosition(catalogProcess) & Node.DOCUMENT_POSITION_FOLLOWING
    ).toBeTruthy()
    expect(screen.getByRole('columnheader', { name: 'Port' })).toBeVisible()
    expect(screen.getByRole('columnheader', { name: 'PID' })).toBeVisible()
    expect(screen.getByText('3600')).toBeVisible()

    await userEvent.click(bffProcess)
    await waitFor(() =>
      expect(
        fetchMock.mock.calls.some(([input]) =>
          String(input).includes('service=backend-for-frontend')
        )
      ).toBeTruthy()
    )

    await userEvent.click(screen.getByRole('combobox', { name: 'Level' }))
    await userEvent.click(screen.getByRole('option', { name: 'ERROR' }))
    await waitFor(() =>
      expect(
        fetchMock.mock.calls.some(([input]) => String(input).includes('level=ERROR'))
      ).toBeTruthy()
    )

    await userEvent.click(screen.getByRole('tab', { name: /Docker/ }))
    expect(screen.getByText('kafka')).toBeVisible()

    await userEvent.type(screen.getByRole('searchbox', { name: 'Search logs' }), 'cid-123')
    await waitFor(() => expect(screen.getByText(/Request failed/)).toBeVisible())

    const logRequestCountBeforeReset = fetchMock.mock.calls.filter(([input]) =>
      String(input).includes('/api/logs')
    ).length
    await userEvent.click(screen.getByRole('button', { name: 'Clear filters' }))

    expect(screen.getByRole('searchbox', { name: 'Search logs' })).toHaveValue('')
    expect(screen.getByRole('button', { name: 'Clear filters' })).toBeDisabled()
    await waitFor(() => {
      const logRequests = fetchMock.mock.calls
        .map(([input]) => String(input))
        .filter((url) => url.includes('/api/logs'))
      expect(logRequests.length).toBeGreaterThan(logRequestCountBeforeReset)
      expect(logRequests.at(-1)).not.toMatch(/[?&](query|source|level|service)=/)
    })
  })

  it('requests only appended logs and merges them in the browser cache', async () => {
    let logRequest = 0
    const fetchMock = vi.fn(async (input: RequestInfo | URL) => {
      const url = String(input)
      if (url.includes('/api/status')) {
        return new Response(JSON.stringify(statusResponse), { status: 200 })
      }

      logRequest += 1
      if (url.includes('source=frontend')) {
        return new Response(
          JSON.stringify({
            query: '',
            source: 'frontend',
            cursors: { frontend: 100 },
            results: [createLogEntry(0, 'Frontend log line', 'frontend')],
          }),
          { status: 200 }
        )
      }

      const incrementalRequest = url.includes('cursors=')
      if (logRequest === 3) {
        return new Response(
          JSON.stringify({
            query: '',
            source: null,
            cursors: { backend: 50 },
            resetSources: ['backend'],
            results: [createLogEntry(0, 'Log after rotation')],
          }),
          { status: 200 }
        )
      }

      return new Response(
        JSON.stringify({
          query: '',
          source: null,
          cursors: { backend: incrementalRequest ? 200 : 100 },
          results: incrementalRequest
            ? [createLogEntry(100, 'Second log line')]
            : [createLogEntry(0, 'First log line')],
        }),
        { status: 200 }
      )
    })
    vi.stubGlobal('fetch', fetchMock)

    renderWithApplicationContext(<LocalDevelopmentDashboardPage />, {
      withReactQueryContext: true,
    })

    expect(await screen.findByText('First log line')).toBeVisible()
    await queryClient.refetchQueries({
      queryKey: ['local-development-dashboard', 'logs', '', ''],
    })

    expect(await screen.findByText('Second log line')).toBeVisible()
    expect(screen.getByText('First log line')).toBeVisible()
    expect(logRequest).toBe(2)
    expect(fetchMock.mock.calls.some(([input]) => String(input).includes('cursors='))).toBeTruthy()

    await queryClient.refetchQueries({
      queryKey: ['local-development-dashboard', 'logs', '', ''],
    })
    expect(await screen.findByText('Log after rotation')).toBeVisible()
    expect(screen.queryByText('First log line')).not.toBeInTheDocument()
    expect(screen.queryByText('Second log line')).not.toBeInTheDocument()

    await userEvent.click(screen.getByRole('combobox', { name: 'Source' }))
    await userEvent.click(screen.getByRole('option', { name: 'frontend' }))

    expect(await screen.findByText('Frontend log line')).toBeVisible()
    expect(screen.queryByText('First log line')).not.toBeInTheDocument()
    const logRequests = fetchMock.mock.calls
      .map(([input]) => String(input))
      .filter((url) => url.includes('/api/logs'))
    expect(logRequests.at(-1)).toContain('source=frontend')
    expect(logRequests.at(-1)).not.toContain('cursors=')
  })

  it('virtualizes a long log result', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    vi.stubGlobal('navigator', { clipboard: { writeText } })
    const fetchMock = vi.fn(async (input: RequestInfo | URL) => {
      const url = String(input)
      if (url.includes('/api/status')) {
        return new Response(JSON.stringify(statusResponse), { status: 200 })
      }

      return new Response(
        JSON.stringify({
          query: '',
          source: null,
          cursors: { backend: 500 },
          results: Array.from({ length: 500 }, (_, index) =>
            createLogEntry(index, `Log line ${index}`)
          ),
        }),
        { status: 200 }
      )
    })
    vi.stubGlobal('fetch', fetchMock)

    renderWithApplicationContext(<LocalDevelopmentDashboardPage />, {
      withReactQueryContext: true,
    })

    const logList = await screen.findByRole('list', { name: 'Logs' })
    expect(logList.querySelectorAll('[role="listitem"]').length).toBeLessThan(100)

    await userEvent.click(screen.getByRole('button', { name: 'Copy filtered logs' }))

    const copiedLogs = writeText.mock.calls[0]?.[0]
    expect(copiedLogs).toContain('Log line 0')
    expect(copiedLogs).toContain('Log line 499')
    expect(copiedLogs.split('\n')).toHaveLength(500)
    expect(screen.getByRole('button', { name: 'Logs copied' })).toBeVisible()
  })

  it('keeps a moving window of the latest 500 log lines', async () => {
    let logRequest = 0
    const fetchMock = vi.fn(async (input: RequestInfo | URL) => {
      const url = String(input)
      if (url.includes('/api/status')) {
        return new Response(JSON.stringify(statusResponse), { status: 200 })
      }

      logRequest += 1
      const incrementalRequest = url.includes('cursors=')
      return new Response(
        JSON.stringify({
          query: '',
          source: null,
          cursors: { backend: incrementalRequest ? 600 : 500 },
          results: incrementalRequest
            ? Array.from({ length: 100 }, (_, index) =>
                createLogEntry(599 - index, `New log line ${599 - index}`)
              )
            : Array.from({ length: 500 }, (_, index) =>
                createLogEntry(499 - index, `Log line ${499 - index}`)
              ),
        }),
        { status: 200 }
      )
    })
    vi.stubGlobal('fetch', fetchMock)

    renderWithApplicationContext(<LocalDevelopmentDashboardPage />, {
      withReactQueryContext: true,
    })

    expect(await screen.findByText('500 lines')).toBeVisible()
    await queryClient.refetchQueries({
      queryKey: ['local-development-dashboard', 'logs', '', '', ''],
    })

    expect(await screen.findByText('New log line 599')).toBeVisible()
    expect(screen.getByText('500 lines')).toBeVisible()
    expect(logRequest).toBe(2)
  })
})
