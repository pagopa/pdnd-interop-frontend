import React from 'react'
import { fireEvent, render } from '@testing-library/react'

import { TestInputWrapper } from '@/components/shared/react-hook-form-inputs/__tests__/test-utils'
import { AgreementVerifiedAttributesDrawerDatePicker } from '../AgreementVerifiedAttributesDrawerDatePicker'

const datePickerProps = {
  standard: {
    label: 'label',
    name: 'test',
  },
}

describe('determine whether the integration between react-hook-form and MUI’s DatePicker works', () => {
  it('gets the input from the user correctly', async () => {
    const datePickerResult = render(
      <TestInputWrapper>
        <AgreementVerifiedAttributesDrawerDatePicker {...datePickerProps.standard} />
      </TestInputWrapper>
    )

    const textBox = datePickerResult.getByRole('textbox')
    expect(textBox).toHaveValue('01/01/1970')

    const buttonChooseDate = datePickerResult.getByRole('button', { name: 'Choose date' })
    fireEvent.click(buttonChooseDate)

    const selectedCell = datePickerResult.getByRole('gridcell', {
      selected: true,
    })
    expect(selectedCell).toHaveTextContent('1')

    const secondCell = datePickerResult.getByRole('gridcell', {
      name: '2',
    })
    fireEvent.click(secondCell)
    expect(textBox).toHaveValue('02/01/1970')

    const thirdCell = datePickerResult.getByRole('gridcell', {
      name: '3',
    })
    fireEvent.click(thirdCell)
    expect(textBox).toHaveValue('03/01/1970')

    const fourthCell = datePickerResult.getByRole('gridcell', {
      name: '4',
    })
    fireEvent.click(fourthCell)
    expect(textBox).toHaveValue('04/01/1970')
  })

  it('switches to year view', async () => {
    const datePickerResult = render(
      <TestInputWrapper>
        <AgreementVerifiedAttributesDrawerDatePicker {...datePickerProps.standard} />
      </TestInputWrapper>
    )

    const buttonChooseDate = datePickerResult.getByRole('button', { name: 'Choose date' })
    fireEvent.click(buttonChooseDate)
    expect(
      datePickerResult.queryByRole('button', {
        name: '1980',
      })
    ).not.toBeInTheDocument()

    const switchViewButton = datePickerResult.getByRole('button', {
      name: 'calendar view is open, switch to year view',
    })
    fireEvent.click(switchViewButton)
    expect(
      datePickerResult.getByRole('button', {
        name: '1980',
      })
    ).toBeInTheDocument()
  })
})
