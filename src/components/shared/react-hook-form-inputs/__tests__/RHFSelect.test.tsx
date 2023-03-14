import React from 'react'
import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { TestInputWrapper } from '@/components/shared/react-hook-form-inputs/__tests__/test-utils'
import { RHFSelect } from '@/components/shared/react-hook-form-inputs'

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
        <RHFSelect {...selectProps.standard} />
      </TestInputWrapper>
    )
    const button = select.getByRole('button')
    await user.click(button)

    expect(select.baseElement).toHaveTextContent('option1')
    expect(select.baseElement).toHaveTextContent('option2')
    expect(select.baseElement).toHaveTextContent('option3')

    const option1 = select.getByRole('option', { name: 'option1' })

    await user.click(option1)
    expect(select.container.querySelector('input[name="testText"]')).toHaveValue('option1')

    const buttonAfter = select.getByRole('button')
    await user.click(buttonAfter)
    const option2 = select.getByRole('option', { name: 'option2' })
    await user.click(option2)
    expect(select.container.querySelector('input[name="testText"]')).toHaveValue('option2')
  })

  it('should focus on mount ', () => {
    const select = render(
      <TestInputWrapper>
        <RHFSelect {...selectProps.focused} />
      </TestInputWrapper>
    )
    const input = select.getByRole('button')

    expect(document.activeElement).toBe(input)
  })
})
