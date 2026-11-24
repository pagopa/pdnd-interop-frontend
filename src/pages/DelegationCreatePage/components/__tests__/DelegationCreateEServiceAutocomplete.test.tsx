import React from 'react'
import { screen } from '@testing-library/react'
import { useQuery } from '@tanstack/react-query'
import { vi } from 'vitest'
import { renderWithApplicationContext } from '@/utils/testing.utils'
import { createMockCompactEServiceCatalog } from '../../../../../__mocks__/data/eservice.mocks'
import { DelegationCreateEServiceAutocomplete } from '../DelegationCreateEServiceAutocomplete'

const { mockedGetProviderList, mockedGetCompactCatalogList } = vi.hoisted(() => ({
  mockedGetProviderList: vi.fn(() => ({ queryKey: ['provider-list'], queryFn: vi.fn() })),
  mockedGetCompactCatalogList: vi.fn(() => ({
    queryKey: ['compact-catalog-list'],
    queryFn: vi.fn(),
  })),
}))

vi.mock('@tanstack/react-query', async () => {
  const actual =
    await vi.importActual<typeof import('@tanstack/react-query')>('@tanstack/react-query')

  return {
    ...actual,
    useQuery: vi.fn(),
  }
})

vi.mock('@pagopa/interop-fe-commons', async () => {
  const actual = await vi.importActual<typeof import('@pagopa/interop-fe-commons')>(
    '@pagopa/interop-fe-commons'
  )

  return {
    ...actual,
    useAutocompleteTextInput: () => ['', vi.fn()],
  }
})

vi.mock('@/api/eservice', () => ({
  EServiceQueries: {
    getProviderList: mockedGetProviderList,
    getCompactCatalogList: mockedGetCompactCatalogList,
  },
}))

vi.mock('@/components/shared/react-hook-form-inputs', () => ({
  RHFAutocompleteSingle: ({
    label,
    options,
  }: {
    label: string
    options: Array<{ label: string; value: string }>
  }) => (
    <div>
      <div>{label}</div>
      <ul>
        {options.map((option) => (
          <li key={option.value}>{option.label}</li>
        ))}
      </ul>
    </div>
  ),
}))

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}))

describe('DelegationCreateEServiceAutocomplete', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useQuery).mockReturnValue({ data: [], isLoading: false } as ReturnType<
      typeof useQuery
    >)
  })

  it('filters out ARCHIVED e-services from the provider autocomplete for a producer delegation', () => {
    renderWithApplicationContext(
      <DelegationCreateEServiceAutocomplete delegationKind="DELEGATED_PRODUCER" />,
      { withReactQueryContext: true }
    )

    expect(mockedGetProviderList).toHaveBeenCalledWith(
      expect.objectContaining({
        q: '',
        limit: 50,
        offset: 0,
        delegated: false,
        personalData: 'DEFINED',
        states: [
          'PUBLISHED',
          'DEPRECATED',
          'DRAFT',
          'SUSPENDED',
          'WAITING_FOR_APPROVAL',
          'ARCHIVING',
          'ARCHIVING_SUSPENDED',
        ],
      })
    )

    expect(mockedGetCompactCatalogList).toHaveBeenCalledWith(
      expect.objectContaining({
        q: '',
        limit: 50,
        offset: 0,
        states: ['PUBLISHED'],
        isConsumerDelegable: true,
      })
    )
  })

  it('maps consumer e-services from the compact catalog endpoint into autocomplete options', () => {
    const eservice = createMockCompactEServiceCatalog({
      id: 'e-1',
      name: 'E-service 1',
      producer: { id: 'p-1', name: 'Org 1' },
    })

    vi.mocked(useQuery).mockImplementation(
      (options) =>
        ({
          data: options.queryKey[0] === 'compact-catalog-list' ? [eservice] : [],
          isLoading: false,
        }) as ReturnType<typeof useQuery>
    )

    renderWithApplicationContext(
      <DelegationCreateEServiceAutocomplete delegationKind="DELEGATED_CONSUMER" />,
      { withReactQueryContext: true }
    )

    expect(
      screen.getByText('E-service 1 delegations.create.eserviceField.eserviceNameLabel Org 1')
    ).toBeInTheDocument()
  })
})
