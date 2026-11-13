import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createInstance } from 'i18next'
import { I18nextProvider } from 'react-i18next'
import { ThemeProvider } from '@mui/material'
import { theme } from '@pagopa/interop-fe-commons'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import * as router from '@/router'
import { ProducerServices } from '@/api/producer'
import type { ProducerEServiceMonitoring } from '@/api/api.generatedTypes'
import { mockUseJwt } from '@/utils/testing.utils'
import { formatDateStringNumeric, formatThousands } from '@/utils/format.utils'
import itEservice from '@/static/locales/it/eservice.json'
import enEservice from '@/static/locales/en/eservice.json'
import {
  getMockProducerEServiceMonitoring,
  getMockProducerEServiceMonitoringArchiving,
  getMockProducerEServiceMonitoringSaturation,
} from '../../../../../../__mocks__/data/producer-monitoring.mocks'
import { ProviderEServiceMonitoringTab } from '../ProviderEServiceMonitoringTab'

vi.unmock('react-i18next')

const ESERVICE_ID = '10000000-0000-4000-8000-000000000001'
const DESCRIPTOR_ID = '20000000-0000-4000-8000-000000001001'
const OLDEST_DESCRIPTOR_ID = '20000000-0000-4000-8000-000000000099'

const navigateMock = vi.fn()
const getMonitoring = vi.spyOn(ProducerServices, 'getEServiceMonitoring')
const getSaturation = vi.spyOn(ProducerServices, 'getEServiceMonitoringSaturation')
const getArchiving = vi.spyOn(ProducerServices, 'getEServiceMonitoringArchiving')

const copy = itEservice.read.monitoring

const renderTab = async ({
  language = 'it',
  descriptorId = DESCRIPTOR_ID,
}: { language?: 'it' | 'en'; descriptorId?: string } = {}) => {
  vi.spyOn(router, 'useParams').mockReturnValue({ eserviceId: ESERVICE_ID, descriptorId })
  const i18n = createInstance()
  await i18n.init({
    lng: language,
    fallbackLng: false,
    resources: { it: { eservice: itEservice }, en: { eservice: enEservice } },
  })
  const client = new QueryClient({ defaultOptions: { queries: { retry: false, gcTime: 0 } } })
  const view = () => (
    <QueryClientProvider client={client}>
      <I18nextProvider i18n={i18n}>
        <ThemeProvider theme={theme}>
          <ProviderEServiceMonitoringTab />
        </ThemeProvider>
      </I18nextProvider>
    </QueryClientProvider>
  )
  const result = render(view())
  return { ...result, client, rerenderTab: () => result.rerender(view()) }
}

const getConsumersTable = (labels = copy) =>
  screen.getByRole('table', { name: labels.consumers.title })
const getArchivingTable = (labels = copy) =>
  screen.getByRole('table', { name: labels.archiving.title })
const waitForData = async (labels = copy) => {
  await screen.findByText(labels.versions.byKindCard.heading)
  await waitFor(() => expect(within(getConsumersTable(labels)).getAllByRole('row')).toHaveLength(6))
  await waitFor(() => expect(within(getArchivingTable(labels)).getAllByRole('row')).toHaveLength(3))
}

