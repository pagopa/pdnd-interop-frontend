import React from 'react'
import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { TestInputWrapper } from '@/components/shared/react-hook-form-inputs/__tests__/test-utils'
import { AgreementVerifiedAttributesDrawerRadioGroup } from '../AgreementVerifiedAttributesDrawerRadioGroup'

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
  },
}

describe('AgreementVerifiedAttributesDrawerRadioGroup tests', () => {
  it('gets the input from the user correctly', async () => {
    const user = userEvent.setup()
    const radioGroupResult = render(
      <TestInputWrapper>
        <AgreementVerifiedAttributesDrawerRadioGroup {...radioGroupProps.standard} />
      </TestInputWrapper>
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

    await user.click(radioOption1)
    expect(radioOption1).toBeChecked()
    expect(radioOption2).not.toBeChecked()
    expect(radioOption3).not.toBeChecked()

    await user.click(radioOption2)
    expect(radioOption1).not.toBeChecked()
    expect(radioOption2).toBeChecked()
    expect(radioOption3).not.toBeChecked()

    await user.click(radioOption3)
    expect(radioOption1).not.toBeChecked()
    expect(radioOption2).not.toBeChecked()
    expect(radioOption3).toBeChecked()
  })

  it('should not render if options is empty', () => {
    const { container } = render(
      <TestInputWrapper>
        <AgreementVerifiedAttributesDrawerRadioGroup {...radioGroupProps.standard} options={[]} />
      </TestInputWrapper>
    )

    expect(container).toBeEmptyDOMElement()
  })

  it('should render correctly with label if label prop is given', () => {
    const radioGroupResult = render(
      <TestInputWrapper>
        <AgreementVerifiedAttributesDrawerRadioGroup {...radioGroupProps.standard} />
      </TestInputWrapper>
    )

    expect(radioGroupResult.baseElement).toMatchSnapshot()
  })
})
