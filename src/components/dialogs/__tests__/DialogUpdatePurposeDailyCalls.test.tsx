import React from 'react'
import { DialogUpdatePurposeDailyCalls } from '../DialogUpdatePurposeDailyCalls'
import { renderWithApplicationContext } from '@/utils/testing.utils'

describe('DialogUpdatePurposeDailyCalls testing', () => {
  it('should match the snapshot', () => {
    const screen = renderWithApplicationContext(
      <DialogUpdatePurposeDailyCalls type="updatePurposeDailyCalls" purposeId="purposeId" />,
      {
        withReactQueryContext: true,
      }
    )
    expect(screen.baseElement).toMatchSnapshot()
  })
})
