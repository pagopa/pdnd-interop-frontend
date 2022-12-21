import React from 'react'
import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { TestInputWrapper } from '@/components/shared/ReactHookFormInputs/__tests__/test-utils'
import { Select } from '@/components/shared/ReactHookFormInputs'

const selectOptions = [
  { label: 'option1', value: 'option1' },
  { label: 'option2', value: 'option2' },
  { label: 'option3', value: 'option3' },
]

const selectProps = {
  standard: {
    label: 'label',
    name: 'testText',
    options: selectOptions,
  },
  focused: {
    label: 'label',
    name: 'testText',
    options: selectOptions,
    focusOnMount: true,
  },
}

describe('determine whether the integration between react-hook-form and MUI’s Select works', () => {
  it('gets the input from the user correctly', async () => {
    const user = userEvent.setup()
    const select = render(
      <TestInputWrapper>
        <Select {...selectProps.standard} />
      </TestInputWrapper>
    )
    const button = select.getByRole('button')
    await user.click(button)

    expect(select.baseElement).toHaveTextContent('option1')
    expect(select.baseElement).toHaveTextContent('option2')
    expect(select.baseElement).toHaveTextContent('option3')

    const options = select.getAllByRole('option')
    await user.click(options[0])
    expect(select.container.querySelector('input[name="testText"]')).toHaveValue('option1')

    const buttonAfter = select.getByRole('button')
    await user.click(buttonAfter)
    const optionsAfter = select.getAllByRole('option')
    await user.click(optionsAfter[1])
    expect(select.container.querySelector('input[name="testText"]')).toHaveValue('option2')
  })

  it('should focus on mount ', () => {
    const select = render(
      <TestInputWrapper>
        <Select {...selectProps.focused} />
      </TestInputWrapper>
    )
    const input = select.getByRole('button')

    expect(document.activeElement).toBe(input)
  })
})
