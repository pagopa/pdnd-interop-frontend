import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { vi } from 'vitest'
import { renderWithApplicationContext } from '@/utils/testing.utils'
import { DelegationCreateEServiceAutocomplete } from '../DelegationCreateEServiceAutocomplete'

const { mockedGetProviderList, mockedGetCatalogList } = vi.hoisted(() => ({
  mockedGetProviderList: vi.fn(() => ({ queryKey: ['provider-list'], queryFn: vi.fn() })),
  mockedGetCatalogList: vi.fn(() => ({ queryKey: ['catalog-list'], queryFn: vi.fn() })),
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
    getCatalogList: mockedGetCatalogList,
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

  it('uses the full set of provider states for a producer delegation', () => {
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

    expect(mockedGetCatalogList).toHaveBeenCalledWith(
      expect.objectContaining({
        q: '',
        limit: 50,
        offset: 0,
        states: ['PUBLISHED'],
        isConsumerDelegable: true,
      })
    )
  })
})
