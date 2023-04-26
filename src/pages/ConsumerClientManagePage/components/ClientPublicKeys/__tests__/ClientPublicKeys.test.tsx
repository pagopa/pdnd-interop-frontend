import React from 'react'
import { renderWithApplicationContext } from '@/utils/testing.utils'
import { ClientPublicKeys } from '../ClientPublicKeys'

describe('ClientPublicKeys', () => {
  it('should match snapshot', async () => {
    const screen = renderWithApplicationContext(<ClientPublicKeys clientId="clientId" />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })
    expect(screen.baseElement).toMatchSnapshot()
  })
})
