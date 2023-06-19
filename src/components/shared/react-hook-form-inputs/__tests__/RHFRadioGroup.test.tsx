import React from 'react'
import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { TestInputWrapper } from '@/components/shared/react-hook-form-inputs/__tests__/test-utils'
import { RHFRadioGroup } from '@/components/shared/react-hook-form-inputs'
import { vi } from 'vitest'

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
        <RHFRadioGroup {...radioGroupProps.standard} />
      </TestInputWrapper>
    )

    const radioOption1 = radioGroupResult.getByRole('radio', {
      name: 'option1',
    }) as HTMLInputElement
    const radioOption2 = radioGroupResult.getByRole('radio', {
      name: 'option2',
    }) as HTMLInputElement
    const radioOption3 = radioGroupResult.getByRole('radio', {
      name: 'option3',
    }) as HTMLInputElement

    expect(radioOption1).not.toBeChecked()
    expect(radioOption2).not.toBeChecked()
    expect(radioOption3).not.toBeChecked()

    await user.click(radioOption1)
    expect(radioOption1).toBeChecked()
    expect(radioOption2).not.toBeChecked()
    expect(radioOption3).not.toBeChecked()

    await user.click(radioOption2)
    expect(radioOption1).not.toBeChecked()
    expect(radioOption2).toBeChecked()
    expect(radioOption3).not.toBeChecked()

    await user.click(radioOption3)
    expect(radioOption1).not.toBeChecked()
    expect(radioOption2).not.toBeChecked()
    expect(radioOption3).toBeChecked()
  })

  it('should not render if options is empty', () => {
    const { container } = render(
      <TestInputWrapper>
        <RHFRadioGroup {...radioGroupProps.standard} options={[]} />
      </TestInputWrapper>
    )

    expect(container).toBeEmptyDOMElement()
  })

  it('should call onValueChange when value changes', async () => {
    const onValueChange = vi.fn()
    const user = userEvent.setup()
    const radioGroupResult = render(
      <TestInputWrapper>
        <RHFRadioGroup {...radioGroupProps.standard} onValueChange={onValueChange} />
      </TestInputWrapper>
    )

    const radioOption1 = radioGroupResult.getByRole('radio', {
      name: 'option1',
    }) as HTMLInputElement

    expect(onValueChange).not.toHaveBeenCalled()

    await user.click(radioOption1)
    expect(onValueChange).toHaveBeenCalledTimes(1)
    expect(onValueChange).toHaveBeenCalledWith('option1')
  })

  it('should not render label if no label prop is given', () => {
    const radioGroupResult = render(
      <TestInputWrapper>
        <RHFRadioGroup {...radioGroupProps.standard} label={undefined} />
      </TestInputWrapper>
    )

    expect(radioGroupResult.baseElement).toMatchSnapshot()
  })

  it('should render correctly with label if label prop is given', () => {
    const radioGroupResult = render(
      <TestInputWrapper>
        <RHFRadioGroup {...radioGroupProps.standard} />
      </TestInputWrapper>
    )

    expect(radioGroupResult.baseElement).toMatchSnapshot()
  })
})
