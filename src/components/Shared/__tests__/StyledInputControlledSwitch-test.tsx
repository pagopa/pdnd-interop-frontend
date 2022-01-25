import React from 'react'
import renderer from 'react-test-renderer'
import { useForm } from 'react-hook-form'
import { StyledInputControlledSwitch } from '../StyledInputControlledSwitch'

function Switch() {
  const props = { name: 'test', label: 'Test switch', rules: {} }

  const {
    control,
    formState: { errors },
  } = useForm()

  return <StyledInputControlledSwitch {...props} control={control} errors={errors} />
}

describe('Snapshot', () => {
  it('matches', () => {
    const component = renderer.create(<Switch />)
    const tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })
})
