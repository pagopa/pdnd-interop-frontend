import React from 'react'
import { vi } from 'vitest'
import userEvent from '@testing-library/user-event'
import { renderWithApplicationContext } from '@/__mocks__/mock.utils'
import TOSAgreement from '@/router/components/RoutesWrapper/TOSAgreement'

const mockAcceptAgreement = vi.fn()

describe('determine whether TOSAgreement works', () => {
  it('calls the passed callback on confirm', async () => {
    const user = userEvent.setup()
    const tosAgreement = renderWithApplicationContext(
      <TOSAgreement onAcceptAgreement={mockAcceptAgreement} />,
      {
        withRouterContext: true,
      }
    )
    const button = tosAgreement.getByRole('button')
    await user.click(button)

    expect(mockAcceptAgreement).toBeCalledTimes(1)
  })
})
