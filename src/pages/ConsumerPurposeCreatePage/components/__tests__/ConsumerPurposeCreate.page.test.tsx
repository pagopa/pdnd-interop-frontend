import React from 'react'
import { renderWithApplicationContext } from '@/utils/testing.utils'
import ConsumerPurposeCreatePage from '../../ConsumerPurposeCreate.page'

describe('ConsumerPurposeCreatePage', () => {
  it('should match snapshot', () => {
    const { baseElement } = renderWithApplicationContext(<ConsumerPurposeCreatePage />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })
    expect(baseElement).toMatchSnapshot()
  })
})
