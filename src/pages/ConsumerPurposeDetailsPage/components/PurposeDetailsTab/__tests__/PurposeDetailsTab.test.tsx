import React from 'react'
import { render } from '@testing-library/react'
import { PurposeDetailsTab, PurposeDetailsTabSkeleton } from '../PurposeDetailsTab'
import type { Purpose } from '@/api/api.generatedTypes'
import { vi } from 'vitest'
import { PurposeQueries } from '@/api/purpose'
import { renderWithApplicationContext } from '@/utils/testing.utils'
import { createMockPurpose } from '__mocks__/data/purpose.mocks'
import { EServiceQueries } from '@/api/eservice'

const mockUseGetSinglePurpose = (data: Purpose | undefined) => {
  vi.spyOn(PurposeQueries, 'useGetSingle').mockReturnValue({
    data,
  } as unknown as ReturnType<typeof PurposeQueries.useGetSingle>)
}

vi.spyOn(EServiceQueries, 'useGetDescriptorCatalog').mockReturnValue({
  data: undefined,
} as unknown as ReturnType<typeof EServiceQueries.useGetDescriptorCatalog>)

describe('PurposeDetailsTab', () => {
  it('should match snapshot', () => {
    mockUseGetSinglePurpose(
      createMockPurpose({ clients: [{ id: 'id', name: 'name', hasKeys: false }] })
    )
    const { baseElement } = renderWithApplicationContext(
      <PurposeDetailsTab purposeId={'purposeId'} />,
      {
        withReactQueryContext: true,
        withRouterContext: true,
      }
    )
    expect(baseElement).toMatchSnapshot()
  })

  it('should match snapshot with falsy purpose', () => {
    mockUseGetSinglePurpose(undefined)
    const { baseElement } = renderWithApplicationContext(
      <PurposeDetailsTab purposeId={'purposeId'} />,
      {
        withReactQueryContext: true,
        withRouterContext: true,
      }
    )
    expect(baseElement).toMatchSnapshot()
  })

  it('should match snapshot with purpose with no clients', () => {
    mockUseGetSinglePurpose(createMockPurpose({ clients: [] }))
    const { baseElement } = renderWithApplicationContext(
      <PurposeDetailsTab purposeId={'purposeId'} />,
      {
        withReactQueryContext: true,
        withRouterContext: true,
      }
    )
    expect(baseElement).toMatchSnapshot()
  })
})

describe('PurposeDetailsTabSkeleton', () => {
  it('should match snapshot', () => {
    const { baseElement } = render(<PurposeDetailsTabSkeleton />)
    expect(baseElement).toMatchSnapshot()
  })
})
