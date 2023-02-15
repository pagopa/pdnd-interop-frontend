import React from 'react'
import { vi } from 'vitest'
import userEvent from '@testing-library/user-event'
import TOSAgreement from '@/router/components/RoutesWrapper/TOSAgreement'
import { renderWithApplicationContext } from '@/utils/testing.utils'

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
