import React from 'react'
import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import {
  selectAndGetDateCell,
  TestInputWrapper,
} from '@/components/shared/ReactHookFormInputs/__tests__/test-utils'
import { DatePicker } from '@/components/shared/ReactHookFormInputs'

const datePickerProps = {
  standard: {
    label: 'label',
    name: 'test',
  },
}

describe('determine whether the integration between react-hook-form and MUI’s Switch works', () => {
  it('gets the input from the user correctly', async () => {
    const datePickerResult = render(
      <TestInputWrapper>
        <DatePicker {...datePickerProps.standard} />
      </TestInputWrapper>
    )
    let selectedCell
    selectedCell = datePickerResult.getByRole('gridcell', {
      selected: true,
    })
    expect(selectedCell).toHaveTextContent('1')

    selectedCell = await selectAndGetDateCell(datePickerResult, 2)
    expect(selectedCell).toHaveTextContent('2')

    selectedCell = await selectAndGetDateCell(datePickerResult, 3)
    expect(selectedCell).toHaveTextContent('3')

    selectedCell = await selectAndGetDateCell(datePickerResult, 4)
    expect(selectedCell).toHaveTextContent('4')
  })

  it('switches to year view', async () => {
    const user = userEvent.setup()
    const datePickerResult = render(
      <TestInputWrapper>
        <DatePicker {...datePickerProps.standard} />
      </TestInputWrapper>
    )

    expect(datePickerResult.baseElement).toHaveTextContent('LMMGVSD')
    const switchViewButton = datePickerResult.getByRole('button', {
      name: 'calendar view is open, switch to year view',
    })

    await user.click(switchViewButton)
    expect(datePickerResult.baseElement).not.toHaveTextContent('LMMGVSD')
  })
})
