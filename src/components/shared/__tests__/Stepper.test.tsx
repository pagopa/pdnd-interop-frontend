import { describe, expect, it } from 'vitest'
import type { StepperStep } from '@/types/common.types'
import { renderWithApplicationContext } from '@/utils/testing.utils'
import { Stepper } from '../Stepper'
import { screen } from '@testing-library/react'

const DummyStep = () => null

const steps: Array<StepperStep> = [
  { label: 'Step one', component: DummyStep },
  { label: 'Step two', component: DummyStep },
  { label: 'Step three', component: DummyStep },
]

describe('Stepper', () => {
  it('renders SR-only status text for completed and current steps', () => {
    renderWithApplicationContext(<Stepper steps={steps} activeIndex={1} />, {})

    const firstLabel = screen.getByText('Step one').closest('.MuiStepLabel-root')
    const secondLabel = screen.getByText('Step two').closest('.MuiStepLabel-root')
    const thirdLabel = screen.getByText('Step three').closest('.MuiStepLabel-root')

    expect(firstLabel).toHaveTextContent('completeLabel: stepperLabel')
    expect(secondLabel).toHaveTextContent('currentStepLabel: stepperLabel')
    expect(thirdLabel).toHaveTextContent('stepperLabel')
    expect(thirdLabel).not.toHaveTextContent('completeLabel')
    expect(thirdLabel).not.toHaveTextContent('currentStepLabel')
  })

  it('makes each step label focusable and keeps labels visible', () => {
    renderWithApplicationContext(<Stepper steps={steps} activeIndex={1} />, {})

    const stepOne = screen.getByText('Step one').closest('.MuiStepLabel-root')
    const stepTwo = screen.getByText('Step two').closest('.MuiStepLabel-root')
    const stepThree = screen.getByText('Step three').closest('.MuiStepLabel-root')

    expect(stepOne).toHaveAttribute('tabindex', '0')
    expect(stepTwo).toHaveAttribute('tabindex', '0')
    expect(stepThree).toHaveAttribute('tabindex', '0')

    expect(screen.getByText('Step one')).toBeVisible()
    expect(screen.getByText('Step two')).toBeVisible()
    expect(screen.getByText('Step three')).toBeVisible()
  })
})
