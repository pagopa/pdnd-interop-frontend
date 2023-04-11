import React from 'react'
import { DialogRejectAgreement } from '../DialogRejectAgreement'
import { renderWithApplicationContext } from '@/utils/testing.utils'

describe('DialogRejectAgreement testing', () => {
  it('should match the snapshot', () => {
    const screen = renderWithApplicationContext(
      <DialogRejectAgreement type="rejectAgreement" agreementId="agreementId" />,
      { withReactQueryContext: true }
    )
    expect(screen.baseElement).toMatchSnapshot()
  })
})
