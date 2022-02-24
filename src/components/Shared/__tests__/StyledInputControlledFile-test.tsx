import React from 'react'
import noop from 'lodash/noop'
import renderer from 'react-test-renderer'
import { StyledInputControlledFile } from '../StyledInputControlledFile'

function File() {
  const props = {
    name: 'file',
    label: 'Test file input',
    setFieldValue: noop,
    value: null,
  }

  return <StyledInputControlledFile {...props} />
}

describe('Snapshot', () => {
  it('matches', () => {
    const component = renderer.create(<File />)
    const tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })
})
