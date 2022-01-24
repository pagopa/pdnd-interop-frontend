import React from 'react'
import renderer from 'react-test-renderer'
import { noop } from 'lodash'
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

  it('matches button', () => {
    const component = renderer.create(
      <AllTheProviders>
        <StyledLink component="button" onClick={noop}>
          Clicca qui
        </StyledLink>
      </AllTheProviders>
    )
    const tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })
})
