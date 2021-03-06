import React from 'react'
import renderer from 'react-test-renderer'
import noop from 'lodash/noop'
import { AllTheProviders } from '../../../__mocks__/providers'
import { StyledButton } from '../StyledButton'

describe('Snapshot', () => {
  it('matches button', () => {
    const component = renderer.create(<StyledButton onClick={noop}>Clicca qui</StyledButton>)
    const tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('matches link', () => {
    const component = renderer.create(
      <AllTheProviders>
        <StyledButton to="/rotta-esempio">Clicca qui</StyledButton>
      </AllTheProviders>
    )
    const tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })
})
