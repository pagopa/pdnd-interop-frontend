import React from 'react'
import renderer from 'react-test-renderer'
import { AllTheProviders } from '../../../__mocks__/providers'
import { StyledLink } from '../StyledLink'

describe('Snapshot', () => {
  it('matches link', () => {
    const component = renderer.create(
      <AllTheProviders>
        <StyledLink to="/rotta-esempio">Clicca qui</StyledLink>
      </AllTheProviders>
    )
    const tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })
})
