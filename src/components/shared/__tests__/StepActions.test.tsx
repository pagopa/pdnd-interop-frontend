import React from 'react'
import { render } from '@testing-library/react'
import { BackAction, ForwardAction, StepActions } from '@/components/shared/StepActions'
import { MemoryRouter } from 'react-router-dom'
import { vi } from 'vitest'

const actions: Record<string, BackAction | ForwardAction> = {
  backButton: { label: 'label', type: 'button', onClick: vi.fn() },
  backLink: { label: 'label', type: 'link', to: 'TOS' },
  backLinkDisabled: { label: 'label', type: 'link', to: 'TOS', disabled: true },
  forwardButton: { label: 'label', type: 'button', onClick: vi.fn() },
  forwardSubmitDisabled: { label: 'label', type: 'submit', disabled: true },
}

const WrappedStepActions = (props: Record<string, BackAction | ForwardAction>) => (
  <MemoryRouter>
    <StepActions {...props} />
  </MemoryRouter>
)

describe("Checks that StepActions snapshots didn't change", () => {
  it('renders StepActions with back button', () => {
    const stepActions = render(<WrappedStepActions back={actions.backButton} />)

    expect(stepActions).toMatchSnapshot()
  })

  it('renders StepActions with back link ', () => {
    const stepActions = render(<WrappedStepActions back={actions.backLink} />)

    expect(stepActions).toMatchSnapshot()
  })

  it('renders StepActions with back link disabled', () => {
    const stepActions = render(<WrappedStepActions back={actions.backLinkDisabled} />)

    expect(stepActions).toMatchSnapshot()
  })

  it('renders StepActions with forward button', () => {
    const stepActions = render(<WrappedStepActions forward={actions.forwardButton} />)

    expect(stepActions).toMatchSnapshot()
  })

  it('renders StepActions with forward submit disabled', () => {
    const stepActions = render(<WrappedStepActions forward={actions.forwardSubmitDisabled} />)

    expect(stepActions).toMatchSnapshot()
  })

  it('renders StepActions with forward and back button disabled', () => {
    const stepActions = render(
      <WrappedStepActions
        back={actions.backButton as BackAction}
        forward={actions.forwardSubmitDisabled}
      />
    )

    expect(stepActions).toMatchSnapshot()
  })
})
