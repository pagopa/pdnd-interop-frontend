import React from 'react'
import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { TestInputWrapper } from '@/components/shared/react-hook-form-inputs/__tests__/test-utils'
import { RHFCheckboxGroup } from '@/components/shared/react-hook-form-inputs'
import { vi } from 'vitest'

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
        <RHFCheckboxGroup {...checkboxGroupProps.standard} />
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

  it('should call onValueChange when the value changes', async () => {
    const onValueChange = vi.fn()
    const checkboxResult = render(
      <TestInputWrapper>
        <RHFCheckboxGroup {...checkboxGroupProps.standard} onValueChange={onValueChange} />
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

    expect(onValueChange).not.toHaveBeenCalled()

    await userEvent.click(optionOneCheckbox)
    expect(onValueChange).toHaveBeenCalledWith(['option1'])

    await userEvent.click(optionTwoCheckbox)
    expect(onValueChange).toHaveBeenCalledWith(['option1', 'option2'])

    await userEvent.click(optionThreeCheckbox)
    expect(onValueChange).toHaveBeenCalledWith(['option1', 'option2', 'option3'])

    await userEvent.click(optionOneCheckbox)
    expect(onValueChange).toHaveBeenCalledWith(['option2', 'option3'])

    await userEvent.click(optionTwoCheckbox)
    expect(onValueChange).toHaveBeenCalledWith(['option3'])

    await userEvent.click(optionThreeCheckbox)
    expect(onValueChange).toHaveBeenCalledWith([])
  })

  it('should not render if no options are given', () => {
    const checkboxResult = render(
      <TestInputWrapper>
        <RHFCheckboxGroup {...checkboxGroupProps.standard} options={[]} />
      </TestInputWrapper>
    )

    expect(checkboxResult.queryByRole('checkbox')).toBeNull()
  })
})
