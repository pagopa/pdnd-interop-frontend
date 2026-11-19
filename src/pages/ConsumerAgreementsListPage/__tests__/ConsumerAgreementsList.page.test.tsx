import React from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { NuqsTestingAdapter } from 'nuqs/adapters/testing'
import { AgreementServices } from '@/api/agreement'
import { queryClient } from '@/config/query-client'
import { mockUseJwt, renderWithApplicationContext } from '@/utils/testing.utils'
import { createMockAgreementListingItem } from '@/../__mocks__/data/agreement.mocks'
import ConsumerAgreementsListPage from '../ConsumerAgreementsList.page'

const renderPage = () =>
  renderWithApplicationContext(
    <NuqsTestingAdapter hasMemory>
      <ConsumerAgreementsListPage />
    </NuqsTestingAdapter>,
    { withRouterContext: true, withReactQueryContext: true }
  )

describe('ConsumerAgreementsListPage integrated pagination', () => {
  beforeEach(() => {
    queryClient.clear()
    mockUseJwt()
    const pagination = { offset: 0, limit: 50, totalCount: 0 }
    vi.spyOn(AgreementServices, 'getProducers').mockResolvedValue({ results: [], pagination })
    vi.spyOn(AgreementServices, 'getConsumerEServiceList').mockResolvedValue({
      results: [],
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
  })

  it('uses a single paginator to change page and resets the page when changing page size', async () => {
    renderPage()
    const user = userEvent.setup()
    const pagination = await screen.findByRole('navigation', { name: 'pagination navigation' })

    expect(screen.getAllByRole('navigation', { name: 'pagination navigation' })).toHaveLength(1)
    const table = within(await screen.findByRole('table', { name: 'title' }))
    expect(table.getByRole('cell', { name: 'Provider 0/10' })).toBeInTheDocument()
    await user.click(within(pagination).getByRole('button', { name: /2/ }))

    expect(await screen.findByRole('cell', { name: 'Provider 10/10' })).toBeInTheDocument()
    await user.click(screen.getByRole('combobox', { name: 'Select number of items per page' }))
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
    expect(
      screen.queryByRole('combobox', { name: 'Select number of items per page' })
    ).not.toBeInTheDocument()
  })
})
