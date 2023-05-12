import React from 'react'
import { render } from '@testing-library/react'
import { AgreementConsumerMessageSection } from '../AgreementConsumerMessageSection'
import { createMockAgreement } from '__mocks__/data/agreement.mocks'
import { mockAgreementDetailsContext } from './test.commons'

describe('AgreementConsumerMessageSection', () => {
  it('should match the snapshot', () => {
    mockAgreementDetailsContext({
      agreement: createMockAgreement({ state: 'ACTIVE', consumerNotes: 'test' }),
    })

    const { baseElement } = render(<AgreementConsumerMessageSection />)
    expect(baseElement).toMatchSnapshot()
  })

  it('should not render when agreement is in DRAFT state', () => {
    mockAgreementDetailsContext({
      agreement: createMockAgreement({ state: 'DRAFT', consumerNotes: 'test' }),
    })

    const screen = render(<AgreementConsumerMessageSection />)

    expect(screen.container).toBeEmptyDOMElement()
  })
})
