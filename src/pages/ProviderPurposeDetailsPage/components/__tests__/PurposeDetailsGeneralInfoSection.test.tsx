import React from 'react'
import { render } from '@testing-library/react'
import {
  PurposeDetailsGeneralInfoSection,
  PurposeDetailsGeneralInfoSectionSkeleton,
} from '../PurposeDetailsGeneralInfoSection'
import { vi } from 'vitest'
import { EServiceQueries } from '@/api/eservice'
import { createMockEServiceDescriptorCatalog } from '__mocks__/data/eservice.mocks'
import { createMockPurpose } from '__mocks__/data/purpose.mocks'
import { renderWithApplicationContext } from '@/utils/testing.utils'

vi.spyOn(EServiceQueries, 'useGetDescriptorCatalog').mockReturnValue({
  data: createMockEServiceDescriptorCatalog(),
} as unknown as ReturnType<typeof EServiceQueries.useGetDescriptorCatalog>)

describe('PurposeDetailsGeneralInfoSection', () => {
  it('should match the snapshot', () => {
    const { baseElement } = renderWithApplicationContext(
      <PurposeDetailsGeneralInfoSection purpose={createMockPurpose()} />,
      { withRouterContext: true }
    )

    expect(baseElement).toMatchSnapshot()
  })

  it('should not render if purpose is undefined', () => {
    const { container } = renderWithApplicationContext(
      <PurposeDetailsGeneralInfoSection purpose={undefined} />,
      { withRouterContext: true }
    )

    expect(container).toBeEmptyDOMElement()
  })
})

describe('PurposeDetailsGeneralInfoSectionSkeleton', () => {
  it('should match the snapshot', () => {
    const { baseElement } = render(<PurposeDetailsGeneralInfoSectionSkeleton />)
    expect(baseElement).toMatchSnapshot()
  })
})
