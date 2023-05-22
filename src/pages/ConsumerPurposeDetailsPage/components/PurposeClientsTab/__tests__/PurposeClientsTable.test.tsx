import React from 'react'
import { render } from '@testing-library/react'
import { PurposeClientsTable, PurposeClientsTableSkeleton } from '../PurposeClientsTable'
import { renderWithApplicationContext } from '@/utils/testing.utils'
import { vi } from 'vitest'
import { PurposeQueries } from '@/api/purpose'
import type { CompactClient } from '@/api/api.generatedTypes'

const mockUseGetSinglePurpose = (clients: CompactClient[]) => {
  vi.spyOn(PurposeQueries, 'useGetSingle').mockReturnValue({
    data: {
      clients,
    },
  } as unknown as ReturnType<typeof PurposeQueries.useGetSingle>)
}

describe('PurposeClientsTable', () => {
  it('should match snapshot (full state)', () => {
    mockUseGetSinglePurpose([{ id: 'clientId', name: 'clientName', hasKeys: false }])
    const { baseElement } = renderWithApplicationContext(
      <PurposeClientsTable purposeId="purposeId" />,
      { withReactQueryContext: true, withRouterContext: true }
    )
    expect(baseElement).toMatchSnapshot()
  })

  it('should match snapshot (empty state)', () => {
    mockUseGetSinglePurpose([])
    const { baseElement } = renderWithApplicationContext(
      <PurposeClientsTable purposeId="purposeId" />,
      { withReactQueryContext: true, withRouterContext: true }
    )
    expect(baseElement).toMatchSnapshot()
  })
})

describe('PurposeClientsTableSkeleton', () => {
  it('should match snapshot', () => {
    const { baseElement } = render(<PurposeClientsTableSkeleton />)
    expect(baseElement).toMatchSnapshot()
  })
})
