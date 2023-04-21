import React from 'react'
import {
  mockUseCurrentRoute,
  mockUseJwt,
  renderWithApplicationContext,
} from '@/utils/testing.utils'
import {
  ConsumerAgreementsTableRow,
  ConsumerAgreementsTableRowSkeleton,
} from '../ConsumerAgreementsTableRow'
import { render } from '@testing-library/react'
import { createMockAgreementListingItem } from '__mocks__/data/agreement.mocks'
import userEvent from '@testing-library/user-event'

mockUseCurrentRoute({ mode: 'provider' })

describe('ConsumerAgreementsTableRow', () => {
  it('should match the snapshot', () => {
    const { baseElement } = renderWithApplicationContext(
      <ConsumerAgreementsTableRow agreement={createMockAgreementListingItem()} />,
      { withReactQueryContext: true, withRouterContext: true }
    )
    expect(baseElement).toMatchSnapshot()
  })

  it('should match the snapshot while agreement is editable', () => {
    mockUseJwt({ isAdmin: true })
    const { baseElement } = renderWithApplicationContext(
      <ConsumerAgreementsTableRow agreement={createMockAgreementListingItem({ state: 'DRAFT' })} />,
      { withReactQueryContext: true, withRouterContext: true }
    )
    expect(baseElement).toMatchSnapshot()
  })

  it("should go to agreement's details page on inspect button click", async () => {
    const screen = renderWithApplicationContext(
      <ConsumerAgreementsTableRow agreement={createMockAgreementListingItem()} />,
      { withReactQueryContext: true, withRouterContext: true }
    )

    const user = userEvent.setup()
    const inspectButton = screen.getByRole('button', { name: 'inspect' })

    await user.click(inspectButton)
    expect(screen.history.location.pathname).toBe(
      '/it/fruizione/richieste/5f75fe14-3f71-442b-8098-d3021b399deb'
    )
  })

  it("should go to agreement's details page on edit button click", async () => {
    mockUseJwt({ isAdmin: true })

    const screen = renderWithApplicationContext(
      <ConsumerAgreementsTableRow agreement={createMockAgreementListingItem({ state: 'DRAFT' })} />,
      { withReactQueryContext: true, withRouterContext: true }
    )

    const user = userEvent.setup()
    const inspectButton = screen.getByRole('button', { name: 'edit' })

    await user.click(inspectButton)
    expect(screen.history.location.pathname).toBe(
      '/it/fruizione/richieste/5f75fe14-3f71-442b-8098-d3021b399deb/modifica'
    )
  })
})

describe('ConsumerAgreementsTableRowSkeleton', () => {
  it('should match the snapshot', () => {
    const { baseElement } = render(<ConsumerAgreementsTableRowSkeleton />)
    expect(baseElement).toMatchSnapshot()
  })
})
