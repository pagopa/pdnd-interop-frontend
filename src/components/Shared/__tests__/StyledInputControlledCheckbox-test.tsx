import { noop } from 'lodash'
import React from 'react'
import renderer from 'react-test-renderer'
import { StyledInputControlledCheckbox } from '../StyledInputControlledCheckbox'

type Option = {
  name: string
  label: string
}

type CheckboxProps = {
  options?: Array<Option>
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
      { label: 'Prima opzione', name: 'first' },
      { label: 'Seconda opzione', name: 'second' },
    ]
    const component = renderer.create(<Checkbox options={options} />)
    const tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })
})
