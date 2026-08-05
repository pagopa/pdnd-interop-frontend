import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { TestInputWrapper } from '@/components/shared/react-hook-form-inputs/__tests__/test-utils'
import { RHFSwitch } from '@/components/shared/react-hook-form-inputs'

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
        <RHFSwitch {...switchProps.standard} />
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

describe('RHFSwitch Accessibility', () => {
  it('should link the input aria-labelledby to the label element ID to prevent orphaned labels', () => {
    const testLabel = 'Accessibility Test Label'

    render(
      <TestInputWrapper>
        <RHFSwitch name={switchProps.standard.name} label={testLabel} />
      </TestInputWrapper>
    )

    // MUI Switch renders an <input type="checkbox" role="checkbox" /> under the hood
    const switchInput = screen.getByRole('checkbox')

    const ariaLabelledBy = switchInput.getAttribute('aria-labelledby')

    expect(ariaLabelledBy).toBeTruthy()

    const labelElementById = document.getElementById(ariaLabelledBy as string)

    expect(labelElementById).toBeInTheDocument()

    expect(labelElementById).toHaveTextContent(testLabel)
  })
})
