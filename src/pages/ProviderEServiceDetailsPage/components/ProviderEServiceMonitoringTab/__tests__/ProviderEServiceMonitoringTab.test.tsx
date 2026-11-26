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
import itAgreement from '@/static/locales/it/agreement.json'
import enAgreement from '@/static/locales/en/agreement.json'
import {
  getMockProducerEServiceMonitoring,
  getMockProducerEServiceMonitoringArchiving,
  getMockProducerEServiceMonitoringSaturation,
} from '../../../../../../__mocks__/data/producer-monitoring.mocks'
import { ProviderEServiceMonitoringTab } from '../ProviderEServiceMonitoringTab'

vi.unmock('react-i18next')

const ESERVICE_ID = '10000000-0000-4000-8000-000000000001'
const ESERVICE_NAME = 'E-service / dati & sicurezza'
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
  eserviceName = ESERVICE_NAME,
  dailyCallsPerConsumer = 2000,
}: {
  language?: 'it' | 'en'
  descriptorId?: string
  eserviceName?: string | null
  dailyCallsPerConsumer?: number | null
} = {}) => {
  vi.spyOn(router, 'useParams').mockReturnValue({ eserviceId: ESERVICE_ID, descriptorId })
  const i18n = createInstance()
  await i18n.init({
    lng: language,
    fallbackLng: false,
    resources: {
      it: { eservice: itEservice, agreement: itAgreement },
      en: { eservice: enEservice, agreement: enAgreement },
    },
  })
  const client = new QueryClient({ defaultOptions: { queries: { retry: false, gcTime: 0 } } })
  const view = () => (
    <QueryClientProvider client={client}>
      <I18nextProvider i18n={i18n}>
        <ThemeProvider theme={theme}>
          <ProviderEServiceMonitoringTab
            eserviceName={eserviceName ?? undefined}
            dailyCallsPerConsumer={dailyCallsPerConsumer ?? undefined}
          />
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

  it('opens the consumer e-service detail from the preview chevron with the actual ids', async () => {
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
    expect(navigateMock).toHaveBeenCalledExactlyOnceWith(
      'PROVIDE_ESERVICE_MONITORING_CONSUMER_DETAIL',
      {
        params: {
          eserviceId: ESERVICE_ID,
          descriptorId: DESCRIPTOR_ID,
          consumerId: expected.consumer.id,
        },
      }
    )
  })

  it('hides the consumer chevron when the consumer e-service detail route is not accessible', async () => {
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

  it.each([
    {
      language: 'it',
      labels: itEservice.read.monitoring,
      notices: [
        'L’esportazione dei dati non è ancora disponibile.',
        'L’elenco completo dei consumi per fruitore non è ancora disponibile.',
        'L’elenco delle finalità non permette ancora di filtrare per versione e tipo di richiesta.',
      ],
    },
    {
      language: 'en',
      labels: enEservice.read.monitoring,
      notices: [
        'Data export is not available yet.',
        'The full list of consumption per consumer is not available yet.',
        'The purpose list cannot yet be filtered by version and request type.',
      ],
    },
  ] as const)(
    'keeps unavailable CTAs disabled without placeholder notices in $language',
    async ({ language, labels, notices }) => {
      await renderTab({ language })
      await waitForData(labels)

      for (const name of [
        labels.consumption.export,
        labels.consumers.viewAll,
        labels.consumption.newPurposesCard.action,
        labels.consumption.quotaChangesCard.action,
      ]) {
        const button = screen.getByRole('button', { name })
        expect(button).toBeDisabled()
        expect(button).not.toHaveAttribute('aria-describedby')
        expect(button).not.toHaveAccessibleDescription()
        button.click()
      }
      for (const notice of notices) expect(screen.queryByText(notice)).not.toBeInTheDocument()
      expect(navigateMock).not.toHaveBeenCalled()
    }
  )

  it.each([
    ['it', itEservice, itAgreement],
    ['en', enEservice, enAgreement],
  ] as const)(
    'opens the agreement list with localized filters in %s',
    async (language, eservice, agreement) => {
      const user = userEvent.setup()
      await renderTab({ language })
      await waitForData(eservice.read.monitoring)

      await user.click(
        screen.getByRole('button', {
          name: eservice.read.monitoring.versions.pendingAgreementsCard.action,
        })
      )
      expect(navigateMock).toHaveBeenCalledExactlyOnceWith('PROVIDE_AGREEMENT_LIST', {
        urlParams: {
          eservicesIds: JSON.stringify([[ESERVICE_NAME, ESERVICE_ID]]),
          states: JSON.stringify([
            [agreement.list.filters.statusField.optionLabels.PENDING, 'PENDING'],
          ]),
        },
      })
    }
  )

  it('hides the agreements CTA until the e-service name is available', async () => {
    await renderTab({ eserviceName: null })
    await waitForData()

    expect(
      screen.queryByRole('button', { name: copy.versions.pendingAgreementsCard.action })
    ).not.toBeInTheDocument()
  })

  it('hides the agreements CTA for roles without access to the agreement list', async () => {
    mockUseJwt({ currentRoles: ['security'] })
    await renderTab()
    await waitForData()

    expect(
      screen.queryByRole('button', { name: copy.versions.pendingAgreementsCard.action })
    ).not.toBeInTheDocument()
  })

  it('opens the archiving consumers page for each selected version', async () => {
    const user = userEvent.setup()
    await renderTab()
    await waitForData()

    const [oldestRow, currentRow] = within(getArchivingTable()).getAllByRole('row').slice(1)
    const results = getMockProducerEServiceMonitoringArchiving({ eserviceId: ESERVICE_ID }).results
    expect(within(oldestRow).getByText('Versione 0')).toBeInTheDocument()
    expect(
      within(oldestRow).getByText(formatDateStringNumeric('2026-12-01T00:00:00Z'))
    ).toBeInTheDocument()

    for (const [index, row, version] of [
      [0, oldestRow, '0'],
      [1, currentRow, '1'],
    ] as const) {
      const button = within(row).getByRole('button', {
        name: copy.archiving.viewConsumersAriaLabel.replace(
          '{{version}}',
          copy.archiving.version.replace('{{version}}', version)
        ),
      })
      expect(button).toBeEnabled()
      await user.click(button)
      expect(navigateMock).toHaveBeenLastCalledWith(
        'PROVIDE_ESERVICE_MONITORING_ARCHIVING_VERSIONS_CONSUMERS',
        { params: { eserviceId: ESERVICE_ID, descriptorId: results[index].descriptorId } }
      )
    }
    expect(navigateMock).toHaveBeenCalledTimes(2)
  })

  it.each([
    ['it', itEservice],
    ['en', enEservice],
  ] as const)(
    'leaves a missing version blank with a disabled generic chevron in %s',
    async (language, resource) => {
      const labels = resource.read.monitoring
      getArchiving.mockResolvedValue({
        results: [
          {
            eservice: { id: ESERVICE_ID, name: 'Anagrafe Nazionale' },
            consumersCount: 7,
            archivableOn: '2027-03-01T00:00:00Z',
          },
        ],
      })
      await renderTab({ language })

      const table = await screen.findByRole('table', { name: labels.archiving.title })
      const button = await within(table).findByRole('button', {
        name: labels.archiving.viewConsumersUnnumberedAriaLabel,
      })
      expect(button).toBeDisabled()
      const row = within(table).getAllByRole('row')[1]
      expect(within(row).getAllByRole('cell')[0]).toHaveTextContent(/^$/)
      expect(row).not.toHaveTextContent('Intero e-service')
      expect(row).not.toHaveTextContent('Whole e-service')
      expect(row).not.toHaveTextContent('undefined')
      expect(navigateMock).not.toHaveBeenCalled()
    }
  )

  it.each([
    ['it', 'desktop'],
    ['it', 'mobile'],
    ['en', 'desktop'],
    ['en', 'mobile'],
  ] as const)('renders archiving chips in %s on %s', async (language, viewport) => {
    if (viewport === 'mobile') {
      vi.stubGlobal('matchMedia', (query: string) => ({
        matches: query.includes('max-width'),
        media: query,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      }))
    }
    vi.useFakeTimers({ toFake: ['Date'] })
    vi.setSystemTime(new Date(2026, 10, 12, 23, 55))
    try {
      const { archiving } = (language === 'en' ? enEservice : itEservice).read.monitoring
      const days = [11, 12, 13, 22, 23]
      getArchiving.mockResolvedValue({
        results: days.map((day, index) => ({
          eservice: { id: ESERVICE_ID, name: 'Anagrafe Nazionale' },
          descriptorId: `version-${index}`,
          version: String(index),
          consumersCount: 0,
          archivableOn: new Date(2026, 10, day, 0, 5).toISOString(),
        })),
      })
      await renderTab({ language })
      const table = await screen.findByRole(viewport === 'mobile' ? 'group' : 'table', {
        name: archiving.title,
        busy: false,
      })
      const dateCells =
        viewport === 'mobile'
          ? within(table).getAllByRole('definition', { name: archiving.columns.archivableOn })
          : within(table)
              .getAllByRole('row')
              .slice(1)
              .map((row) => within(row).getAllByRole('cell')[2])
      const expected = [
        archiving.relative.pastDue,
        archiving.relative.today,
        archiving.relative.inDays_one.replace('{{count}}', '1'),
        archiving.relative.inDays_other.replace('{{count}}', '10'),
        archiving.relative.inDays_other.replace('{{count}}', '11'),
      ]
      expect(dateCells).toHaveLength(expected.length)
      dateCells.forEach((cell, index) => {
        const chip = within(cell).getByText(expected[index]).closest('.MuiChip-root')
        expect(chip).toHaveClass(index === 4 ? 'MuiChip-colorInfo' : 'MuiChip-colorError')
        expect(chip?.previousElementSibling).toHaveTextContent(`${days[index]}/11/2026`)
        expect(cell.querySelector('p p, p div')).toBeNull()
      })
    } finally {
      vi.useRealTimers()
      if (viewport === 'mobile') vi.unstubAllGlobals()
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
        name: copy.archiving.viewConsumersAriaLabel.replace(
          '{{version}}',
          copy.archiving.version.replace('{{version}}', '0')
        ),
      })
    ).toBeEnabled()
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
    expect(screen.queryByText(copy.consumers.empty)).not.toBeInTheDocument()
    expect(screen.queryByText(copy.consumption.newPurposesCard.empty)).not.toBeInTheDocument()
    expect(screen.queryByText(copy.consumption.quotaChangesCard.empty)).not.toBeInTheDocument()
    expect(screen.queryByText(copy.versions.pendingAgreementsCard.empty)).not.toBeInTheDocument()
  })

  it.each([
    ['it', itEservice],
    ['en', enEservice],
  ] as const)('renders an empty consumer panel in %s', async (language, resource) => {
    const labels = resource.read.monitoring
    getSaturation.mockImplementation(async (params) => ({
      ...getMockProducerEServiceMonitoringSaturation(params),
      results: [],
      pagination: { offset: 0, limit: 5, totalCount: 0 },
    }))
    getArchiving.mockResolvedValue({ results: [] })
    await renderTab({ language })

    const message = await screen.findByText(labels.consumers.empty)
    const section = screen.getByRole('region', { name: labels.consumers.title })
    expect(within(section).getByText(labels.consumers.description)).toBeInTheDocument()
    expect(within(section).queryByRole('table')).not.toBeInTheDocument()
    expect(within(section).queryByRole('columnheader')).not.toBeInTheDocument()
    expect(within(section).queryByRole('row')).not.toBeInTheDocument()
    expect(within(section).queryByRole('button')).not.toBeInTheDocument()
    expect(within(section).queryByRole('navigation')).not.toBeInTheDocument()
    const panel = message.closest('[role="status"]')
    expect(panel?.parentElement).toHaveAttribute('aria-busy', 'false')
    expect(panel).toHaveStyle({ minHeight: '200px', flexDirection: 'column', textAlign: 'center' })
    expect(within(panel as HTMLElement).getByTestId('ErrorOutlineIcon')).toHaveAttribute(
      'aria-hidden',
      'true'
    )
    const archiveMessage = await screen.findByText(labels.archiving.empty)
    const archive = screen.getByRole('region', { name: labels.archiving.title })
    expect(archiveMessage.closest('[role="status"]')).toContainElement(
      within(archive).getByTestId('ErrorOutlineIcon')
    )
    expect(within(archive).queryByRole('table')).not.toBeInTheDocument()
    expect(within(archive).queryByRole('columnheader')).not.toBeInTheDocument()
    expect(within(archive).queryByRole('row')).not.toBeInTheDocument()
  })

  it.each([
    ['it', itEservice, '0 / 50.000', '2000'],
    ['en', enEservice, '0 / 50,000', '2,000'],
  ] as const)('renders empty cards in %s', async (language, resource, total, perConsumer) => {
    const labels = resource.read.monitoring
    getMonitoring.mockImplementation(async (params) => ({
      ...getMockProducerEServiceMonitoring(params),
      approvedDailyCalls: 0,
      percentage: 0,
      dailyCallsTotal: 50000,
      waitingForApprovalNewPurposes: 0,
      waitingForApprovalQuotaChanges: 0,
      pendingAgreements: 0,
      consumersByVersion: {
        total: 0,
        versions: [{ descriptorId: DESCRIPTOR_ID, version: '1', consumersCount: 0 }],
        olderVersionsConsumersCount: 0,
        medianUpgradeDays: 0,
      },
      consumersByKind: { total: 0, pa: 0, gspScp: 0, private: 0 },
    }))
    await renderTab({ language })
    await waitForData(labels)

    const consumption = screen.getByRole('region', {
      name: labels.consumption.consumptionCard.heading,
    })
    expect(within(consumption).getByText('0%')).toBeVisible()
    expect(within(consumption).getByText(total)).toBeVisible()
    expect(
      within(consumption).getByText(labels.consumption.consumptionCard.description)
    ).toBeVisible()
    const consumers = screen.getByRole('region', { name: labels.versions.byVersionCard.heading })
    expect(within(consumers).getByText('0')).toBeVisible()
    expect(within(consumers).getByText(labels.versions.byVersionCard.totalLabel)).toBeVisible()
    expect(
      within(consumers).queryByText(labels.versions.byVersionCard.olderVersions)
    ).not.toBeInTheDocument()
    expect(within(consumers).queryByText(/Version[ei] 1/)).not.toBeInTheDocument()
    expect(consumers.querySelector('section > .MuiStack-root')).toBeNull()
    for (const card of [consumption, consumers]) {
      const chart = within(card).getByRole('img')
      await waitFor(() => {
        const arcs = Array.from(chart.querySelectorAll('path.MuiPieArc-root')).filter((arc) =>
          /a/i.test(arc.getAttribute('d') ?? '')
        )
        expect(arcs).toHaveLength(1)
        expect(arcs[0]).toHaveAttribute('fill', theme.palette.grey[200])
      })
    }
    const kinds = screen.getByRole('region', { name: labels.versions.byKindCard.heading })
    expect(within(kinds).getAllByText('0')).toHaveLength(3)
    for (const label of [
      labels.versions.byKindCard.pa,
      labels.versions.byKindCard.gspScp,
      labels.versions.byKindCard.private,
    ]) {
      expect(within(kinds).getByText(label)).toBeVisible()
    }
    expect(
      within(kinds).queryByText(labels.versions.byKindCard.total.replace('{{total}}', '0'))
    ).not.toBeInTheDocument()
    const purposes = screen.getByRole('region', {
      name: labels.consumption.newPurposesCard.heading,
    })
    expect(
      within(purposes).getByText(labels.consumption.newPurposesCard.thresholdHeading)
    ).toBeVisible()
    expect(within(purposes).getByText(perConsumer)).toBeVisible()
    expect(
      within(purposes).getByText(labels.consumption.newPurposesCard.thresholdUnit)
    ).toBeVisible()
    for (const [heading, message, hasCheck] of [
      [labels.consumption.newPurposesCard.heading, labels.consumption.newPurposesCard.empty, true],
      [
        labels.consumption.quotaChangesCard.heading,
        labels.consumption.quotaChangesCard.empty,
        false,
      ],
      [
        labels.versions.pendingAgreementsCard.heading,
        labels.versions.pendingAgreementsCard.empty,
        true,
      ],
    ] as const) {
      const card = screen.getByRole('region', { name: heading })
      expect(within(card).getByText(message)).toBeVisible()
      expect(within(card).queryByText('0')).not.toBeInTheDocument()
      expect(within(card).queryByRole('button')).not.toBeInTheDocument()
      expect(within(card).queryByRole('img')).not.toBeInTheDocument()
      if (hasCheck) {
        expect(within(card).getByTestId('CheckRoundedIcon').parentElement).toHaveAttribute(
          'aria-hidden',
          'true'
        )
      } else {
        expect(within(card).queryByTestId('CheckRoundedIcon')).not.toBeInTheDocument()
      }
    }
  })

  it.each([
    ['waitingForApprovalNewPurposes', copy.consumption.newPurposesCard],
    ['waitingForApprovalQuotaChanges', copy.consumption.quotaChangesCard],
    ['pendingAgreements', copy.versions.pendingAgreementsCard],
  ] as const)('handles zero %s alone', async (field, emptyCard) => {
    getMonitoring.mockImplementation(async (params) => ({
      ...getMockProducerEServiceMonitoring(params),
      [field]: 0,
    }))
    await renderTab()
    await waitForData()
    expect(screen.getByText(emptyCard.empty)).toBeVisible()
    expect(screen.queryByRole('button', { name: emptyCard.action })).not.toBeInTheDocument()
    const nonemptyCards = [
      copy.consumption.newPurposesCard,
      copy.consumption.quotaChangesCard,
      copy.versions.pendingAgreementsCard,
    ].filter((card) => card !== emptyCard)
    for (const card of nonemptyCards) {
      const region = screen.getByRole('region', { name: card.heading })
      expect(within(region).queryByText(card.empty)).not.toBeInTheDocument()
      expect(within(region).getByRole('button', { name: card.action })).toBeVisible()
    }
    expect(
      within(
        screen.getByRole('region', { name: copy.consumption.consumptionCard.heading })
      ).getByText('77%')
    ).toBeVisible()
  })

  it('does not invent a missing configured per-consumer threshold', async () => {
    getMonitoring.mockImplementation(async (params) => ({
      ...getMockProducerEServiceMonitoring(params),
      waitingForApprovalNewPurposes: 0,
    }))
    await renderTab({ dailyCallsPerConsumer: null })
    await waitForData()
    expect(screen.getByText(copy.consumption.newPurposesCard.empty)).toBeVisible()
    expect(
      screen.queryByText(copy.consumption.newPurposesCard.thresholdHeading)
    ).not.toBeInTheDocument()
  })

  it('keeps a different configured threshold when only purposes are empty', async () => {
    getMonitoring.mockImplementation(async (params) => ({
      ...getMockProducerEServiceMonitoring(params),
      waitingForApprovalNewPurposes: 0,
    }))
    await renderTab({ dailyCallsPerConsumer: 12500 })
    await waitForData()
    const purposes = screen.getByRole('region', { name: copy.consumption.newPurposesCard.heading })
    expect(within(purposes).getByText('12.500')).toBeVisible()
    expect(within(purposes).getByText(copy.consumption.newPurposesCard.thresholdUnit)).toBeVisible()
  })

  it.each(['version', 'kind'] as const)(
    'handles empty %s independently',
    async (emptyBreakdown) => {
      getMonitoring.mockImplementation(async (params) => {
        const data = getMockProducerEServiceMonitoring(params)
        if (emptyBreakdown === 'version') {
          data.consumersByVersion = { total: 0, versions: [] }
        } else {
          data.consumersByKind = { total: 0, pa: 0, gspScp: 0, private: 0 }
        }
        return data
      })
      await renderTab()
      await waitForData()
      const version = screen.getByRole('region', { name: copy.versions.byVersionCard.heading })
      const kind = screen.getByRole('region', { name: copy.versions.byKindCard.heading })
      if (emptyBreakdown === 'version') {
        expect(within(version).getByText('0')).toBeVisible()
        expect(within(kind).queryByText('0')).not.toBeInTheDocument()
      } else {
        expect(within(kind).getAllByText('0')).toHaveLength(3)
        expect(within(version).queryByText('0')).not.toBeInTheDocument()
      }
      expect(screen.queryByText(copy.versions.pendingAgreementsCard.empty)).not.toBeInTheDocument()
      expect(
        screen.getByRole('button', { name: copy.versions.pendingAgreementsCard.action })
      ).toBeVisible()
    }
  )

  it('shows an error rather than a cached empty consumer panel when a background request fails', async () => {
    getSaturation.mockImplementation(async (params) => ({
      ...getMockProducerEServiceMonitoringSaturation(params),
      results: [],
      pagination: { offset: 0, limit: 5, totalCount: 0 },
    }))
    const { client } = await renderTab()
    await screen.findByText(copy.consumers.empty)
    getSaturation.mockRejectedValue(new Error('background saturation'))
    await client.invalidateQueries({ queryKey: ['ProducerGetEServiceMonitoringSaturation'] })
    expect(await screen.findByText(copy.consumers.loadError)).toBeVisible()
    expect(screen.queryByText(copy.consumers.empty)).not.toBeInTheDocument()
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
    expect(screen.queryByText(copy.consumers.empty)).not.toBeInTheDocument()
    expect(screen.queryByText(copy.consumption.newPurposesCard.empty)).not.toBeInTheDocument()
    expect(screen.queryByText(copy.consumption.quotaChangesCard.empty)).not.toBeInTheDocument()
    expect(screen.queryByText(copy.versions.pendingAgreementsCard.empty)).not.toBeInTheDocument()

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
