import React from 'react'
import renderer from 'react-test-renderer'
import { EmptyComponent } from '../EmptyComponent'
import { StyledStepper } from '../StyledStepper'

describe('Snapshot', () => {
  it('matches', () => {
    const steps = [
      { label: 'Step 1', component: EmptyComponent },
      { label: 'Step 2', component: EmptyComponent },
      { label: 'Step 3', component: EmptyComponent },
    ]
    const component = renderer.create(<StyledStepper steps={steps} activeIndex={1} />)
    const tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })
})
