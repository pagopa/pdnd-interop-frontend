import React from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { RiskAnalysisSwitch } from '../RiskAnalysisSwitch'
import { render } from '@testing-library/react'

type RiskAnalysisSwitchProps = React.ComponentProps<typeof RiskAnalysisSwitch>

const renderRiskAnalysisSwitch = (props?: Partial<RiskAnalysisSwitchProps>) => {
  const propsWithDefaults: RiskAnalysisSwitchProps = {
    label: 'RiskAnalysisSwitch',
    name: 'RiskAnalysisSwitch',
    options: [],
    rules: {},
    sx: {},
    ...props,
  }

  const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const formMethods = useForm({
      defaultValues: {
        RiskAnalysisSwitch: false,
      },
    })

    return <FormProvider {...formMethods}>{children}</FormProvider>
  }

  return render(<RiskAnalysisSwitch {...propsWithDefaults} />, { wrapper: Wrapper })
}

describe('RiskAnalysisSwitch', () => {
  it('should match snapshot', () => {
    const { baseElement } = renderRiskAnalysisSwitch({
      options: [{ label: 'test', value: 'test' }],
    })
    expect(baseElement).toMatchSnapshot()
  })

  it('should change value when clicked', () => {
    const { getByRole } = renderRiskAnalysisSwitch()
    const checkbox = getByRole('checkbox')
    expect(checkbox).not.toBeChecked()
    checkbox.click()
    expect(checkbox).toBeChecked()
  })
})
