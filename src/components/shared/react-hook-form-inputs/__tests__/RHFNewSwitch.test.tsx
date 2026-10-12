import React from 'react'
import type { PropsWithChildren } from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { FormProvider, useForm } from 'react-hook-form'

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

const NestedFieldErrorWrapper = ({ children }: PropsWithChildren) => {
  const { setError, ...formMethods } = useForm<{ preferences: { enabled: boolean } }>({
    defaultValues: { preferences: { enabled: false } },
  })

  React.useEffect(() => {
    setError('preferences.enabled', {
      type: 'manual',
      message: 'Enable this preference to continue',
    })
  }, [setError])

  return (
    <FormProvider {...formMethods} setError={setError}>
      {children}
    </FormProvider>
  )
}

const RequiredFieldErrorWrapper = ({ children }: PropsWithChildren) => {
  const formMethods = useForm<{ preferences: { enabled: boolean } }>({
    defaultValues: { preferences: { enabled: false } },
  })
  const { trigger } = formMethods

  React.useEffect(() => {
    void trigger('preferences.enabled')
  }, [trigger])

  return <FormProvider {...formMethods}>{children}</FormProvider>
}

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

    const labelledByIds = switchInput.getAttribute('aria-labelledby')?.split(' ') ?? []

    expect(labelledByIds).not.toHaveLength(0)
    expect(
      labelledByIds.some((id) => document.getElementById(id)?.textContent?.includes(testLabel))
    ).toBe(true)
  })

  it('shows nested field errors and links them to the switch input', async () => {
    const errorMessage = 'Enable this preference to continue'

    render(
      <WithTheme>
        <NestedFieldErrorWrapper>
          <RHFNewSwitch name="preferences.enabled" label="Preference enabled" />
        </NestedFieldErrorWrapper>
      </WithTheme>
    )

    const switchInput = screen.getByRole('checkbox')
    const renderedError = await screen.findByText(errorMessage)
    expect(renderedError.textContent).toBe(errorMessage)
    expect(switchInput.getAttribute('aria-invalid')).toBe('true')
    const describedByIds = switchInput.getAttribute('aria-describedby')?.split(' ') ?? []
    expect(
      describedByIds.some((id) => document.getElementById(id)?.textContent === errorMessage)
    ).toBe(true)
  })

  it('shows errors produced by validation rules', async () => {
    const errorMessage = 'Enable this preference to continue'

    render(
      <WithTheme>
        <RequiredFieldErrorWrapper>
          <RHFNewSwitch
            name="preferences.enabled"
            label="Preference enabled"
            rules={{ required: errorMessage }}
          />
        </RequiredFieldErrorWrapper>
      </WithTheme>
    )

    const switchInput = screen.getByRole('checkbox')
    expect((await screen.findByText(errorMessage)).textContent).toBe(errorMessage)
    expect(switchInput.getAttribute('aria-invalid')).toBe('true')
  })
})
