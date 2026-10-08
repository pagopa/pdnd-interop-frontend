import React from 'react'
import type { PropsWithChildren } from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { TestInputWrapper } from '@/components/shared/react-hook-form-inputs/__tests__/test-utils'
import { RHFNewSwitch } from '@/components/shared/react-hook-form-inputs'
import { ThemeProvider } from '@mui/system'
import { theme } from '@pagopa/interop-fe-commons'

const switchProps = {
  standard: {
    label: 'label',
    name: 'test',
  },
}

const WithTheme = ({ children }: PropsWithChildren) => (
  <ThemeProvider theme={theme}>{children}</ThemeProvider>
)

describe('determine whether the integration between react-hook-form and MUI’s Switch works', () => {
  it('gets the input from the user correctly', async () => {
    const user = userEvent.setup()
    const switchResult = render(
      <WithTheme>
        <TestInputWrapper>
          <RHFNewSwitch {...switchProps.standard} />
        </TestInputWrapper>
      </WithTheme>
    )

    const switchInput = switchResult.getByRole('checkbox')
    expect(switchInput).not.toBeChecked()

    await user.click(switchInput)
    expect(switchInput).toBeChecked()

    await user.click(switchInput)
    expect(switchInput).not.toBeChecked()
  })
})

describe('RHFNewSwitch Accessibility', () => {
  it('should link the input aria-labelledby to the label element ID to prevent orphaned labels', () => {
    const testLabel = 'Accessibility Test Label'

    render(
      <WithTheme>
        <TestInputWrapper>
          <RHFNewSwitch name={switchProps.standard.name} label={testLabel} />
        </TestInputWrapper>
      </WithTheme>
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
