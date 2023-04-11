import React from 'react'
import { renderWithApplicationContext } from '@/utils/testing.utils'
import { DialogAddSecurityOperatorKey } from '../DialogAddSecurityOperatorKey'

describe('DialogSecurityOperatorKey testing', () => {
  it('should match the snapshot', () => {
    const screen = renderWithApplicationContext(
      <DialogAddSecurityOperatorKey type="addSecurityOperatorKey" clientId="clientId" />,
      {
        withReactQueryContext: true,
        withRouterContext: true,
      }
    )
    expect(screen.baseElement).toMatchSnapshot()
  })
})
