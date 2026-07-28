import React from 'react'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { waitFor } from '@testing-library/react'
import { AttributeServices } from '@/api/attribute'
import { FEATURE_FLAG_ATTRIBUTE_CERTIFIED_DISCRETE } from '@/config/env'
import { queryClient } from '@/config/query-client'
import {
  mockUseGetActiveUserParty,
  mockUseJwt,
  renderWithApplicationContext,
} from '@/utils/testing.utils'
import { ManageAttributesTab } from '../ManageAttributesTab'

vi.mock('../CreateAttributeDrawer', () => ({
  CreateAttributeDrawer: ({ isOpen }: { isOpen: boolean }) => (
    <div data-testid="create-attribute-drawer" data-open={String(isOpen)} />
  ),
}))

vi.mock('../AttributesTable', () => ({
  AttributesTable: ({ attributes }: { attributes: Array<{ id: string }> }) => (
    <div data-testid="attributes-table">{attributes.length}</div>
  ),
  AttributesTableSkeleton: () => <div data-testid="attributes-table-skeleton" />,
}))

vi.mock('@pagopa/interop-fe-commons', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@pagopa/interop-fe-commons')>()

  return {
    ...actual,
    Filters: () => <div data-testid="filters" />,
    Pagination: ({ totalPages }: { totalPages: number }) => (
      <div data-testid="pagination">{totalPages}</div>
    ),
    usePagination: () => ({
      paginationParams: { limit: 10, offset: 0 },
      paginationProps: {},
      getTotalPageCount: (totalCount = 0) => Math.ceil(totalCount / 10),
      rowPerPageOptions: [10, 20],
    }),
    useFilters: () => ({
      filtersParams: { q: 'test filter' },
    }),
  }
})

describe('ManageAttributesTab', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    queryClient.clear()
    mockUseJwt()
    mockUseGetActiveUserParty({
      data: {
        features: [{ certifier: { certifierId: 'certifier-id-001' } }],
      },
    })

    vi.spyOn(AttributeServices, 'getList').mockResolvedValue({
      pagination: { offset: 0, limit: 10, totalCount: 25 },
      results: [{ id: 'attribute-1', name: 'attribute 1', kind: 'CERTIFIED' }],
    })
  })

  it('renders admin actions and passes expected service params', async () => {
    const getListSpy = vi.spyOn(AttributeServices, 'getList').mockResolvedValue({
      pagination: { offset: 0, limit: 10, totalCount: 30 },
      results: [
        { id: 'attribute-1', name: 'attribute 1', kind: 'CERTIFIED' },
        { id: 'attribute-2', name: 'attribute 2', kind: 'CERTIFIED_DISCRETE' },
      ],
    })

    renderWithApplicationContext(<ManageAttributesTab />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    expect(screen.getByRole('button', { name: 'createNewBtn' })).toBeInTheDocument()
    expect(screen.getByTestId('filters')).toBeInTheDocument()
    expect(screen.getByTestId('create-attribute-drawer')).toHaveAttribute('data-open', 'false')

    const expectedKinds = FEATURE_FLAG_ATTRIBUTE_CERTIFIED_DISCRETE
      ? ['CERTIFIED', 'CERTIFIED_DISCRETE']
      : ['CERTIFIED']

    await waitFor(() => {
      expect(screen.getByTestId('attributes-table')).toHaveTextContent('2')
      expect(screen.getByTestId('pagination')).toHaveTextContent('3')
      expect(getListSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          origin: 'certifier-id-001',
          kinds: expectedKinds,
        })
      )
    })
  })

  it('opens the drawer when clicking on create button', async () => {
    const user = userEvent.setup()

    renderWithApplicationContext(<ManageAttributesTab />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    await user.click(screen.getByRole('button', { name: 'createNewBtn' }))

    expect(screen.getByTestId('create-attribute-drawer')).toHaveAttribute('data-open', 'true')
  })

  it('does not render admin actions when user is not admin', async () => {
    mockUseJwt({ isAdmin: false })

    renderWithApplicationContext(<ManageAttributesTab />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    expect(screen.queryByRole('button', { name: 'createNewBtn' })).not.toBeInTheDocument()
    expect(screen.queryByTestId('create-attribute-drawer')).not.toBeInTheDocument()
    expect(await screen.findByTestId('attributes-table')).toBeInTheDocument()
  })

  it('handles missing certifierId in active party features', async () => {
    const getListSpy = vi.spyOn(AttributeServices, 'getList')
    mockUseGetActiveUserParty({ data: { features: [] } })

    renderWithApplicationContext(<ManageAttributesTab />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    const expectedKinds = FEATURE_FLAG_ATTRIBUTE_CERTIFIED_DISCRETE
      ? ['CERTIFIED', 'CERTIFIED_DISCRETE']
      : ['CERTIFIED']

    await waitFor(() => {
      expect(getListSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          origin: undefined,
          kinds: expectedKinds,
        })
      )
      expect(screen.getByTestId('attributes-table')).toBeInTheDocument()
    })
  })

  it('renders skeleton while loading attributes list', () => {
    vi.spyOn(AttributeServices, 'getList').mockImplementation(() => new Promise(() => undefined))

    renderWithApplicationContext(<ManageAttributesTab />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    expect(screen.getByTestId('attributes-table-skeleton')).toBeInTheDocument()
    expect(screen.queryByTestId('attributes-table')).not.toBeInTheDocument()
  })
})
