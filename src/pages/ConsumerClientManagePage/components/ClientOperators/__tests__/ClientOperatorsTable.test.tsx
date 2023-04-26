import React from 'react'
import type { Operators } from '@/api/api.generatedTypes'
import { ClientQueries } from '@/api/client'
import { render } from '@testing-library/react'
import { vi } from 'vitest'
import { ClientOperatorsTable, ClientOperatorsTableSkeleton } from '../ClientOperatorsTable'
import { mockUseClientKind, mockUseJwt, renderWithApplicationContext } from '@/utils/testing.utils'
import { createMockOperator } from '__mocks__/data/user.mocks'

const mockUseGetOperatorsList = (operators: Operators = []) => {
  vi.spyOn(ClientQueries, 'useGetOperatorsList').mockReturnValue({
    data: operators,
  } as unknown as ReturnType<typeof ClientQueries.useGetOperatorsList>)
}

mockUseJwt({ isAdmin: true })
mockUseClientKind('API')

describe('ClientOperatorsTable', () => {
  it('should match snapshot', () => {
    mockUseGetOperatorsList([createMockOperator()])
    const { baseElement } = renderWithApplicationContext(
      <ClientOperatorsTable clientId="clientId" />,
      {
        withReactQueryContext: true,
        withRouterContext: true,
      }
    )
    expect(baseElement).toMatchSnapshot()
  })

  it('should match snapshot with no operators', () => {
    mockUseGetOperatorsList([])
    const { baseElement } = renderWithApplicationContext(
      <ClientOperatorsTable clientId="clientId" />,
      {
        withReactQueryContext: true,
        withRouterContext: true,
      }
    )
    expect(baseElement).toMatchSnapshot()
  })
})

describe('ClientOperatorsTableSkeleton', () => {
  it('should match snapshot', () => {
    const { baseElement } = render(<ClientOperatorsTableSkeleton />)
    expect(baseElement).toMatchSnapshot()
  })
})
