import React from 'react'
import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { TestInputWrapper } from '@/components/shared/ReactHookFormInputs/__tests__/test-utils'
import { RadioGroup } from '@/components/shared/ReactHookFormInputs'

const radioGroupOptions = [
  { label: 'option1', value: 'option1' },
  { label: 'option2', value: 'option2' },
  { label: 'option3', value: 'option3' },
]

const radioGroupProps = {
  standard: {
    label: 'label',
    name: 'testText',
    options: radioGroupOptions,
  },
}

describe('determine whether the integration between react-hook-form and MUI’s RadioGroup works', () => {
  it('gets the input from the user correctly', async () => {
    const user = userEvent.setup()
    const radioGroupResult = render(
      <TestInputWrapper>
        <RadioGroup {...radioGroupProps.standard} />
      </TestInputWrapper>
    )

    const radioGroupList = radioGroupResult.getAllByRole('radio') as Array<HTMLInputElement>
    expect(radioGroupList[0]).not.toBeChecked()
    expect(radioGroupList[1]).not.toBeChecked()
    expect(radioGroupList[2]).not.toBeChecked()

    await user.click(radioGroupList[0])
    expect(radioGroupList[0]).toBeChecked()
    expect(radioGroupList[1]).not.toBeChecked()
    expect(radioGroupList[2]).not.toBeChecked()

    await user.click(radioGroupList[1])
    expect(radioGroupList[0]).not.toBeChecked()
    expect(radioGroupList[1]).toBeChecked()
    expect(radioGroupList[2]).not.toBeChecked()

    await user.click(radioGroupList[2])
    expect(radioGroupList[0]).not.toBeChecked()
    expect(radioGroupList[1]).not.toBeChecked()
    expect(radioGroupList[2]).toBeChecked()
  })
})
