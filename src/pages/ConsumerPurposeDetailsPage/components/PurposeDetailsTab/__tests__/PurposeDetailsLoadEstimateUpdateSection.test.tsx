import React from 'react'
import { fireEvent, render } from '@testing-library/react'
import {
  PurposeDetailsLoadEstimateUpdateSection,
  PurposeDetailsLoadEstimateUpdateSectionSkeleton,
} from '../PurposeDetailsLoadEstimateUpdateSection'
import { mockUseJwt, renderWithApplicationContext } from '@/utils/testing.utils'
import { createMockPurpose } from '__mocks__/data/purpose.mocks'

describe('PurposeDetailsLoadEstimateUpdateSection', () => {
  it('should not render if the user is not an admin', () => {
    mockUseJwt({ isAdmin: false })
    const { container } = render(
      <PurposeDetailsLoadEstimateUpdateSection
        purpose={createMockPurpose({ currentVersion: { state: 'ACTIVE' } })}
      />
    )
    expect(container).toBeEmptyDOMElement()
  })

  it('should not render if the purpose is in ARCHIVED state', () => {
    mockUseJwt({ isAdmin: true })
    const { container } = render(
      <PurposeDetailsLoadEstimateUpdateSection
        purpose={createMockPurpose({ currentVersion: { state: 'ARCHIVED' } })}
      />
    )
    expect(container).toBeEmptyDOMElement()
  })

  it('should not render if the purpose is in DRAFT state', () => {
    mockUseJwt({ isAdmin: true })
    const { container } = render(
      <PurposeDetailsLoadEstimateUpdateSection
        purpose={createMockPurpose({ currentVersion: { state: 'DRAFT' } })}
      />
    )
    expect(container).toBeEmptyDOMElement()
  })

  it('should not render if the purpose is undefined', () => {
    mockUseJwt({ isAdmin: true })
    const { container } = render(<PurposeDetailsLoadEstimateUpdateSection purpose={undefined} />)
    expect(container).toBeEmptyDOMElement()
  })

  it('should match snapshot if the purpose already has a waitingForApprovalVersion and has no estimated date set', () => {
    mockUseJwt({ isAdmin: true })
    const { container } = render(
      <PurposeDetailsLoadEstimateUpdateSection
        purpose={createMockPurpose({
          currentVersion: { state: 'ACTIVE' },
          waitingForApprovalVersion: {},
        })}
      />
    )
    expect(container).toMatchSnapshot()
  })

  it('should match snapshot if the purpose already has a waitingForApprovalVersion and has an estimated date set', () => {
    mockUseJwt({ isAdmin: true })
    const expectedApprovalDate = new Date('2021-10-10T00:00:00.000Z').toISOString()
    const { container } = render(
      <PurposeDetailsLoadEstimateUpdateSection
        purpose={createMockPurpose({
          currentVersion: { state: 'ACTIVE' },
          waitingForApprovalVersion: { expectedApprovalDate },
        })}
      />
    )
    expect(container).toMatchSnapshot()
  })

  it('should match snapshot if the purpose already has no waitingForApprovalVersion', () => {
    mockUseJwt({ isAdmin: true })
    const { container } = render(
      <PurposeDetailsLoadEstimateUpdateSection
        purpose={createMockPurpose({
          currentVersion: { state: 'ACTIVE' },
          waitingForApprovalVersion: undefined,
        })}
      />
    )
    expect(container).toMatchSnapshot()
  })

  it('should open the update dialog when the update daily calls button is clicked', () => {
    mockUseJwt({ isAdmin: true })
    const screen = renderWithApplicationContext(
      <PurposeDetailsLoadEstimateUpdateSection
        purpose={createMockPurpose({
          currentVersion: { state: 'ACTIVE' },
          waitingForApprovalVersion: undefined,
        })}
      />,
      { withReactQueryContext: true }
    )
    const updateDailyCallsButton = screen.getByRole('button', { name: 'updateDailyCalls' })
    fireEvent.click(updateDailyCallsButton)
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })
})

describe('PurposeDetailsLoadEstimateUpdateSectionSkeleton', () => {
  it('should match the snapshot', () => {
    const screen = render(<PurposeDetailsLoadEstimateUpdateSectionSkeleton />)
    expect(screen.baseElement).toMatchSnapshot()
  })
})
