import type { ReactNode } from 'react'
import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createInstance, type Resource } from 'i18next'
import { I18nextProvider } from 'react-i18next'
import { ThemeProvider } from '@mui/material'
import { theme } from '@pagopa/interop-fe-commons'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter } from 'react-router-dom'
import { NuqsTestingAdapter } from 'nuqs/adapters/testing'
import { ProducerServices } from '@/api/producer'
import { EServiceServices } from '@/api/eservice'
import * as router from '@/router'
import { createMockEServiceDescriptorProvider } from '@/../__mocks__/data/eservice.mocks'
import { loadMockProducerEServiceMonitoringArchivingAgreements } from '@/../__mocks__/data/producer-monitoring.mocks'
import itEservice from '@/static/locales/it/eservice.json'
import itDashboard from '@/static/locales/it/dashboard.json'
import ProviderEServiceMonitoringArchivingVersionsConsumersPage from '../ProviderEServiceMonitoringArchivingVersionsConsumers.page'

vi.unmock('react-i18next')

const ESERVICE_ID = '10000000-0000-4000-8000-000000000001'
const DESCRIPTOR_ID = '20000000-0000-4000-8000-000000001001'
const NEXT_DESCRIPTOR_ID = 'next-descriptor-id'
const localeModules = import.meta.glob<{ default: Record<string, unknown> }>(
  '/src/static/locales/{it,en}/*.json',
  { eager: true }
)
const resources = Object.entries(localeModules).reduce<Resource>((result, [path, module]) => {
  const parts = path.split('/')
  const language = parts[parts.length - 2]
  const namespace = parts[parts.length - 1].replace('.json', '')
  result[language] ??= {}
  result[language][namespace] = module.default
  return result
}, {})

const navigateMock = vi.fn()
const getAgreements = vi.spyOn(ProducerServices, 'getProducerEServiceMonitoringArchivingAgreements')
const getDescriptorProvider = vi.spyOn(EServiceServices, 'getDescriptorProvider')

vi.mock('@/components/layout/containers/PageContainer', () => ({
  PageContainer: ({
    title,
    description,
    children,
    titleAction,
  }: {
    title: string
    description: string
    children: ReactNode
    titleAction: ReactNode
  }) => (
    <main>
      <h1>{title}</h1>
      <p>{description}</p>
      {titleAction}
      {children}
    </main>
  ),
}))

vi.mock('@/components/shared/EServiceVersionSelectorDrawer', () => ({
  EServiceVersionSelectorDrawer: ({
    isOpen,
    onClose,
    onVersionChange,
  }: {
    isOpen: boolean
    onClose: () => void
    onVersionChange: (descriptorId: string) => void
  }) =>
    isOpen ? (
      <button
        onClick={() => {
          onVersionChange(NEXT_DESCRIPTOR_ID)
          onClose()
        }}
      >
        Select another version
      </button>
    ) : null,
}))

const renderPage = async (searchParams = '') => {
  const i18n = createInstance()
  await i18n.init({ lng: 'it', fallbackLng: false, resources })
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0 } },
  })

  return render(
    <QueryClientProvider client={client}>
      <I18nextProvider i18n={i18n}>
        <ThemeProvider theme={theme}>
          <MemoryRouter initialEntries={[`/monitoring${searchParams}`]}>
            <NuqsTestingAdapter searchParams={searchParams} hasMemory>
              <ProviderEServiceMonitoringArchivingVersionsConsumersPage />
            </NuqsTestingAdapter>
          </MemoryRouter>
        </ThemeProvider>
      </I18nextProvider>
    </QueryClientProvider>
  )
}

describe('ProviderEServiceMonitoringArchivingVersionsConsumersPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    getAgreements.mockReset()
    getAgreements.mockImplementation((params) =>
      loadMockProducerEServiceMonitoringArchivingAgreements(params)
    )
    getDescriptorProvider.mockReset()
    getDescriptorProvider.mockResolvedValue(createMockEServiceDescriptorProvider())
    vi.spyOn(router, 'useParams').mockReturnValue({
      eserviceId: ESERVICE_ID,
      descriptorId: DESCRIPTOR_ID,
    })
    vi.spyOn(router, 'useNavigate').mockReturnValue(navigateMock)
  })

  it('loads the selected version consumers and renders its details', async () => {
    const request = {
      eserviceId: ESERVICE_ID,
      descriptorId: DESCRIPTOR_ID,
      offset: 0,
      limit: 10,
      q: undefined,
      sortBy: 'DATE_DESC',
    } as const
    const data = await loadMockProducerEServiceMonitoringArchivingAgreements(request)
    const labels = itEservice.read.monitoring.archiving.archivingVersionConsumersPage

    await renderPage()

    expect(await screen.findByRole('table')).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 1, name: labels.title })).toBeInTheDocument()
    expect(screen.getByText(labels.description)).toBeInTheDocument()
    expect(screen.getByText(`${data.eservice.name}, V${data.version}`)).toBeInTheDocument()
    expect(screen.getByText(data.archivableOn)).toBeInTheDocument()
    expect(
      within(screen.getByRole('table')).getByRole('columnheader', {
        name: labels.table.consumer,
      })
    ).toBeInTheDocument()
    expect(getAgreements).toHaveBeenCalledWith(request)
  })

  it('applies sorting and resets the current pagination offset', async () => {
    const user = userEvent.setup()
    const sorting = itDashboard.providerSaturationRatePage.sorting

    await renderPage('?offset=10')
    await screen.findByRole('table')

    expect(getAgreements).toHaveBeenCalledWith(
      expect.objectContaining({ offset: 10, sortBy: 'DATE_DESC' })
    )

    await user.click(screen.getByRole('button', { name: sorting.dateDesc }))
    await user.click(screen.getByRole('menuitem', { name: sorting.nameAsc }))

    await waitFor(() =>
      expect(getAgreements).toHaveBeenLastCalledWith(
        expect.objectContaining({ offset: 0, sortBy: 'NAME_ASC' })
      )
    )
  })

  it('navigates to the selected archived version', async () => {
    const user = userEvent.setup()
    const labels = itEservice.read.monitoring.archiving.archivingVersionConsumersPage

    await renderPage()
    await screen.findByRole('table')
    await user.click(screen.getByRole('button', { name: labels.goToAnotherVersion }))
    await user.click(await screen.findByRole('button', { name: 'Select another version' }))

    expect(navigateMock).toHaveBeenCalledExactlyOnceWith(
      'PROVIDE_ESERVICE_MONITORING_ARCHIVING_VERSIONS_CONSUMERS',
      { params: { eserviceId: ESERVICE_ID, descriptorId: NEXT_DESCRIPTOR_ID } }
    )
  })
})
