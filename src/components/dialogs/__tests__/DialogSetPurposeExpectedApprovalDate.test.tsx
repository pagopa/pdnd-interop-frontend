import React from 'react'
import { DialogSetPurposeExpectedApprovalDate } from '../DialogSetPurposeExpectedApprovalDate'
import { renderWithApplicationContext } from '@/utils/testing.utils'
import { vi } from 'vitest'

describe('DialogSetPurposeExpectedApprovalDate testing', () => {
  it('should match the snapshot', () => {
    vi.useFakeTimers().setSystemTime(new Date('2020-01-01'))

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
