import React from 'react'
import type { CatalogEServiceDescriptor } from '@/api/api.generatedTypes'
import { EServiceQueries } from '@/api/eservice'
import { renderWithApplicationContext } from '@/utils/testing.utils'
import { vi } from 'vitest'
import {
  PurposeDetailsGeneralInfoSection,
  PurposeDetailsGeneralInfoSectionSkeleton,
} from '../PurposeDetailsGeneralInfoSection'
import { createMockPurpose } from '__mocks__/data/purpose.mocks'
import { createMockEServiceDescriptorCatalog } from '__mocks__/data/eservice.mocks'
import { render } from '@testing-library/react'

const mockUseGetDescriptorCatalog = (descriptor: CatalogEServiceDescriptor | undefined) => {
  vi.spyOn(EServiceQueries, 'useGetDescriptorCatalog').mockReturnValue({
    data: descriptor,
  } as unknown as ReturnType<typeof EServiceQueries.useGetDescriptorCatalog>)
}

describe('PurposeDetailsGeneralInfoSection', () => {
  it('should not render if purpose or descriptor is not defined', () => {
    mockUseGetDescriptorCatalog(undefined)

    const { container } = renderWithApplicationContext(
      <PurposeDetailsGeneralInfoSection purpose={undefined} />,
      { withRouterContext: true }
    )

    expect(container).toBeEmptyDOMElement()
  })

  it('should match snapshot', () => {
    mockUseGetDescriptorCatalog(createMockEServiceDescriptorCatalog())

    const { baseElement } = renderWithApplicationContext(
      <PurposeDetailsGeneralInfoSection purpose={createMockPurpose()} />,
      { withRouterContext: true }
    )

    expect(baseElement).toMatchSnapshot()
  })
})

describe('PurposeDetailsGeneralInfoSectionSkeleton', () => {
  it('should match snapshot', () => {
    const { baseElement } = render(<PurposeDetailsGeneralInfoSectionSkeleton />)

    expect(baseElement).toMatchSnapshot()
  })
})
