import React from 'react'
import renderer from 'react-test-renderer'
import { useForm } from 'react-hook-form'
import { StyledInputControlledFile } from '../StyledInputControlledFile'

function File() {
  const {
    control,
    formState: { errors },
  } = useForm()

  const props = {
    control,
    errors,
    name: 'file',
    label: 'Test file input',
    rules: {},
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
