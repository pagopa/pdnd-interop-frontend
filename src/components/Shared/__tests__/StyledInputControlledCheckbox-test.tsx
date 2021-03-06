import React from 'react'
import noop from 'lodash/noop'
import renderer from 'react-test-renderer'
import { InputCheckboxOption } from '../../../../types'
import { StyledInputControlledCheckbox } from '../StyledInputControlledCheckbox'

type CheckboxProps = {
  options?: Array<InputCheckboxOption>
}

function Checkbox({ options }: CheckboxProps) {
  const props = { name: 'test', rules: {} }
  return (
    <StyledInputControlledCheckbox
      {...props}
      name="test"
      options={options}
      setFieldValue={noop}
      value={{ first: true }}
    />
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
