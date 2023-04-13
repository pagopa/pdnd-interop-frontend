import React from 'react'
import { DialogSetPurposeExpectedApprovalDate } from '../DialogSetPurposeExpectedApprovalDate'
import { renderWithApplicationContext } from '@/utils/testing.utils'

describe('DialogSetPurposeExpectedApprovalDate testing', () => {
  it('should match the snapshot', () => {
    const screen = renderWithApplicationContext(
      <DialogSetPurposeExpectedApprovalDate
        type="setPurposeExpectedApprovalDate"
        purposeId="purposeId"
        versionId="versionId"
      />,
      { withReactQueryContext: true }
    )
    expect(screen.baseElement).toMatchSnapshot()
  })
})
