import React from 'react'
import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { TestInputWrapper } from '@/__mocks__/mock.utils'
import { Switch } from '@/components/shared/ReactHookFormInputs'

const switchProps = {
  standard: {
    label: 'label',
    name: 'test',
  },
}

describe('determine whether the integration between react-hook-form and MUI’s Switch works', () => {
  it('gets the input from the user correctly', async () => {
    const user = userEvent.setup()
    const switchResult = render(
      <TestInputWrapper>
        <Switch {...switchProps.standard} />
      </TestInputWrapper>
    )

    const switchInput = switchResult.getByRole('checkbox')
    expect(switchInput).not.toBeChecked()

    await user.click(switchInput)
    expect(switchInput).toBeChecked()

    await user.click(switchInput)
    expect(switchInput).not.toBeChecked()
  })
})
