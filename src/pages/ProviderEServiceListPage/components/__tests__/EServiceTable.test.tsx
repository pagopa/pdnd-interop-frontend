import React from 'react'
import { renderWithApplicationContext } from '@/utils/testing.utils'
import { EServiceTable, EServiceTableSkeleton } from '../EServiceTable'
import { render } from '@testing-library/react'
import { createMockEServiceProvider } from '__mocks__/data/eservice.mocks'

describe('EServiceTable', () => {
  it('should match the snapshot', () => {
    const { baseElement } = renderWithApplicationContext(
      <EServiceTable
        eservices={[
          createMockEServiceProvider({ id: '1', name: 'eservice-1' }),
          createMockEServiceProvider({ id: '2', name: 'eservice-2' }),
          createMockEServiceProvider({ id: '3', name: 'eservice-3' }),
        ]}
      />,
      {
        withReactQueryContext: true,
        withRouterContext: true,
      }
    )

    expect(baseElement).toMatchSnapshot()
  })
  it('should match the snapshot when there are no e-services', () => {
    const { baseElement } = renderWithApplicationContext(<EServiceTable eservices={[]} />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    expect(baseElement).toMatchSnapshot()
  })
})

describe('EServiceTableSkeleton', () => {
  it('should match the snapshot', () => {
    const { baseElement } = render(<EServiceTableSkeleton />)
    expect(baseElement).toMatchSnapshot()
  })
})
