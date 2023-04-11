import React from 'react'
import { DialogCreateNewAttribute } from '../DialogCreateNewAttribute'
import { renderWithApplicationContext } from '@/utils/testing.utils'

describe('DialogCreateNewAttribute testing', () => {
  it('should match the snapshot', () => {
    const screen = renderWithApplicationContext(
      <DialogCreateNewAttribute type="createNewAttribute" attributeKey="certified" />,
      { withReactQueryContext: true }
    )
    expect(screen.baseElement).toMatchSnapshot()
  })
})
