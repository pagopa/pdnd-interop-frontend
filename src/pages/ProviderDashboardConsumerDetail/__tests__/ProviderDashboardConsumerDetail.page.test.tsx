import type { ReactNode } from 'react'
import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createInstance } from 'i18next'
import { I18nextProvider } from 'react-i18next'
import { ThemeProvider } from '@mui/material'
import { theme } from '@pagopa/mui-italia'
import { MemoryRouter, Route, Routes, useNavigate } from 'react-router-dom'
import { NuqsTestingAdapter } from 'nuqs/adapters/testing'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type * as LayoutContainers from '@/components/layout/containers'
import type { ProducerDashboardConsumer } from '@/api/api.generatedTypes'
import { ProducerServices } from '@/api/producer'
import { formatThousands } from '@/utils/format.utils'
import ProviderDashboardConsumerDetail from '../ProviderDashboardConsumerDetail.page'
import {
  getMockProducerDashboardConsumer,
  mockProducerDashboardConsumerEServices,
} from '../../../../__mocks__/data/producer.mocks'
import itPages from '@/static/locales/it/pages.json'
import enPages from '@/static/locales/en/pages.json'
import itCommon from '@/static/locales/it/common.json'
import enCommon from '@/static/locales/en/common.json'
import itFilters from '@/static/locales/it/filters.json'
import enFilters from '@/static/locales/en/filters.json'

vi.unmock('react-i18next')
vi.mock('@/api/producer/producer.services', () => ({
  ProducerServices: { getDashboardConsumer: vi.fn() },
}))

vi.mock('@/components/layout/containers', async (importOriginal) => {
  const actual = (await importOriginal()) as typeof LayoutContainers
  return {
    ...actual,
    PageContainer: ({
      isLoading,
      title,
      description,
      children,
    }: {
      isLoading?: boolean
      title: string
      description: string
      children: ReactNode
    }) => (
      <main>
        {!isLoading && <h1>{title}</h1>}
        <p>{description}</p>
        {children}
      </main>
    ),
  }
})

const LOMBARDIA_ID = '00000000-0000-4000-8000-000000000013'
const ROMA_ID = '00000000-0000-4000-8000-000000000001'
const UNKNOWN_ID = '99999999-0000-4000-8000-000000000000'
const getConsumer = vi.mocked(ProducerServices.getDashboardConsumer)
const copy = itPages.providerDashboardConsumerDetail
const resultCount = (count: number) =>
  screen.queryByText(
    (_, element) => element?.tagName === 'P' && element.textContent === `${count} risultati`
  )
const summaryValue = (label: string = copy.summary) => screen.getByText(label).nextElementSibling

const GoToConsumer = ({ consumerId }: { consumerId: string }) => {
  const navigate = useNavigate()
  return <button onClick={() => navigate(`/fruitori/${consumerId}`)}>switch consumer</button>
}

const renderPage = async ({
  language = 'it',
  consumerId = LOMBARDIA_ID,
  search = '',
}: { language?: 'it' | 'en'; consumerId?: string; search?: string } = {}) => {
  const i18n = createInstance()
  await i18n.init({
    lng: language,
    fallbackLng: false,
    resources: {
      it: { pages: itPages, filters: itFilters, common: itCommon },
      en: { pages: enPages, filters: enFilters, common: enCommon },
    },
  })
  const client = new QueryClient({ defaultOptions: { queries: { retry: false, gcTime: 0 } } })
  return render(
    <QueryClientProvider client={client}>
      <I18nextProvider i18n={i18n}>
        <ThemeProvider theme={theme}>
          <MemoryRouter initialEntries={[`/fruitori/${consumerId}${search}`]}>
            <NuqsTestingAdapter searchParams={search} hasMemory>
              <Routes>
                <Route
                  path="/fruitori/:consumerId"
                  element={
                    <>
                      <GoToConsumer consumerId={ROMA_ID} />
                      <ProviderDashboardConsumerDetail />
                    </>
                  }
                />
                <Route
                  path="/:language/erogazione/e-service/:eserviceId/:descriptorId"
                  element={<p>Version destination</p>}
                />
              </Routes>
            </NuqsTestingAdapter>
          </MemoryRouter>
        </ThemeProvider>
      </I18nextProvider>
    </QueryClientProvider>
  )
}

