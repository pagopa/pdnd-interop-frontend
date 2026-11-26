import React from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { NuqsAdapter } from 'nuqs/adapters/react-router/v6'
import { BrowserRouter } from 'react-router-dom'
import { AgreementServices } from '@/api/agreement'
import { queryClient } from '@/config/query-client'
import { mockUseJwt, renderWithApplicationContext } from '@/utils/testing.utils'
import { createMockAgreementListingItem } from '@/../__mocks__/data/agreement.mocks'
import ConsumerAgreementsListPage from '../ConsumerAgreementsList.page'

const renderPage = (searchParams = '') => {
  window.history.replaceState(null, '', `/it/fruizione/richieste?${searchParams}`)
  return renderWithApplicationContext(
    <BrowserRouter>
      <NuqsAdapter>
        <ConsumerAgreementsListPage />
      </NuqsAdapter>
    </BrowserRouter>,
    { withReactQueryContext: true }
  )
}

const initialFilters = {
  eservicesIds: 'eservice-1',
  producersIds: 'producer-1',
  states: 'ACTIVE,SUSPENDED',
}

describe('ConsumerAgreementsListPage filters and pagination', () => {
  beforeEach(() => {
    queryClient.clear()
    mockUseJwt()
    vi.spyOn(window, 'scrollTo').mockImplementation(() => undefined)
    const pagination = { offset: 0, limit: 50, totalCount: 0 }
    vi.spyOn(AgreementServices, 'getProducers').mockResolvedValue({
      results: [{ id: 'producer-1', name: 'Registry provider' }],
      pagination,
    })
    vi.spyOn(AgreementServices, 'getConsumerEServiceList').mockResolvedValue({
      results: [{ id: 'eservice-1', name: 'Registry service' }],
      pagination,
    })
    vi.spyOn(AgreementServices, 'getConsumerAgreementsList').mockImplementation(async (params) => ({
      results: [
        createMockAgreementListingItem({
          eservice: {
            producer: { name: `Provider ${params?.offset ?? 0}/${params?.limit ?? 10}` },
          },
        }),
      ],
      pagination: { offset: params?.offset ?? 0, limit: params?.limit ?? 10, totalCount: 30 },
    }))
  })

  afterEach(() => {
    queryClient.clear()
    window.history.replaceState(null, '', '/')
    vi.mocked(window.scrollTo).mockRestore()
    vi.clearAllMocks()
  })

  it('omits empty filters from the agreement request', async () => {
    renderPage()

    await waitFor(() =>
      expect(AgreementServices.getConsumerAgreementsList).toHaveBeenLastCalledWith({
        limit: 10,
        offset: 0,
      })
    )
  })

  it('reads all pre-populated filters as arrays of IDs and states', async () => {
    renderPage(new URLSearchParams(initialFilters).toString())
    const user = userEvent.setup()

    await waitFor(() =>
      expect(AgreementServices.getConsumerAgreementsList).toHaveBeenLastCalledWith({
        limit: 10,
        offset: 0,
        eservicesIds: ['eservice-1'],
        producersIds: ['producer-1'],
        states: ['ACTIVE', 'SUSPENDED'],
      })
    )
    for (const { field, option } of [
      { field: 'eserviceField.label', option: 'Registry service' },
      { field: 'providerField.label', option: 'Registry provider' },
      { field: 'statusField.label', option: 'statusField.optionLabels.ACTIVE' },
    ]) {
      await user.click(screen.getByRole('combobox', { name: field }))
      expect(
        await screen.findByRole('option', { name: option, selected: true })
      ).toBeInTheDocument()
      await user.keyboard('{Escape}')
    }
  })

  it('applies all autocomplete filters and returns to the first page', async () => {
    renderPage('limit=24&offset=24')
    const user = userEvent.setup()
    expect(await screen.findByRole('cell', { name: 'Provider 24/24' })).toBeInTheDocument()

    await user.click(screen.getByRole('combobox', { name: 'eserviceField.label' }))
    await user.click(await screen.findByRole('option', { name: 'Registry service' }))
    await user.keyboard('{Escape}')
    await user.click(screen.getByRole('combobox', { name: 'providerField.label' }))
    await user.click(await screen.findByRole('option', { name: 'Registry provider' }))
    await user.keyboard('{Escape}')
    await user.click(screen.getByRole('combobox', { name: 'statusField.label' }))
    await user.click(await screen.findByRole('option', { name: 'statusField.optionLabels.ACTIVE' }))
    await user.click(screen.getByRole('option', { name: 'statusField.optionLabels.SUSPENDED' }))
    await user.keyboard('{Escape}')

    expect(AgreementServices.getConsumerAgreementsList).toHaveBeenLastCalledWith({
      limit: 24,
      offset: 24,
    })
    await user.click(screen.getByRole('button', { name: 'button' }))

    await waitFor(() =>
      expect(AgreementServices.getConsumerAgreementsList).toHaveBeenLastCalledWith({
        limit: 24,
        offset: 0,
        eservicesIds: ['eservice-1'],
        producersIds: ['producer-1'],
        states: ['ACTIVE', 'SUSPENDED'],
      })
    )
    await waitFor(() => {
      const searchParams = new URLSearchParams(window.location.search)
      expect(searchParams.get('eservicesIds')).toBe('eservice-1')
      expect(searchParams.get('producersIds')).toBe('producer-1')
      expect(searchParams.get('states')).toBe('ACTIVE,SUSPENDED')
      expect(searchParams.has('offset')).toBe(false)
    })
  })

  it('omits a cleared multi-value filter while retaining the other filters', async () => {
    renderPage(
      new URLSearchParams({
        ...initialFilters,
        states: 'ACTIVE',
      }).toString()
    )
    const user = userEvent.setup()
    await user.click(screen.getByRole('combobox', { name: 'statusField.label' }))
    await user.click(await screen.findByRole('option', { name: 'statusField.optionLabels.ACTIVE' }))
    await user.keyboard('{Escape}')
    await user.click(screen.getByRole('button', { name: 'button' }))

    await waitFor(() =>
      expect(AgreementServices.getConsumerAgreementsList).toHaveBeenLastCalledWith({
        limit: 10,
        offset: 0,
        eservicesIds: ['eservice-1'],
        producersIds: ['producer-1'],
      })
    )
  })

  it.each([0, 20])(
    'resets filters and returns to the first page from offset %s',
    async (offset) => {
      renderPage(new URLSearchParams({ ...initialFilters, offset: String(offset) }).toString())
      const user = userEvent.setup()
      await user.click(screen.getByRole('button', { name: 'remove' }))

      await waitFor(() =>
        expect(AgreementServices.getConsumerAgreementsList).toHaveBeenLastCalledWith({
          limit: 10,
          offset: 0,
        })
      )
      expect(screen.queryByRole('button', { name: 'remove' })).not.toBeInTheDocument()
    }
  )

  it.each([
    { field: 'providerField.label', service: 'getProducers' },
    { field: 'eserviceField.label', service: 'getConsumerEServiceList' },
  ] as const)(
    'searches dynamic options for $field without applying a filter',
    async ({ field, service }) => {
      renderPage()
      const user = userEvent.setup()
      await user.type(screen.getByRole('combobox', { name: field }), 'Registry')

      await waitFor(() =>
        expect(AgreementServices[service]).toHaveBeenLastCalledWith({
          limit: 50,
          offset: 0,
          q: 'Registry',
        })
      )
      expect(AgreementServices.getConsumerAgreementsList).toHaveBeenLastCalledWith({
        limit: 10,
        offset: 0,
      })
    }
  )

  it('uses a single paginator to change page and resets the page when changing page size', async () => {
    renderPage()
    const user = userEvent.setup()
    const pagination = await screen.findByRole('navigation', { name: 'pagination navigation' })

    expect(screen.getAllByRole('navigation', { name: 'pagination navigation' })).toHaveLength(1)
    const table = within(await screen.findByRole('table', { name: 'title' }))
    expect(table.getByRole('cell', { name: 'Provider 0/10' })).toBeInTheDocument()
    await user.click(within(pagination).getByRole('button', { name: /2/ }))

    expect(await screen.findByRole('cell', { name: 'Provider 10/10' })).toBeInTheDocument()
    await user.click(within(screen.getByTestId('items-per-page-select')).getByRole('combobox'))
    await user.click(await screen.findByRole('option', { name: '24' }))

    expect(await screen.findByRole('cell', { name: 'Provider 0/24' })).toBeInTheDocument()
    await waitFor(() =>
      expect(AgreementServices.getConsumerAgreementsList).toHaveBeenLastCalledWith(
        expect.objectContaining({ limit: 24, offset: 0 })
      )
    )
    expect(
      within(screen.getByRole('navigation', { name: 'pagination navigation' })).getByRole(
        'button',
        { name: /1/, current: true }
      )
    ).toBeInTheDocument()
  })

  it('does not render pagination when there are no results', async () => {
    vi.spyOn(AgreementServices, 'getConsumerAgreementsList').mockResolvedValue({
      results: [],
      pagination: { offset: 0, limit: 10, totalCount: 0 },
    })
    renderPage()

    expect(await screen.findByText('noDataLabel')).toBeInTheDocument()
    expect(
      screen.queryByRole('navigation', { name: 'pagination navigation' })
    ).not.toBeInTheDocument()
    expect(screen.queryByTestId('items-per-page-select')).not.toBeInTheDocument()
  })
})
