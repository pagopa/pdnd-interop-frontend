import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createInstance, type Resource } from 'i18next'
import { I18nextProvider } from 'react-i18next'
import { ThemeProvider } from '@mui/material'
import { theme } from '@pagopa/interop-fe-commons'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { NuqsAdapter } from 'nuqs/adapters/react-router/v6'
import { ProducerServices } from '@/api/producer'
import axiosInstance from '@/config/axios'
import { mockUseJwt } from '@/utils/testing.utils'
import ProviderAgreementsListPage from '@/pages/ProviderAgreementsListPage/ProviderAgreementsList.page'
import { ProviderEServiceMonitoringTab } from '../ProviderEServiceMonitoringTab'
import {
  getMockProducerEServiceMonitoring,
  getMockProducerEServiceMonitoringArchiving,
  getMockProducerEServiceMonitoringSaturation,
} from '../../../../../../__mocks__/data/producer-monitoring.mocks'
import itEservice from '@/static/locales/it/eservice.json'
import enEservice from '@/static/locales/en/eservice.json'
import itAgreement from '@/static/locales/it/agreement.json'
import enAgreement from '@/static/locales/en/agreement.json'

vi.unmock('react-i18next')

const ESERVICE_ID = '10000000-0000-4000-8000-000000000001'
const DESCRIPTOR_ID = '20000000-0000-4000-8000-000000001001'
const ESERVICE_NAME = 'Servizio / dati & sicurezza'
const modules = import.meta.glob<{ default: Record<string, unknown> }>(
  '/src/static/locales/{it,en}/*.json',
  { eager: true }
)
const resources = Object.entries(modules).reduce<Resource>((result, [path, mod]) => {
  const parts = path.split('/')
  const language = parts[parts.length - 2]
  const namespace = parts[parts.length - 1].replace('.json', '')
  result[language] ??= {}
  result[language][namespace] = mod.default
  return result
}, {})

describe('monitoring pending agreements navigation', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it.each([
    ['it', itEservice, itAgreement],
    ['en', enEservice, enAgreement],
  ] as const)(
    'passes both real destination filters to the agreements HTTP request in %s',
    async (language, eservice, agreement) => {
      mockUseJwt({ currentRoles: ['admin'] })
      vi.spyOn(ProducerServices, 'getEServiceMonitoring').mockImplementation(async (params) =>
        getMockProducerEServiceMonitoring(params)
      )
      vi.spyOn(ProducerServices, 'getEServiceMonitoringSaturation').mockImplementation(
        async (params) => getMockProducerEServiceMonitoringSaturation(params)
      )
      vi.spyOn(ProducerServices, 'getEServiceMonitoringArchiving').mockImplementation(
        async (params) => getMockProducerEServiceMonitoringArchiving(params)
      )
      const http = vi.spyOn(axiosInstance, 'get').mockResolvedValue({
        data: { results: [], pagination: { offset: 0, limit: 50, totalCount: 0 } },
      })
      const i18n = createInstance()
      await i18n.init({ lng: language, fallbackLng: false, resources })
      const client = new QueryClient({ defaultOptions: { queries: { retry: false, gcTime: 0 } } })
      const user = userEvent.setup()
      window.history.replaceState(
        null,
        '',
        `/${language}/erogazione/e-service/${ESERVICE_ID}/${DESCRIPTOR_ID}?tab=monitoring`
      )
      render(
        <QueryClientProvider client={client}>
          <I18nextProvider i18n={i18n}>
            <ThemeProvider theme={theme}>
              <BrowserRouter>
                <NuqsAdapter>
                  <Routes>
                    <Route
                      path="/:language/erogazione/e-service/:eserviceId/:descriptorId"
                      element={<ProviderEServiceMonitoringTab eserviceName={ESERVICE_NAME} />}
                    />
                    <Route
                      path="/:language/erogazione/richieste"
                      element={<ProviderAgreementsListPage />}
                    />
                  </Routes>
                </NuqsAdapter>
              </BrowserRouter>
            </ThemeProvider>
          </I18nextProvider>
        </QueryClientProvider>
      )

      await user.click(
        await screen.findByRole('button', {
          name: eservice.read.monitoring.versions.pendingAgreementsCard.action,
        })
      )

      const pendingLabel = agreement.list.filters.statusField.optionLabels.PENDING
      await waitFor(() => {
        expect(window.location.pathname).toBe(`/${language}/erogazione/richieste`)
        const search = new URLSearchParams(window.location.search)
        expect(JSON.parse(search.get('eservicesIds') ?? '')).toEqual([[ESERVICE_NAME, ESERVICE_ID]])
        expect(JSON.parse(search.get('states') ?? '')).toEqual([[pendingLabel, 'PENDING']])
        expect(http.mock.calls).toEqual(
          expect.arrayContaining([
            [
              expect.stringMatching(/\/producers\/agreements$/),
              expect.objectContaining({
                params: expect.objectContaining({
                  eservicesIds: [ESERVICE_ID],
                  states: ['PENDING'],
                }),
              }),
            ],
          ])
        )
      })
      const agreementRequests = http.mock.calls.filter(([url]) =>
        String(url).endsWith('/producers/agreements')
      )
      expect(agreementRequests.length).toBeGreaterThan(0)
      for (const [, config] of agreementRequests) {
        expect(config?.params).toEqual(
          expect.objectContaining({ eservicesIds: [ESERVICE_ID], states: ['PENDING'] })
        )
      }
      expect(await screen.findByText(ESERVICE_NAME)).toBeInTheDocument()
      expect(screen.getByText(pendingLabel)).toBeInTheDocument()
    }
  )
})
