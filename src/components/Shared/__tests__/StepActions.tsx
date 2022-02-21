import React from 'react'
import renderer from 'react-test-renderer'
import { noop } from 'lodash'
import { BackAction, StepActions, ForwardAction } from '../StepActions'
import { AllTheProviders } from '../../../__mocks__/providers'

describe('Snapshot', () => {
  it('matches link and button', () => {
    const back: BackAction = { label: 'Indietro', type: 'link', to: '/test-route' }
    const forward: ForwardAction = { label: 'Avanti', type: 'button', onClick: noop }
    const component = renderer.create(
      <AllTheProviders>
        <StepActions back={back} forward={forward}></StepActions>
      </AllTheProviders>
    )
    const tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('matches button and submit', () => {
    const back: BackAction = { label: 'Indietro', type: 'button', onClick: noop }
    const forward: ForwardAction = { label: 'Avanti', type: 'submit' }
    const component = renderer.create(<StepActions back={back} forward={forward}></StepActions>)
    const tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })
})
