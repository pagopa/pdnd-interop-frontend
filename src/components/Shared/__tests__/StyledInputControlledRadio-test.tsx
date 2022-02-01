import React from 'react'
import renderer from 'react-test-renderer'
import { InputRadioOption } from '../../../../types'
import { StyledInputControlledRadio } from '../StyledInputControlledRadio'

type RadioProps = {
  options?: Array<InputRadioOption>
}

function Radio({ options }: RadioProps) {
  return <StyledInputControlledRadio name="test" options={options} />
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
