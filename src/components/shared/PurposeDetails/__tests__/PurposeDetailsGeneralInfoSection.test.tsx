import React from 'react'
import { render } from '@testing-library/react'
import {
  PurposeDetailsGeneralInfoSection,
  PurposeDetailsGeneralInfoSectionSkeleton,
} from '../PurposeDetailsGeneralInfoSection'
import { vi } from 'vitest'
import { EServiceQueries } from '@/api/eservice'
import type { CatalogEServiceDescriptor } from '@/api/api.generatedTypes'
import { createMockEServiceDescriptorCatalog } from '@/../__mocks__/data/eservice.mocks'
import {
  mockUseCurrentRoute,
  mockUseJwt,
  renderWithApplicationContext,
} from '@/utils/testing.utils'
import { createMockPurpose } from '@/../__mocks__/data/purpose.mocks'

// EServiceQueries.useGetDescriptorCatalog
const mockGetDescriptorCatalog = (data: CatalogEServiceDescriptor | undefined) =>
  vi
    .spyOn(EServiceQueries, 'useGetDescriptorCatalog')
    .mockReturnValue({ data } as unknown as ReturnType<
      typeof EServiceQueries.useGetDescriptorCatalog
    >)

mockUseJwt()

describe('PurposeDetailsGeneralInfoSection', () => {
  it('should match snapshot (consumer)', () => {
    mockUseCurrentRoute({ mode: 'consumer' })
    mockGetDescriptorCatalog(createMockEServiceDescriptorCatalog())

    const { baseElement } = renderWithApplicationContext(
      <PurposeDetailsGeneralInfoSection purpose={createMockPurpose()} />,
      {
        withRouterContext: true,
      }
    )

    expect(baseElement).toMatchSnapshot()
  })

  it('should match snapshot (provider)', () => {
    mockUseCurrentRoute({ mode: 'provider' })
    mockGetDescriptorCatalog(createMockEServiceDescriptorCatalog())

    const { baseElement } = renderWithApplicationContext(
      <PurposeDetailsGeneralInfoSection purpose={createMockPurpose()} />,
      {
        withRouterContext: true,
      }
    )

    expect(baseElement).toMatchSnapshot()
  })

  it('should not render if the descriptor is falsy', () => {
    mockGetDescriptorCatalog(undefined)

    const { container } = renderWithApplicationContext(
      <PurposeDetailsGeneralInfoSection purpose={createMockPurpose()} />,
      {
        withRouterContext: true,
      }
    )

    expect(container).toBeEmptyDOMElement()
  })

  it("should render freeOfCharge reason field if purpose's freeOfCharge is true", () => {
    mockUseCurrentRoute({ mode: 'provider' })
    mockGetDescriptorCatalog(createMockEServiceDescriptorCatalog())

    const { getByText } = renderWithApplicationContext(
      <PurposeDetailsGeneralInfoSection
        purpose={createMockPurpose({
          isFreeOfCharge: true,
          freeOfChargeReason: 'freeOfChargeReason',
        })}
      />,
      {
        withRouterContext: true,
      }
    )

    expect(getByText('freeOfChargeReason')).toBeInTheDocument()
  })
})

describe('PurposeDetailsGeneralInfoSectionSkeleton', () => {
  it('should match snapshot ', () => {
    const { baseElement } = render(<PurposeDetailsGeneralInfoSectionSkeleton />)
    expect(baseElement).toMatchSnapshot()
  })
})