describe('ProviderDashboardConsumerDetail', () => {
  beforeEach(() => {
    getConsumer.mockReset()
    getConsumer.mockImplementation(async (params) => getMockProducerDashboardConsumer(params))
  })

  it.each([
    { language: 'it', labels: itPages.providerDashboardConsumerDetail, common: itCommon },
    { language: 'en', labels: enPages.providerDashboardConsumerDetail, common: enCommon },
  ] as const)(
    'renders the $language consumer identity, overall count and e-service rows',
    async ({ language, labels, common }) => {
      await renderPage({ language })

      expect(
        await screen.findByRole('heading', { level: 1, name: 'Regione Lombardia' })
      ).toBeInTheDocument()
      expect(getConsumer).toHaveBeenCalledExactlyOnceWith({
        consumerId: LOMBARDIA_ID,
        offset: 0,
        limit: 10,
        q: undefined,
        sortBy: 'NAME_ASC',
      })
      expect(summaryValue(labels.summary)).toHaveTextContent('15')
      const { actions: _actions, ...dataColumns } = labels.columns
      Object.values(dataColumns).forEach((label) => {
        expect(screen.getByRole('columnheader', { name: label })).toBeInTheDocument()
      })
      expect(screen.getAllByRole('row')).toHaveLength(11)

      const first = [...mockProducerDashboardConsumerEServices[LOMBARDIA_ID]].sort((a, b) =>
        a.eservice.name.localeCompare(b.eservice.name, 'it')
      )[0]
      const row = screen.getAllByRole('row')[1]
      expect(row.querySelector('p p, p div')).not.toBeInTheDocument()
      expect(within(row).getByText(first.eservice.name)).toBeInTheDocument()
      expect(
        within(row).getByText(labels.version.replace('{{version}}', first.version))
      ).toBeInTheDocument()
      expect(
        within(row).getByText(common.status.agreement[first.agreement.state])
      ).toBeInTheDocument()
      expect(within(row).getByText(String(first.activePurposesCount))).toBeInTheDocument()
      expect(within(row).getByText(formatThousands(first.approvedDailyCalls))).toBeInTheDocument()

      const eserviceLink = within(row).getByRole('link', {
        name: labels.goToEServiceDetail
          .replace('{{name}}', first.eservice.name)
          .replace('{{version}}', first.version),
      })
      expect(eserviceLink).toHaveAttribute(
        'href',
        `/${language}/erogazione/e-service/${first.eservice.id}/${first.descriptorId}`
      )
      expect(eserviceLink).toHaveClass('MuiIconButton-colorInherit')
      expect(eserviceLink).not.toHaveClass('MuiIconButton-colorPrimary')
      expect(eserviceLink).toHaveTextContent(/^$/)
      expect(within(eserviceLink).getByTestId('ChevronRightIcon')).toHaveAttribute(
        'aria-hidden',
        'true'
      )
      expect(eserviceLink.children).toHaveLength(1)
      expect(within(row).queryByText(labels.goToEService)).not.toBeInTheDocument()
      const exportButton = screen.getByRole('button', { name: labels.export })
      expect(exportButton).toBeEnabled()
      expect(exportButton).toHaveClass('MuiButton-outlinedPrimary', 'MuiButton-sizeSmall')
      expect(exportButton).toHaveStyle({ borderRadius: theme.shape.radius[8] })
      expect(within(exportButton).getByTestId('FileDownloadOutlinedIcon')).toHaveAttribute(
        'aria-hidden',
        'true'
      )
      await userEvent.click(exportButton)
      expect(getConsumer).toHaveBeenCalledTimes(1)
    }
  )

  it('opens the version link using the keyboard', async () => {
    const user = userEvent.setup()
    await renderPage()
    const link = (await screen.findAllByRole('link', { name: /^Vedi e-service /i }))[0]
    link.focus()
    expect(link).toHaveFocus()
    await user.keyboard('{Enter}')
    expect(await screen.findByText('Version destination')).toBeInTheDocument()
  })

  it('shows loading skeletons without a false zero or a stale title', async () => {
    getConsumer.mockImplementation(() => new Promise(() => undefined))
    const { container } = await renderPage()
    await waitFor(() => expect(getConsumer).toHaveBeenCalled())
    expect(screen.queryByRole('heading', { level: 1 })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: copy.export })).not.toBeInTheDocument()
    expect(container.querySelector('[aria-busy="true"]')).toBeInTheDocument()
    expect(container.querySelectorAll('.MuiSkeleton-root').length).toBeGreaterThan(5)
    expect(resultCount(0)).not.toBeInTheDocument()
    expect(screen.queryByRole('navigation')).not.toBeInTheDocument()
  })

  it('associates mobile values with labels and retains descriptor links and filter reset', async () => {
    vi.stubGlobal('matchMedia', (query: string) => ({
      matches: true,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }))
    try {
      const user = userEvent.setup()
      await renderPage({ search: '?offset=10&q=isee' })
      const group = await screen.findByRole('group', { name: 'Regione Lombardia' })
      await user.click(screen.getByRole('button', { name: itFilters.remove }))
      await waitFor(() =>
        expect(getConsumer).toHaveBeenLastCalledWith(
          expect.objectContaining({ consumerId: LOMBARDIA_ID, offset: 0, q: undefined })
        )
      )
      const first = getMockProducerDashboardConsumer({
        consumerId: LOMBARDIA_ID,
        offset: 0,
        limit: 10,
        sortBy: 'NAME_ASC',
      }).results[0]
      const row = (await within(group).findByText(first.eservice.name)).closest(
        'dl'
      )!.parentElement!
      expect(screen.queryByRole('table')).not.toBeInTheDocument()
      expect(
        within(row).getByRole('definition', { name: copy.columns.eservice })
      ).toHaveTextContent(first.eservice.name)
      expect(
        within(row).getByRole('definition', { name: copy.columns.agreementState })
      ).toHaveTextContent(itCommon.status.agreement[first.agreement.state])
      expect(
        within(row).getByRole('link', {
          name: copy.goToEServiceDetail
            .replace('{{name}}', first.eservice.name)
            .replace('{{version}}', first.version),
        })
      ).toHaveAttribute(
        'href',
        `/it/erogazione/e-service/${first.eservice.id}/${first.descriptorId}`
      )
      expect(group).toHaveAttribute('aria-busy', 'false')
      expect(screen.getByRole('textbox', { name: copy.searchPlaceholder })).toHaveValue('')
    } finally {
      vi.unstubAllGlobals()
    }
  })

  it('submits q, resets offset and keeps the overall e-service count', async () => {
    const user = userEvent.setup()
    await renderPage({ search: '?offset=10' })
    await screen.findByRole('heading', { level: 1, name: 'Regione Lombardia' })
    expect(screen.getAllByRole('row')).toHaveLength(6)

    await user.type(screen.getByRole('textbox', { name: copy.searchPlaceholder }), 'isee')
    await user.click(screen.getByRole('button', { name: itFilters.button }))
    await waitFor(() =>
      expect(getConsumer).toHaveBeenLastCalledWith(
        expect.objectContaining({ consumerId: LOMBARDIA_ID, offset: 0, q: 'isee' })
      )
    )
    await screen.findByText('Verifica ISEE')
    expect(screen.getAllByRole('row')).toHaveLength(2)
    expect(resultCount(1)).toBeInTheDocument()
    expect(summaryValue()).toHaveTextContent('15')
  })

  it.each([
    { sortBy: 'NAME_DESC', initial: 'NAME_ASC' },
    { sortBy: 'DAILY_CALLS_DESC', initial: 'NAME_ASC' },
    { sortBy: 'DAILY_CALLS_ASC', initial: 'NAME_ASC' },
    { sortBy: 'NAME_ASC', initial: 'NAME_DESC' },
  ] as const)('queries $sortBy and resets the current page', async ({ sortBy, initial }) => {
    const user = userEvent.setup()
    await renderPage({ search: `?offset=10&sortBy=${initial}` })
    await screen.findByRole('table')
    await user.click(screen.getByRole('button', { name: copy.sorting[initial] }))
    await user.click(screen.getByRole('menuitem', { name: copy.sorting[sortBy] }))
    await waitFor(() =>
      expect(getConsumer).toHaveBeenLastCalledWith(
        expect.objectContaining({ consumerId: LOMBARDIA_ID, offset: 0, sortBy })
      )
    )
    const expected = getMockProducerDashboardConsumer({
      consumerId: LOMBARDIA_ID,
      offset: 0,
      limit: 10,
      sortBy,
    }).results[0]
    await waitFor(() =>
      expect(
        within(screen.getAllByRole('row')[1]).getByText(expected.eservice.name)
      ).toBeInTheDocument()
    )
  })

  it('paginates the filtered e-services of the same consumer', async () => {
    const user = userEvent.setup()
    await renderPage()
    await screen.findByRole('heading', { level: 1, name: 'Regione Lombardia' })
    expect(resultCount(15)).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: /page 2/i }))
    await waitFor(() =>
      expect(getConsumer).toHaveBeenLastCalledWith(
        expect.objectContaining({ consumerId: LOMBARDIA_ID, offset: 10, limit: 10 })
      )
    )
    await waitFor(() => expect(screen.getAllByRole('row')).toHaveLength(6))
  })

  it('shows the empty table label when the search has no matches', async () => {
    await renderPage({ search: '?q=missing' })
    await screen.findByText(copy.empty)
    expect(summaryValue()).toHaveTextContent('15')
    expect(resultCount(0)).toBeInTheDocument()
    expect(screen.queryByRole('navigation')).not.toBeInTheDocument()
  })

  it('preserves previous rows only while the same consumer next page is loading', async () => {
    const user = userEvent.setup()
    await renderPage()
    await screen.findByRole('heading', { level: 1, name: 'Regione Lombardia' })
    const previousRows = screen.getAllByRole('row').map((row) => row.textContent)
    let resolve: (value: ProducerDashboardConsumer) => void = () => undefined
    getConsumer.mockImplementationOnce(
      () =>
        new Promise((done) => {
          resolve = done
        })
    )
    await user.click(screen.getByRole('button', { name: /page 2/i }))
    await waitFor(() =>
      expect(getConsumer).toHaveBeenLastCalledWith(
        expect.objectContaining({ consumerId: LOMBARDIA_ID, offset: 10 })
      )
    )
    expect(screen.getAllByRole('row').map((row) => row.textContent)).toEqual(previousRows)
    expect(screen.getByRole('heading', { level: 1, name: 'Regione Lombardia' })).toBeInTheDocument()
    expect(summaryValue()).toHaveTextContent('15')

    resolve(getMockProducerDashboardConsumer({ consumerId: LOMBARDIA_ID, offset: 10, limit: 10 }))
    await waitFor(() => expect(screen.getAllByRole('row')).toHaveLength(6))
  })

  it('shows a no-relationship state with a generic title for an unknown consumer', async () => {
    await renderPage({ consumerId: UNKNOWN_ID })
    expect(await screen.findByRole('alert')).toHaveTextContent(copy.noRelationship)
    expect(screen.getByRole('heading', { level: 1, name: copy.fallbackTitle })).toBeInTheDocument()
    expect(getConsumer).toHaveBeenCalledWith(expect.objectContaining({ consumerId: UNKNOWN_ID }))
    expect(screen.queryByRole('table')).not.toBeInTheDocument()
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument()
  })

  it('shows a retryable error instead of a zero count', async () => {
    const user = userEvent.setup()
    getConsumer.mockRejectedValueOnce(new Error('offline'))
    await renderPage()
    expect(await screen.findByRole('alert')).toHaveTextContent(copy.loadError)
    expect(summaryValue()).toHaveTextContent(copy.unavailable)
    expect(screen.getByRole('heading', { level: 1, name: copy.fallbackTitle })).toBeInTheDocument()
    expect(screen.queryByRole('table')).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: copy.retry }))
    await screen.findByRole('heading', { level: 1, name: 'Regione Lombardia' })
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('never shows the previous consumer data while another consumer loads', async () => {
    const user = userEvent.setup()
    await renderPage()
    await screen.findByRole('heading', { level: 1, name: 'Regione Lombardia' })

    let resolve: (value: ProducerDashboardConsumer) => void = () => undefined
    getConsumer.mockImplementationOnce(
      () =>
        new Promise((done) => {
          resolve = done
        })
    )
    await user.click(screen.getByRole('button', { name: 'switch consumer' }))
    await waitFor(() =>
      expect(getConsumer).toHaveBeenLastCalledWith(expect.objectContaining({ consumerId: ROMA_ID }))
    )
    expect(screen.queryByText('Regione Lombardia')).not.toBeInTheDocument()
    expect(screen.queryByRole('heading', { level: 1 })).not.toBeInTheDocument()
    expect(summaryValue()?.querySelector('.MuiSkeleton-root')).toBeInTheDocument()

    resolve(getMockProducerDashboardConsumer({ consumerId: ROMA_ID, offset: 0, limit: 10 }))
    await screen.findByRole('heading', { level: 1, name: 'Comune di Roma' })
    expect(summaryValue()).toHaveTextContent('8')
  })
})
