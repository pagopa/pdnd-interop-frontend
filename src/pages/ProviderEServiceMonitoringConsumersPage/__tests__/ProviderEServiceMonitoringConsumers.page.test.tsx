import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ThemeProvider } from '@mui/material'
import { theme } from '@pagopa/interop-fe-commons'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createInstance, type Resource } from 'i18next'
import { I18nextProvider } from 'react-i18next'
import { MemoryRouter } from 'react-router-dom'
import { NuqsAdapter } from 'nuqs/adapters/react-router/v6'
import { ProducerServices } from '@/api/producer'
import { EServiceServices } from '@/api/eservice'
import { mockUseJwt } from '@/utils/testing.utils'
import * as router from '@/router'
import itEservice from '@/static/locales/it/eservice.json'
import { getMockProducerEServiceMonitoringSaturation } from '../../../../__mocks__/data/producer-monitoring.mocks'
import ProviderEServiceMonitoringConsumersPage from '../ProviderEServiceMonitoringConsumers.page'

vi.unmock('react-i18next')
vi.mock('@/components/layout/containers/PageContainer', () => ({
  PageContainer: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}))

const ESERVICE_ID = '10000000-0000-4000-8000-000000000001'
const DESCRIPTOR_ID = '20000000-0000-4000-8000-000000001001'
const labels = itEservice.read.monitoring.consumers

const localeModules = import.meta.glob<{ default: Record<string, unknown> }>(
  '/src/static/locales/it/*.json',
  { eager: true }
)
const itResources = Object.fromEntries(
  Object.entries(localeModules).map(([path, mod]) => [
    path.split('/').pop()!.replace('.json', ''),
    mod.default,
  ])
)

it('hides the summary after an initial failure and restores it after retry', async () => {
  mockUseJwt({ currentRoles: ['admin'] })
  vi.spyOn(router, 'useParams').mockReturnValue({
    eserviceId: ESERVICE_ID,
    descriptorId: DESCRIPTOR_ID,
  })
  vi.spyOn(EServiceServices, 'getDescriptorProvider').mockImplementation(
    () => new Promise(() => {})
  )
  const saturation = getMockProducerEServiceMonitoringSaturation({
    eserviceId: ESERVICE_ID,
    descriptorId: DESCRIPTOR_ID,
    offset: 0,
    limit: 10,
  })
  let rejectRequest!: (error: Error) => void
  const getSaturation = vi
    .spyOn(ProducerServices, 'getEServiceMonitoringSaturation')
    .mockImplementationOnce(
      () =>
        new Promise((_, reject) => {
          rejectRequest = reject
        })
    )
    .mockResolvedValue(saturation)

  const i18n = createInstance()
  await i18n.init({ lng: 'it', resources: { it: itResources } as Resource })
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0, throwOnError: true } },
  })
  const user = userEvent.setup()
  render(
    <QueryClientProvider client={client}>
      <I18nextProvider i18n={i18n}>
        <ThemeProvider theme={theme}>
          <MemoryRouter>
            <NuqsAdapter>
              <ProviderEServiceMonitoringConsumersPage />
            </NuqsAdapter>
          </MemoryRouter>
        </ThemeProvider>
      </I18nextProvider>
    </QueryClientProvider>
  )

  expect(
    screen.getByText(labels.monitoringConsumersPage.customizedQuotaConsumersOnConsumers)
  ).toBeVisible()
  await waitFor(() => expect(getSaturation).toHaveBeenCalledTimes(1))
  rejectRequest(new Error('Request failed'))
  expect(await screen.findByText(labels.loadError)).toBeVisible()
  expect(
    screen.queryByText(labels.monitoringConsumersPage.customizedQuotaConsumersOnConsumers)
  ).not.toBeInTheDocument()
  expect(screen.queryByText(labels.monitoringConsumersPage.dailyCallsTotal)).not.toBeInTheDocument()
  expect(screen.queryByText(/undefined/)).not.toBeInTheDocument()

  await user.click(screen.getByRole('button', { name: labels.retry }))
  expect(
    await screen.findByText(labels.monitoringConsumersPage.customizedQuotaConsumersOnConsumers)
  ).toBeVisible()
  expect(screen.getByText(`${saturation.eservice.name}, V${saturation.version}`)).toBeVisible()
  expect(
    screen.getByText(`${saturation.customizedQuotaConsumers}/${saturation.activeConsumers}`)
  ).toBeVisible()
  expect(screen.queryByText(labels.loadError)).not.toBeInTheDocument()
  expect(getSaturation).toHaveBeenCalledTimes(2)
})
