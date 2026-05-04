import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { TestInputWrapper } from '@/components/shared/react-hook-form-inputs/__tests__/test-utils'
import { RHFCheckbox } from '@/components/shared/react-hook-form-inputs'

const checkbox = {
  standard: {
    label: 'label',
    name: 'test',
  },
}

describe('determine whether the integration between react-hook-form and MUI’s Checkbox works', () => {
  it('gets the input from the user correctly', async () => {
    const user = userEvent.setup()
    const checkboxResult = render(
      <TestInputWrapper>
        <RHFCheckbox {...checkbox.standard} />
      </TestInputWrapper>
    )

    const checkboxInput = checkboxResult.getByRole('checkbox')
    expect(checkboxInput).not.toBeChecked()

    await user.click(checkboxInput)
    expect(checkboxInput).toBeChecked()

    await user.click(checkboxInput)
    expect(checkboxInput).not.toBeChecked()
  })
})

describe('RHFCheckbox Accessibility', () => {
  it('should link the input aria-labelledby to the label element ID to prevent orphaned labels', () => {
    const testLabel = 'Accessibility Test Label'

    render(
      <TestInputWrapper>
        <RHFCheckbox name={checkbox.standard.name} label={testLabel} />
      </TestInputWrapper>
    )

    const checkboxInput = screen.getByRole('checkbox')

    const ariaLabelledBy = checkboxInput.getAttribute('aria-labelledby')

    expect(ariaLabelledBy).toBeTruthy()

    const labelElementById = document.getElementById(ariaLabelledBy as string)

    expect(labelElementById).toBeInTheDocument()

    expect(labelElementById).toHaveTextContent(testLabel)
  })
})
