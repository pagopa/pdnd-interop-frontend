import React from 'react'
import { useForm } from 'react-hook-form'
import renderer from 'react-test-renderer'
import { StyledInputControlledRadio } from '../StyledInputControlledRadio'

type Option = {
  value: string
  label: string
}

type CheckboxProps = {
  options?: Array<Option>
}

function Radio({ options }: CheckboxProps) {
  const props = { name: 'test', rules: {} }

  const {
    control,
    formState: { errors },
  } = useForm()

  return (
    <StyledInputControlledRadio {...props} control={control} errors={errors} options={options} />
  )
}

describe('Snapshot', () => {
  it('matches null', () => {
    const component = renderer.create(<Radio />)
    const tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('matches options', () => {
    const options = [
      { label: 'Prima opzione', value: 'first' },
      { label: 'Seconda opzione', value: 'second' },
    ]
    const component = renderer.create(<Radio options={options} />)
    const tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })
})
