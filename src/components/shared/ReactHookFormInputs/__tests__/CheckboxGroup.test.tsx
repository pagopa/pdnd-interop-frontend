import React from 'react'
import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { TestInputWrapper } from '@/components/shared/ReactHookFormInputs/__tests__/test-utils'
import { CheckboxGroup } from '@/components/shared/ReactHookFormInputs'

const checkboxGroupOptions = [
  { label: 'option1', value: 'option1' },
  { label: 'option2', value: 'option2' },
  { label: 'option3', value: 'option3' },
]

const checkboxGroupProps = {
  standard: {
    label: 'label',
    name: 'testText',
    options: checkboxGroupOptions,
  },
}

describe('determine whether the integration between react-hook-form and MUI’s Checkbox works', () => {
  it('gets the input from the user correctly', async () => {
    const user = userEvent.setup()
    const checkboxResult = render(
      <TestInputWrapper>
        <CheckboxGroup {...checkboxGroupProps.standard} />
      </TestInputWrapper>
    )

    const checkboxInputList = checkboxResult.getAllByRole('checkbox') as Array<HTMLInputElement>
    expect(checkboxInputList[0].checked).toEqual(false)
    await user.click(checkboxInputList[0])
    expect(checkboxInputList[0].checked).toEqual(true)

    await user.click(checkboxInputList[0])
    expect(checkboxInputList[0].checked).toEqual(false)

    await user.click(checkboxInputList[0])
    await user.click(checkboxInputList[1])
    await user.click(checkboxInputList[2])

    expect(checkboxInputList[0].checked).toEqual(true)
    expect(checkboxInputList[1].checked).toEqual(true)
    expect(checkboxInputList[2].checked).toEqual(true)
  })
})
