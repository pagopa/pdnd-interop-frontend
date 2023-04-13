import React from 'react'
import { renderWithApplicationContext } from '@/utils/testing.utils'
import { DialogAddClientToPurpose } from '../DialogAddClientToPurpose'

describe('DialogAddClientToPurpose testing', () => {
  it('should match the snapshot', () => {
    const screen = renderWithApplicationContext(
      <DialogAddClientToPurpose type="addClientToPurpose" purposeId="purposeId" />,
      {
        withReactQueryContext: true,
      }
    )
    expect(screen.baseElement).toMatchSnapshot()
  })
})
