import React from 'react'
import { mockUseJwt, renderWithApplicationContext } from '@/utils/testing.utils'
import { PurposeDetails, PurposeDetailsSkeleton } from '../PurposeDetails'
import { render } from '@testing-library/react'
import { createMockPurpose } from '__mocks__/data/purpose.mocks'
import { vi } from 'vitest'
import { EServiceQueries } from '@/api/eservice'
import { createMockEServiceDescriptorCatalog } from '__mocks__/data/eservice.mocks'
import { PurposeQueries } from '@/api/purpose'
import type { Purpose } from '@/api/api.generatedTypes'

vi.spyOn(EServiceQueries, 'useGetDescriptorCatalog').mockReturnValue({
  data: createMockEServiceDescriptorCatalog(),
} as unknown as ReturnType<typeof EServiceQueries.useGetDescriptorCatalog>)

const mockUseGetSingleSpy = (purpose?: Purpose) => {
  vi.spyOn(PurposeQueries, 'useGetSingle').mockReturnValue({
    data: purpose,
  } as unknown as ReturnType<typeof PurposeQueries.useGetSingle>)
}

describe('PurposeDetails', () => {
  it('should match the snapshot', () => {
    mockUseGetSingleSpy(createMockPurpose())
    const { baseElement } = renderWithApplicationContext(<PurposeDetails purposeId="purposeId" />, {
      withRouterContext: true,
      withReactQueryContext: true,
    })

    expect(baseElement).toMatchSnapshot()
  })

  it('should render the load estimate update section if the purpose has a waiting for approval version and the user is an admin', () => {
    mockUseJwt({ isAdmin: true })
    mockUseGetSingleSpy(createMockPurpose({ waitingForApprovalVersion: { id: 'id' } }))

    const { getByRole } = renderWithApplicationContext(<PurposeDetails purposeId="purposeId" />, {
      withRouterContext: true,
      withReactQueryContext: true,
    })

    expect(getByRole('button', { name: 'confirmUpdate' })).toBeInTheDocument()
  })

  it('should not render the load estimate update section if the purpose has a waiting for approval version and the user is not an admin', () => {
    mockUseJwt({ isAdmin: false })
    mockUseGetSingleSpy(createMockPurpose({ waitingForApprovalVersion: { id: 'id' } }))

    const { queryByRole } = renderWithApplicationContext(<PurposeDetails purposeId="purposeId" />, {
      withRouterContext: true,
      withReactQueryContext: true,
    })

    expect(queryByRole('button', { name: 'confirmUpdate' })).not.toBeInTheDocument()
  })
})

describe('PurposeDetailsSkeleton', () => {
  it('should match the snapshot', () => {
    const { baseElement } = render(<PurposeDetailsSkeleton />)

    expect(baseElement).toMatchSnapshot()
  })
})
