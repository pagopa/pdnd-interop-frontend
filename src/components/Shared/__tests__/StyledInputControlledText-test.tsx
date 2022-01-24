import React from 'react'
import renderer from 'react-test-renderer'
import { useForm } from 'react-hook-form'
import { StyledInputControlledText } from '../StyledInputControlledText'

function Text() {
  const props = { name: 'test', label: 'Test testo', rules: {} }

  const {
    control,
    formState: { errors },
  } = useForm()

  return <StyledInputControlledText {...props} control={control} errors={errors} />
}

describe('Snapshot', () => {
  it('matches', () => {
    const component = renderer.create(<Text />)
    const tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })
})
