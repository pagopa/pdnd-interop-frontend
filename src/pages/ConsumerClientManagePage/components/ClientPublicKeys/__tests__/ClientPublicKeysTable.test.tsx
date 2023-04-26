import React from 'react'
import type { PublicKey } from '@/api/api.generatedTypes'
import { ClientQueries } from '@/api/client'
import { mockUseClientKind, renderWithApplicationContext } from '@/utils/testing.utils'
import { vi } from 'vitest'
import { ClientPublicKeysTable, ClientPublicKeysTableSkeleton } from '../ClientPublicKeysTable'
import { createMockPublicKey } from '__mocks__/data/key.mocks'
import { render } from '@testing-library/react'

const mockUseGetKeyList = (keys?: PublicKey[]) => {
  vi.spyOn(ClientQueries, 'useGetKeyList').mockReturnValue({
    data: { keys },
  } as unknown as ReturnType<typeof ClientQueries.useGetKeyList>)
}

mockUseClientKind('API')

describe('ClientPublicKeysTable', () => {
  it('should match snapshot', () => {
    mockUseGetKeyList([createMockPublicKey()])
    const { baseElement } = renderWithApplicationContext(
      <ClientPublicKeysTable clientId="clientId" />,
      {
        withReactQueryContext: true,
        withRouterContext: true,
      }
    )
    expect(baseElement).toMatchSnapshot()
  })

  it('should match snapshot with no keys', () => {
    mockUseGetKeyList()
    const { baseElement } = renderWithApplicationContext(
      <ClientPublicKeysTable clientId="clientId" />,
      {
        withReactQueryContext: true,
        withRouterContext: true,
      }
    )
    expect(baseElement).toMatchSnapshot()
  })
})

describe('ClientPublicKeysTableSkeleton', () => {
  it('should match snapshot', () => {
    const { baseElement } = render(<ClientPublicKeysTableSkeleton />)
    expect(baseElement).toMatchSnapshot()
  })
})
