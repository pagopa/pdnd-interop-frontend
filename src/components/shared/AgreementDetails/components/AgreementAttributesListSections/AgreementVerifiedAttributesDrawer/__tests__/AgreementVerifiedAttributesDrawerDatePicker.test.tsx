import React from 'react'
import { fireEvent, render } from '@testing-library/react'
import { AgreementVerifiedAttributesDrawerDatePicker } from '../AgreementVerifiedAttributesDrawerDatePicker'
import { vi } from 'vitest'
import isLastDayOfMonth from 'date-fns/isLastDayOfMonth'
import addDays from 'date-fns/addDays'

const locale = 'it-IT'
const dateNow = new Date()

const datePickerProps = {
  standard: {
    label: 'label',
    name: 'test',
    value: dateNow,
    onChange: vi.fn(),
  },
}

describe('determine whether the integration between react-hook-form and MUI’s DatePicker works', () => {
  it('gets the input from the user correctly', () => {
    const onChangeFn = vi.fn()
    const datePickerResult = render(
      <AgreementVerifiedAttributesDrawerDatePicker
        {...datePickerProps.standard}
        onChange={onChangeFn}
      />
    )

    const textBox = datePickerResult.getByRole('textbox')
    expect(textBox).toHaveValue(
      dateNow.toLocaleDateString(locale, {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      })
    )

    const buttonChooseDate = datePickerResult.getByRole('button', {
      name: `Choose date, selected date is ${dateNow.toLocaleDateString(locale, {
        dateStyle: 'medium',
      })}`,
    })
    fireEvent.click(buttonChooseDate)

    const selectedCell = datePickerResult.getByRole('gridcell', {
      selected: true,
    })
    expect(selectedCell).toHaveTextContent(`${dateNow.getDate()}`)

    if (isLastDayOfMonth(dateNow)) {
      const buttonNextMonth = datePickerResult.getByRole('button', { name: 'Next month' })
      fireEvent.click(buttonNextMonth)

      const secondCell = datePickerResult.getAllByRole('gridcell', { name: '1' })[0]
      fireEvent.click(secondCell)

      const expectedDate = addDays(dateNow, 1).setMilliseconds(0)
      expect(onChangeFn).toBeCalledWith(new Date(expectedDate))
    }

    if (!isLastDayOfMonth(dateNow)) {
      const secondCell = datePickerResult.getByRole('gridcell', {
        name: `${dateNow.getDate() + 1}`,
      })
      fireEvent.click(secondCell)

      const expectedDate = addDays(dateNow, 1).setMilliseconds(0)
      expect(onChangeFn).toBeCalledWith(new Date(expectedDate))
    }
  })

  it('switches to year view', async () => {
    const datePickerResult = render(
      <AgreementVerifiedAttributesDrawerDatePicker {...datePickerProps.standard} />
    )

    const buttonChooseDate = datePickerResult.getByRole('button', {
      name: `Choose date, selected date is ${dateNow.toLocaleDateString(locale, {
        dateStyle: 'medium',
      })}`,
    })
    fireEvent.click(buttonChooseDate)
    expect(
      datePickerResult.queryByRole('button', {
        name: `${dateNow.getFullYear()}`,
      })
    ).not.toBeInTheDocument()

    const switchViewButton = datePickerResult.getByRole('button', {
      name: 'calendar view is open, switch to year view',
    })
    fireEvent.click(switchViewButton)
    expect(
      datePickerResult.getByRole('button', {
        name: `${dateNow.getFullYear()}`,
      })
    ).toBeInTheDocument()
  })
})
