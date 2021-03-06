import React from 'react'
import renderer from 'react-test-renderer'
import { InputSelectOption } from '../../../../types'
import { StyledInputControlledSelect } from '../StyledInputControlledSelect'

type SelectProps = {
  options?: Array<InputSelectOption>
}

function Select({ options }: SelectProps) {
  return <StyledInputControlledSelect name="test" options={options} />
}

describe('Snapshot', () => {
  it('matches null', () => {
    const component = renderer.create(<Select />)
    const tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('matches select', () => {
    const options = [
      { label: 'Opzione 1', value: 1 },
      { label: 'Opzione 2', value: 2 },
    ]
    const component = renderer.create(<Select options={options} />)
    const tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })
})
