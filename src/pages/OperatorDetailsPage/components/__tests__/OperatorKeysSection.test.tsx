import React from 'react'
import { vi } from 'vitest'
import { OperatorKeysSection, OperatorKeysSectionSkeleton } from '../OperatorKeysSection'
import { render } from '@testing-library/react'
import { ClientQueries } from '@/api/client'
import type { PublicKey } from '@/api/api.generatedTypes'
import { createMockPublicKey } from '__mocks__/data/key.mocks'
import { mockUseClientKind, renderWithApplicationContext } from '@/utils/testing.utils'

const mockGetOperatorKeysSpy = (result: Array<PublicKey>) => {
  vi.spyOn(ClientQueries, 'useGetOperatorKeys').mockReturnValue({
    data: result,
  } as unknown as ReturnType<typeof ClientQueries.useGetOperatorKeys>)
}

describe('OperatorKeysSection', () => {
  it('should match the snapshot (API)', () => {
    mockUseClientKind('API')
    mockGetOperatorKeysSpy([
      createMockPublicKey({ keyId: '1', name: 'public-key-1' }),
      createMockPublicKey({ keyId: '2', name: 'public-key-2' }),
    ])

    const screen = renderWithApplicationContext(
      <OperatorKeysSection clientId="clientId" operatorId="operatorId" />,
      { withRouterContext: true }
    )
    expect(screen.baseElement).toMatchSnapshot()
  })

  it('should match the snapshot (CONSUMER)', () => {
    mockUseClientKind('CONSUMER')
    mockGetOperatorKeysSpy([
      createMockPublicKey({ keyId: '1', name: 'public-key-1' }),
      createMockPublicKey({ keyId: '2', name: 'public-key-2' }),
    ])

    const screen = renderWithApplicationContext(
      <OperatorKeysSection clientId="clientId" operatorId="operatorId" />,
      { withRouterContext: true }
    )
    expect(screen.baseElement).toMatchSnapshot()
  })

  it('should match the snapshot on empty keys', () => {
    mockUseClientKind('CONSUMER')
    mockGetOperatorKeysSpy([])

    const screen = renderWithApplicationContext(
      <OperatorKeysSection clientId="clientId" operatorId="operatorId" />,
      { withRouterContext: true }
    )
    expect(screen.getByText('edit.associatedKeysField.noDataLabel')).toBeInTheDocument()
    expect(screen.baseElement).toMatchSnapshot()
  })
})

describe('OperatorKeysSectionSkeleton', () => {
  it('should match the snapshot', () => {
    const screen = render(<OperatorKeysSectionSkeleton />)

    expect(screen.baseElement).toMatchSnapshot()
  })
})
