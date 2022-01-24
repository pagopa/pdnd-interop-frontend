import React from 'react'
import { useForm } from 'react-hook-form'
import renderer from 'react-test-renderer'
import { StyledInputControlledCheckbox } from '../StyledInputControlledCheckbox'

type Option = {
  value: string
  label: string
}

type CheckboxProps = {
  options?: Array<Option>
}

function Checkbox({ options }: CheckboxProps) {
  const props = { name: 'test', rules: {} }

  const {
    control,
    formState: { errors },
  } = useForm()

  return (
    <StyledInputControlledCheckbox {...props} control={control} errors={errors} options={options} />
  )
}

describe('Snapshot', () => {
  it('matches null', () => {
    const component = renderer.create(<Checkbox />)
    const tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('matches options', () => {
    const options = [
      { label: 'Prima opzione', value: 'first' },
      { label: 'Seconda opzione', value: 'second' },
    ]
    const component = renderer.create(<Checkbox options={options} />)
    const tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })
})
