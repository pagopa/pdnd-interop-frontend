import React from 'react'
import renderer from 'react-test-renderer'
import { StyledForm } from '../StyledForm'

describe('Snapshot', () => {
  it('matches', () => {
    const component = renderer.create(<StyledForm>Form fields</StyledForm>)
    const tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })
})
