import React from 'react'
import renderer from 'react-test-renderer'
import { StyledInputError } from '../StyledInputError'

describe('Snapshot', () => {
  it('matches', () => {
    const error = { message: 'Testo messaggio di errore...' }
    const component = renderer.create(<StyledInputError error={error} />)
    const tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })
})
