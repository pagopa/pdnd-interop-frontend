import React from 'react'
import renderer from 'react-test-renderer'
import { StyledInputControlledText } from '../StyledInputControlledText'

function Text() {
  const props = { name: 'test', label: 'Test testo' }
  return <StyledInputControlledText {...props} />
}

describe('Snapshot', () => {
  it('matches', () => {
    const component = renderer.create(<Text />)
    const tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })
})
