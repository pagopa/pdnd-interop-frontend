import React from 'react'
import type { Client, PublicKey } from '@/api/api.generatedTypes'
import { ClientQueries } from '@/api/client'
import { mockUseClientKind, mockUseJwt, renderWithApplicationContext } from '@/utils/testing.utils'
import { vi } from 'vitest'
import { VoucherInstructions, VoucherInstructionsSkeleton } from '../VoucherInstructions'
import { createMockPublicKey } from '__mocks__/data/key.mocks'
import { createMockClient } from '__mocks__/data/client.mocks'
import { render } from '@testing-library/react'
import { createMockPurpose } from '__mocks__/data/purpose.mocks'

const mockUseGetKeyList = (keys: Array<PublicKey> | undefined) => {
  vi.spyOn(ClientQueries, 'useGetKeyList').mockReturnValue({
    data: { keys },
    isLoading: false,
  } as unknown as ReturnType<typeof ClientQueries.useGetKeyList>)
}

const mockUseGetSingleClient = (client: Client | undefined) => {
  vi.spyOn(ClientQueries, 'useGetSingle').mockReturnValue({
    data: client,
    isLoading: false,
  } as unknown as ReturnType<typeof ClientQueries.useGetSingle>)
}

describe('VoucherInstructions (API)', () => {
  it('should render an alert if there are no client keys', () => {
    mockUseClientKind('API')
    mockUseGetKeyList([])
    const screen = renderWithApplicationContext(<VoucherInstructions clientId="clientId" />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })
    expect(screen.getByRole('alert')).toBeInTheDocument()
  })

  it('should match snapshot', () => {
    mockUseClientKind('API')
    mockUseGetKeyList([createMockPublicKey()])
    const screen = renderWithApplicationContext(<VoucherInstructions clientId="clientId" />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })
    expect(screen.baseElement).toMatchSnapshot()
  })
})

describe('VoucherInstructions (CONSUMER)', () => {
  it('should render an alert if the client has no purposes associated and user is admin', () => {
    mockUseJwt({ isAdmin: true })
    mockUseClientKind('CONSUMER')
    mockUseGetKeyList([createMockPublicKey()])
    mockUseGetSingleClient(createMockClient({ purposes: [] }))
    const screen = renderWithApplicationContext(<VoucherInstructions clientId="clientId" />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })
    expect(screen.getByRole('alert')).toBeInTheDocument()
  })

  it('should render an alert if the client has no purposes associated and user is not an admin', () => {
    mockUseJwt({ isAdmin: false })
    mockUseClientKind('CONSUMER')
    mockUseGetKeyList([createMockPublicKey()])
    mockUseGetSingleClient(createMockClient({ purposes: [] }))
    const screen = renderWithApplicationContext(<VoucherInstructions clientId="clientId" />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })
    expect(screen.getByRole('alert')).toBeInTheDocument()
  })

  it('should match snapshot', async () => {
    mockUseJwt({ isAdmin: true })
    mockUseClientKind('CONSUMER')
    mockUseGetKeyList([createMockPublicKey()])
    mockUseGetSingleClient(
      createMockClient({
        purposes: [
          createMockPurpose({ title: 'purpose-one', id: 'purpose-one' }),
          createMockPurpose({ title: 'purpose-two', id: 'purpose-two' }),
        ],
      })
    )
    const screen = renderWithApplicationContext(<VoucherInstructions clientId="clientId" />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })
    expect(screen.baseElement).toMatchSnapshot()
  })
})

describe('VoucherInstructionsSkeleton', () => {
  it('should match snapshot', () => {
    const screen = render(<VoucherInstructionsSkeleton />)
    expect(screen.baseElement).toMatchSnapshot()
  })
})
