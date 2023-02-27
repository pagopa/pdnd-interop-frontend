import React from 'react'
import { render } from '@testing-library/react'
import { Stepper } from '@/components/shared/Stepper'
import type { StepperStep } from '@/types/common.types'

const steps: Array<StepperStep> = [
  { label: 'step1', component: () => <div>Step 1</div> }, // React element type require component as a function
  { label: 'step2', component: () => <div>Step 2</div> },
  { label: 'step3', component: () => <div>Step 3</div> },
]

describe("Checks that Stepper snapshots didn't change", () => {
  it('renders correctly step 1', () => {
    const stepper = render(<Stepper steps={steps} activeIndex={1} />)
    // doesn't render component
    expect(stepper).toMatchSnapshot()
  })

  it('renders correctly step 2', () => {
    const stepper = render(<Stepper steps={steps} activeIndex={2} />)

    expect(stepper).toMatchSnapshot()
  })

  it('renders correctly step 3', () => {
    const stepper = render(<Stepper steps={steps} activeIndex={3} />)

    expect(stepper).toMatchSnapshot()
  })
})
