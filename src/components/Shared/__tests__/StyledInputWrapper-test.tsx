import React from 'react'
import renderer from 'react-test-renderer'
import { StyledInputWrapper } from '../StyledInputWrapper'

describe('Snapshot', () => {
  it('matches input field', () => {
    const props = { name: 'input-wrapper', errors: {}, hasFieldError: false }
    const component = renderer.create(
      <StyledInputWrapper {...props}>
        <input type="text" />
      </StyledInputWrapper>
    )
    const tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('matches input field with error', () => {
    const props = {
      name: 'input-wrapper',
      errors: { 'input-wrapper': { message: 'il campo è vuoto' } },
      hasFieldError: true,
    }
    const component = renderer.create(
      <StyledInputWrapper {...props}>
        <input type="text" />
      </StyledInputWrapper>
    )
    const tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })
})
