import React from 'react'
import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { TestInputWrapper } from '@/components/shared/react-hook-form-inputs/__tests__/test-utils'
import { CheckboxGroup } from '@/components/shared/react-hook-form-inputs'

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

    const optionOneCheckbox = checkboxResult.getByRole('checkbox', {
      name: 'option1',
    }) as HTMLInputElement

    const optionTwoCheckbox = checkboxResult.getByRole('checkbox', {
      name: 'option2',
    }) as HTMLInputElement

    const optionThreeCheckbox = checkboxResult.getByRole('checkbox', {
      name: 'option3',
    }) as HTMLInputElement

    expect(optionOneCheckbox.checked).toEqual(false)
    await user.click(optionOneCheckbox)
    expect(optionOneCheckbox.checked).toEqual(true)

    await user.click(optionOneCheckbox)
    expect(optionOneCheckbox.checked).toEqual(false)

    await user.click(optionOneCheckbox)
    await user.click(optionTwoCheckbox)
    await user.click(optionThreeCheckbox)

    expect(optionOneCheckbox.checked).toEqual(true)
    expect(optionTwoCheckbox.checked).toEqual(true)
    expect(optionThreeCheckbox.checked).toEqual(true)
  })
})