describe('ProviderEServiceMonitoringTab', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockUseJwt({ currentRoles: ['admin'] })
    vi.spyOn(router, 'useNavigate').mockReturnValue(navigateMock)
    getMonitoring.mockImplementation(async (params) => getMockProducerEServiceMonitoring(params))
    getSaturation.mockImplementation(async (params) =>
      getMockProducerEServiceMonitoringSaturation(params)
    )
    getArchiving.mockImplementation(async (params) =>
      getMockProducerEServiceMonitoringArchiving(params)
    )
  })

  it('requests the selected e-service/descriptor with the dashboard preview params and query keys', async () => {
    const { client } = await renderTab()
    await waitForData()

    const monitoringParams = { eserviceId: ESERVICE_ID, descriptorId: DESCRIPTOR_ID }
    const saturationParams = {
      ...monitoringParams,
      offset: 0,
      limit: 5,
      sortBy: 'PERCENTAGE_DESC',
    }
    expect(getMonitoring).toHaveBeenCalledExactlyOnceWith(monitoringParams)
    expect(getSaturation).toHaveBeenCalledExactlyOnceWith(saturationParams)
    expect(getArchiving).toHaveBeenCalledExactlyOnceWith({ eserviceId: ESERVICE_ID })
    expect(
      client
        .getQueryCache()
        .getAll()
        .map(({ queryKey }) => queryKey)
    ).toEqual(
      expect.arrayContaining([
        ['ProducerGetEServiceMonitoring', monitoringParams],
        ['ProducerGetEServiceMonitoringSaturation', saturationParams],
        ['ProducerGetEServiceMonitoringArchiving', { eserviceId: ESERVICE_ID }],
      ])
    )
  })

  it('refetches descriptor blocks on version changes without displaying previous-version metrics', async () => {
    const { rerenderTab } = await renderTab()
    await waitForData()
    let resolveMonitoring!: (data: ProducerEServiceMonitoring) => void
    getMonitoring.mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          resolveMonitoring = resolve
        })
    )
    vi.spyOn(router, 'useParams').mockReturnValue({
      eserviceId: ESERVICE_ID,
      descriptorId: OLDEST_DESCRIPTOR_ID,
    })

    rerenderTab()

    await waitFor(() =>
      expect(getMonitoring).toHaveBeenLastCalledWith({
        eserviceId: ESERVICE_ID,
        descriptorId: OLDEST_DESCRIPTOR_ID,
      })
    )
    expect(screen.getAllByRole('status', { name: copy.cards.loading })).toHaveLength(2)
    expect(
      screen.queryByRole('region', {
        name: copy.consumption.consumptionCard.heading,
      })
    ).not.toBeInTheDocument()
    await waitFor(() =>
      expect(getSaturation).toHaveBeenLastCalledWith({
        eserviceId: ESERVICE_ID,
        descriptorId: OLDEST_DESCRIPTOR_ID,
        offset: 0,
        limit: 5,
        sortBy: 'PERCENTAGE_DESC',
      })
    )
    resolveMonitoring(
      getMockProducerEServiceMonitoring({
        eserviceId: ESERVICE_ID,
        descriptorId: OLDEST_DESCRIPTOR_ID,
      })
    )
    await waitForData()
    const consumption = screen.getByRole('region', {
      name: copy.consumption.consumptionCard.heading,
    })
    expect(within(consumption).getByText('12%')).toBeInTheDocument()
    expect(within(consumption).queryByText('77%')).not.toBeInTheDocument()
    // Archiving is e-service-wide, so version changes must not refetch it.
    expect(getArchiving).toHaveBeenCalledTimes(1)
  })

  it.each([
    ['it', itEservice],
    ['en', enEservice],
  ] as const)('renders sections, cards and tables in %s', async (language, resource) => {
    const labels = resource.read.monitoring
    await renderTab({ language })
    await waitForData(labels)

    expect(screen.getByRole('heading', { level: 2, name: labels.consumption.title })).toBeVisible()
    expect(screen.getByText(labels.consumption.description)).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 2, name: labels.versions.title })).toBeVisible()
    for (const heading of [
      labels.consumption.consumptionCard.heading,
      labels.consumption.newPurposesCard.heading,
      labels.consumption.quotaChangesCard.heading,
      labels.versions.byVersionCard.heading,
      labels.versions.byKindCard.heading,
      labels.versions.pendingAgreementsCard.heading,
    ]) {
      expect(screen.getByRole('region', { name: heading })).toBeInTheDocument()
    }
    expect(screen.getByText(labels.versions.byKindCard.pa)).toBeInTheDocument()
    expect(screen.getByText(labels.consumers.title)).toBeInTheDocument()
    expect(screen.getByText(labels.archiving.title)).toBeInTheDocument()

    const consumersHeaders = within(getConsumersTable(labels))
      .getAllByRole('columnheader')
      .map((header) => header.textContent)
    expect(consumersHeaders.slice(0, 5)).toEqual([
      labels.consumers.columns.consumer,
      labels.consumers.columns.purposes,
      labels.consumers.columns.percentage,
      labels.consumers.columns.calls,
      labels.consumers.columns.callsToApprove,
    ])
    const archivingHeaders = within(getArchivingTable(labels))
      .getAllByRole('columnheader')
      .map((header) => header.textContent)
    expect(archivingHeaders.slice(0, 3)).toEqual([
      labels.archiving.columns.version,
      labels.archiving.columns.consumers,
      labels.archiving.columns.archivableOn,
    ])
  })

  it('renders the five preview rows sorted by percentage with valid phrasing markup', async () => {
    await renderTab()
    await waitForData()

    const expected = getMockProducerEServiceMonitoringSaturation({
      eserviceId: ESERVICE_ID,
      descriptorId: DESCRIPTOR_ID,
      offset: 0,
      limit: 5,
      sortBy: 'PERCENTAGE_DESC',
    }).results
    const rows = within(getConsumersTable()).getAllByRole('row').slice(1)
    expect(rows).toHaveLength(5)
    rows.forEach((row, index) => {
      const item = expected[index]
      expect(within(row).getByText(item.consumer.name)).toBeInTheDocument()
      expect(
        within(row).getByText(
          `${formatThousands(item.approvedDailyCalls)} / ${formatThousands(item.dailyCallsPerConsumer)}`
        )
      ).toBeInTheDocument()
      expect(row.querySelector('p p, p div')).toBeNull()
    })
    within(getArchivingTable())
      .getAllByRole('row')
      .forEach((row) => expect(row.querySelector('p p, p div')).toBeNull())
  })

  it('opens the consumer detail from the preview chevron with the actual consumerId', async () => {
    const user = userEvent.setup()
    await renderTab()
    await waitForData()

    const [firstRow] = within(getConsumersTable()).getAllByRole('row').slice(1)
    const name = within(firstRow).getAllByText(/./)[0].textContent ?? ''
    const expected = getMockProducerEServiceMonitoringSaturation({
      eserviceId: ESERVICE_ID,
      descriptorId: DESCRIPTOR_ID,
      offset: 0,
      limit: 5,
      sortBy: 'PERCENTAGE_DESC',
    }).results[0]
    expect(name).toBe(expected.consumer.name)
    await user.click(
      within(firstRow).getByRole('button', {
        name: copy.consumers.viewConsumerAriaLabel.replace('{{name}}', expected.consumer.name),
      })
    )
    expect(navigateMock).toHaveBeenCalledExactlyOnceWith('PROVIDE_DASHBOARD_CONSUMER_DETAIL', {
      params: { consumerId: expected.consumer.id },
    })
  })

  it('hides the consumer chevron when the consumer detail route is not accessible', async () => {
    mockUseJwt({ currentRoles: [] })
    await renderTab()
    await waitForData()

    expect(
      within(getConsumersTable()).queryByRole('button', {
        name: new RegExp(`^${copy.consumers.viewConsumerAriaLabel.replace('{{name}}', '')}`),
      })
    ).not.toBeInTheDocument()
    expect(within(getConsumersTable()).queryByTestId('ChevronRightIcon')).not.toBeInTheDocument()
  })

  it('disables export, view-all and purpose CTAs with an accessible explanation', async () => {
    await renderTab()
    await waitForData()

    const expectDisabledWithReason = (name: string, reason: string) => {
      const button = screen.getByRole('button', { name })
      expect(button).toBeDisabled()
      expect(button).toHaveAccessibleDescription(reason)
    }
    expectDisabledWithReason(copy.consumption.export, copy.consumption.exportUnavailable)
    expectDisabledWithReason(copy.consumers.viewAll, copy.consumers.viewAllUnavailable)
    expectDisabledWithReason(
      copy.consumption.newPurposesCard.action,
      copy.consumption.purposesActionUnavailable
    )
    expectDisabledWithReason(
      copy.consumption.quotaChangesCard.action,
      copy.consumption.purposesActionUnavailable
    )
    expect(navigateMock).not.toHaveBeenCalled()
  })

  it('opens the agreement list filtered by e-service and PENDING state', async () => {
    const user = userEvent.setup()
    await renderTab()
    await waitForData()

    await user.click(
      screen.getByRole('button', { name: copy.versions.pendingAgreementsCard.action })
    )
    expect(navigateMock).toHaveBeenCalledExactlyOnceWith('PROVIDE_AGREEMENT_LIST', {
      urlParams: { eservicesIds: ESERVICE_ID, states: 'PENDING' },
    })
  })

  it('hides the agreements CTA for roles without access to the agreement list', async () => {
    mockUseJwt({ currentRoles: ['security'] })
    await renderTab()
    await waitForData()

    expect(
      screen.queryByRole('button', { name: copy.versions.pendingAgreementsCard.action })
    ).not.toBeInTheDocument()
  })

  it('navigates archiving rows to the monitoring tab of another version and disables the current one', async () => {
    const user = userEvent.setup()
    await renderTab()
    await waitForData()

    const [oldestRow, currentRow] = within(getArchivingTable()).getAllByRole('row').slice(1)
    expect(within(oldestRow).getByText('Versione 0')).toBeInTheDocument()
    expect(
      within(oldestRow).getByText(formatDateStringNumeric('2026-12-01T00:00:00Z'))
    ).toBeInTheDocument()

    await user.click(
      within(oldestRow).getByRole('button', {
        name: copy.archiving.viewVersionAriaLabel.replace('{{version}}', '0'),
      })
    )
    expect(navigateMock).toHaveBeenCalledExactlyOnceWith('PROVIDE_ESERVICE_MANAGE', {
      params: { eserviceId: ESERVICE_ID, descriptorId: OLDEST_DESCRIPTOR_ID },
      urlParams: { tab: 'monitoring' },
    })

    const currentButton = within(currentRow).getByRole('button', {
      name: `${copy.archiving.viewVersionAriaLabel.replace('{{version}}', '1')}. ${copy.archiving.currentVersion}`,
    })
    expect(currentButton).toBeDisabled()
  })

  it('shows a disabled explained chevron for whole e-service archiving rows', async () => {
    getArchiving.mockResolvedValue({
      results: [
        {
          eservice: { id: ESERVICE_ID, name: 'Anagrafe Nazionale' },
          consumersCount: 7,
          archivableOn: '2027-03-01T00:00:00Z',
        },
      ],
    })
    await renderTab()

    const table = await screen.findByRole('table', { name: copy.archiving.title })
    await within(table).findByText(copy.archiving.wholeEService)
    expect(
      within(table).getByRole('button', {
        name: `${copy.archiving.viewVersionAriaLabel.replace('{{version}}', copy.archiving.wholeEService)}. ${copy.archiving.noVersion}`,
      })
    ).toBeDisabled()
  })

  it('renders past, today and singular/plural future date chips in the archiving rows', async () => {
    vi.useFakeTimers({ toFake: ['Date'] })
    vi.setSystemTime(new Date(2026, 10, 12, 12))
    try {
      getArchiving.mockResolvedValue({
        results: [11, 12, 13, 14].map((day, index) => ({
          eservice: { id: ESERVICE_ID, name: 'Anagrafe Nazionale' },
          descriptorId: `version-${index}`,
          version: String(index),
          consumersCount: 0,
          archivableOn: new Date(2026, 10, day, 18).toISOString(),
        })),
      })
      await renderTab()
      const table = await screen.findByRole('table', { name: copy.archiving.title })
      await within(table).findByText(copy.archiving.relative.today)
      const rows = within(table).getAllByRole('row').slice(1)
      const expected = [
        copy.archiving.relative.pastDue,
        copy.archiving.relative.today,
        copy.archiving.relative.inDays_one.replace('{{count}}', '1'),
        copy.archiving.relative.inDays_other.replace('{{count}}', '2'),
      ]
      rows.forEach((row, index) => {
        expect(within(row).getByText(expected[index])).toBeInTheDocument()
        expect(row.querySelector('p p, p div')).toBeNull()
      })
    } finally {
      vi.useRealTimers()
    }
  })

  it('opens a populated monitoring tab for the archived version fixture', async () => {
    await renderTab({ descriptorId: OLDEST_DESCRIPTOR_ID })
    await waitForData()

    expect(getMonitoring).toHaveBeenCalledWith({
      eserviceId: ESERVICE_ID,
      descriptorId: OLDEST_DESCRIPTOR_ID,
    })
    const [oldestRow] = within(getArchivingTable()).getAllByRole('row').slice(1)
    expect(
      within(oldestRow).getByRole('button', {
        name: `${copy.archiving.viewVersionAriaLabel.replace('{{version}}', '0')}. ${copy.archiving.currentVersion}`,
      })
    ).toBeDisabled()
  })

  it('shows loading states without stale or zero values', async () => {
    const pending = () => new Promise<never>(() => undefined)
    getMonitoring.mockImplementation(pending)
    getSaturation.mockImplementation(pending)
    getArchiving.mockImplementation(pending)
    await renderTab()

    expect(screen.getAllByRole('status', { name: copy.cards.loading })).toHaveLength(2)
    expect(screen.getByRole('status', { name: copy.consumers.loading })).toBeInTheDocument()
    expect(screen.getByRole('status', { name: copy.archiving.loading })).toBeInTheDocument()
    expect(
      screen.queryByRole('region', { name: copy.consumption.consumptionCard.heading })
    ).not.toBeInTheDocument()
  })

  it('shows empty states for tables', async () => {
    getSaturation.mockImplementation(async (params) => ({
      ...getMockProducerEServiceMonitoringSaturation(params),
      results: [],
      pagination: { offset: 0, limit: 5, totalCount: 0 },
    }))
    getArchiving.mockResolvedValue({ results: [] })
    await renderTab()

    expect(await screen.findByText(copy.consumers.empty)).toBeInTheDocument()
    expect(await screen.findByText(copy.archiving.empty)).toBeInTheDocument()
  })

  it('shows errors per block and recovers on retry', async () => {
    const user = userEvent.setup()
    getMonitoring.mockRejectedValueOnce(new Error('monitoring'))
    getSaturation.mockRejectedValueOnce(new Error('saturation'))
    getArchiving.mockRejectedValueOnce(new Error('archiving'))
    await renderTab()

    expect(await screen.findAllByText(copy.cards.loadError)).toHaveLength(2)
    expect(await screen.findByText(copy.consumers.loadError)).toBeInTheDocument()
    expect(await screen.findByText(copy.archiving.loadError)).toBeInTheDocument()

    const retryButtons = screen.getAllByRole('button', { name: copy.cards.retry })
    expect(retryButtons).toHaveLength(4)
    for (const button of retryButtons) await user.click(button)

    await waitForData()
    expect(screen.queryByText(copy.cards.loadError)).not.toBeInTheDocument()
    expect(screen.queryByText(copy.consumers.loadError)).not.toBeInTheDocument()
    expect(screen.queryByText(copy.archiving.loadError)).not.toBeInTheDocument()
  })

  it('handles optional version fields and shows them only when provided', async () => {
    getMonitoring.mockImplementation(async (params) => {
      const data: ProducerEServiceMonitoring = getMockProducerEServiceMonitoring(params)
      delete data.consumersByVersion.medianUpgradeDays
      delete data.consumersByVersion.olderVersionsConsumersCount
      return data
    })
    await renderTab()
    await waitForData()

    expect(screen.queryByText(copy.versions.byVersionCard.olderVersions)).not.toBeInTheDocument()
    expect(screen.queryByText(/^Tempo mediano di aggiornamento/)).not.toBeInTheDocument()
    expect(screen.getAllByText('Versione 1').length).toBeGreaterThan(0)
  })

  it('shows optional older versions and median upgrade days when present', async () => {
    getMonitoring.mockImplementation(async (params) => {
      const data = getMockProducerEServiceMonitoring(params)
      data.consumersByVersion.olderVersionsConsumersCount = 2
      data.consumersByVersion.medianUpgradeDays = 1
      return data
    })
    await renderTab({ language: 'en' })
    await waitForData(enEservice.read.monitoring)

    expect(
      screen.getByText(enEservice.read.monitoring.versions.byVersionCard.olderVersions)
    ).toBeInTheDocument()
    expect(screen.getByText('Median upgrade time: 1 day')).toBeInTheDocument()
  })
})
