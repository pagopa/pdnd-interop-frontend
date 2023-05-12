import React from 'react'
import { createMockAgreement } from '__mocks__/data/agreement.mocks'
import { mockAgreementDetailsContext } from './test.commons'
import {
  AgreementGeneralInfoSection,
  AgreementGeneralInfoSectionSkeleton,
} from '../AgreementGeneralInfoSection'
import {
  mockUseCurrentRoute,
  mockUseJwt,
  renderWithApplicationContext,
} from '@/utils/testing.utils'
import { render } from '@testing-library/react'

describe('AgreementGeneralInfoSection', () => {
  it('should match the snapshot (consumer)', () => {
    mockUseJwt({ isAdmin: true })
    mockUseCurrentRoute({ mode: 'consumer' })

    mockAgreementDetailsContext({
      agreement: createMockAgreement(),
    })

    const { baseElement } = renderWithApplicationContext(<AgreementGeneralInfoSection />, {
      withRouterContext: true,
    })

    expect(baseElement).toMatchSnapshot()
  })

  it('should match the snapshot (provider)', () => {
    mockUseJwt({ isAdmin: true })
    mockUseCurrentRoute({ mode: 'provider' })

    mockAgreementDetailsContext({
      agreement: createMockAgreement(),
    })

    const { baseElement } = renderWithApplicationContext(<AgreementGeneralInfoSection />, {
      withRouterContext: true,
    })

    expect(baseElement).toMatchSnapshot()
  })

  it('should match the snapshot with loading skeleton', () => {
    mockUseJwt({ isAdmin: true })
    mockUseCurrentRoute({ mode: 'provider' })

    mockAgreementDetailsContext({
      agreement: undefined,
    })

    const { baseElement } = renderWithApplicationContext(<AgreementGeneralInfoSection />, {
      withRouterContext: true,
    })

    expect(baseElement).toMatchSnapshot()
  })
})

describe('AgreementGeneralInfoSectionSkeleton', () => {
  it('should match the snapshot', () => {
    const { baseElement } = render(<AgreementGeneralInfoSectionSkeleton />)

    expect(baseElement).toMatchSnapshot()
  })
})
