import React from 'react'
import { mockDebugVoucherContext } from './test.commons'
import { createMockDebugVoucherRequest } from '__mocks__/data/voucher.mocks'
import { render } from '@testing-library/react'
import { DebugVoucherResultsRequestSection } from '../DebugVoucherResultsRequestSection'

describe('DebugVoucherResultsRequestSection testing', () => {
  it('should match snapshot', () => {
    mockDebugVoucherContext({ request: createMockDebugVoucherRequest() })

    const screen = render(<DebugVoucherResultsRequestSection />)

    expect(screen.baseElement).toMatchSnapshot()
  })

  it('should match snapshot if clientId is undefined', () => {
    mockDebugVoucherContext({ request: createMockDebugVoucherRequest({ client_id: undefined }) })

    const screen = render(<DebugVoucherResultsRequestSection />)

    expect(screen.baseElement).toMatchSnapshot()
  })
})
