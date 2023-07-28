import React from 'react'
import { fireEvent, render } from '@testing-library/react'
import { AgreementVerifiedAttributesDrawerRadioGroup } from '../AgreementVerifiedAttributesDrawerRadioGroup'
import { vi } from 'vitest'

const radioGroupOptions = [
  { label: 'option1', value: 'option1' },
  { label: 'option2', value: 'option2' },
  { label: 'option3', value: 'option3' },
]

const radioGroupProps = {
  standard: {
    label: 'label',
    name: 'testText',
    options: radioGroupOptions,
    value: undefined,
    onChange: vi.fn(),
  },
}

describe('AgreementVerifiedAttributesDrawerRadioGroup tests', () => {
  it('gets the input from the user correctly', () => {
    const radioGroupResult = render(
      <AgreementVerifiedAttributesDrawerRadioGroup {...radioGroupProps.standard} />
    )

    const radioOption1 = radioGroupResult.getByRole('radio', {
      name: 'option1',
    }) as HTMLInputElement
    const radioOption2 = radioGroupResult.getByRole('radio', {
      name: 'option2',
    }) as HTMLInputElement
    const radioOption3 = radioGroupResult.getByRole('radio', {
      name: 'option3',
    }) as HTMLInputElement

    expect(radioOption1).not.toBeChecked()
    expect(radioOption2).not.toBeChecked()
    expect(radioOption3).not.toBeChecked()

    fireEvent.click(radioOption1)
    expect(radioOption1).toBeChecked()
    expect(radioOption2).not.toBeChecked()
    expect(radioOption3).not.toBeChecked()

    fireEvent.click(radioOption2)
    expect(radioOption1).not.toBeChecked()
    expect(radioOption2).toBeChecked()
    expect(radioOption3).not.toBeChecked()

    fireEvent.click(radioOption3)
    expect(radioOption1).not.toBeChecked()
    expect(radioOption2).not.toBeChecked()
    expect(radioOption3).toBeChecked()
  })

  it('should not render if options is empty', () => {
    const { container } = render(
      <AgreementVerifiedAttributesDrawerRadioGroup {...radioGroupProps.standard} options={[]} />
    )

    expect(container).toBeEmptyDOMElement()
  })

  it('should render correctly with label if label prop is given', () => {
    const radioGroupResult = render(
      <AgreementVerifiedAttributesDrawerRadioGroup {...radioGroupProps.standard} />
    )

    expect(radioGroupResult.baseElement).toMatchSnapshot()
  })
})
