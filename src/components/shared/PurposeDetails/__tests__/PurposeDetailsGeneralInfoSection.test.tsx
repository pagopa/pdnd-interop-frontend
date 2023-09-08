import React from 'react'
import { render } from '@testing-library/react'
import {
  PurposeDetailsGeneralInfoSection,
  PurposeDetailsGeneralInfoSectionSkeleton,
} from '../PurposeDetailsGeneralInfoSection'
import {
  mockUseCurrentRoute,
  mockUseJwt,
  renderWithApplicationContext,
} from '@/utils/testing.utils'
import { createMockPurpose } from '@/../__mocks__/data/purpose.mocks'

mockUseJwt()

describe('PurposeDetailsGeneralInfoSection', () => {
  it('should match snapshot (consumer)', () => {
    mockUseCurrentRoute({ mode: 'consumer' })

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

    const { baseElement } = renderWithApplicationContext(
      <PurposeDetailsGeneralInfoSection purpose={createMockPurpose()} />,
      {
        withRouterContext: true,
      }
    )

    expect(baseElement).toMatchSnapshot()
  })

  it("should render freeOfCharge reason field if purpose's freeOfCharge is true", () => {
    mockUseCurrentRoute({ mode: 'provider' })

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
