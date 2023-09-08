import React from 'react'
import { render } from '@testing-library/react'
import { AgreementRejectedMessageSection } from '../AgreementRejectedMessageSection'
import { createMockAgreement } from '@/../__mocks__/data/agreement.mocks'
import { mockAgreementDetailsContext } from './test.commons'

describe('AgreementRejectedMessageSection', () => {
  it('should match the snapshot', () => {
    mockAgreementDetailsContext({
      agreement: createMockAgreement({ state: 'REJECTED', rejectionReason: 'test' }),
    })

    const { baseElement } = render(<AgreementRejectedMessageSection />)
    expect(baseElement).toMatchSnapshot()
  })

  it('should not render when agreement is not in REJECTED state', () => {
    mockAgreementDetailsContext({
      agreement: createMockAgreement({ state: 'ACTIVE', rejectionReason: 'test' }),
    })

    const screen = render(<AgreementRejectedMessageSection />)

    expect(screen.container).toBeEmptyDOMElement()
  })
})
