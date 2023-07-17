import { fireEvent, render } from '@testing-library/react'
import React from 'react'
import AgreementVerifiedAttributesDrawerForm from '../AgreementVerifiedAttributesDrawerForm'
import { vi } from 'vitest'
import isLastDayOfMonth from 'date-fns/isLastDayOfMonth'
import type { AgreementVerifiedAttributesDrawerVerifingFormValues } from '../AgreementVerifiedAttributesDrawer'
import addDays from 'date-fns/addDays'

const renderAgreementVerifiedAttributesDrawerFormWithFormWrapper = () => {
  const TestAgreementVerifiedAttributesDrawerFormWrapper = () => {
    const [formState, setFormState] =
      React.useState<AgreementVerifiedAttributesDrawerVerifingFormValues>({
        hasExpirationDate: undefined,
        expirationDate: undefined,
      })

    return (
      <>
        <AgreementVerifiedAttributesDrawerForm
          formState={formState}
          setFormState={setFormState}
          verifier={undefined}
        />
      </>
    )
  }

  return render(<TestAgreementVerifiedAttributesDrawerFormWrapper />)
}

describe('AgreementVerifiedAttributesDrawerForm test', () => {
  it('should render correctly with hasExpirationDate, expirationDate and verifier undefined', () => {
    const screen = render(
      <AgreementVerifiedAttributesDrawerForm
        formState={{
          hasExpirationDate: undefined,
          expirationDate: undefined,
        }}
        setFormState={vi.fn()}
        verifier={undefined}
      />
    )

    expect(
      screen.getByRole('radio', {
        name: 'form.radioGroup.options.NO',
      }) as HTMLInputElement
    ).toBeChecked()

    expect(
      screen.getByRole('radio', {
        name: 'form.radioGroup.options.YES',
      }) as HTMLInputElement
    ).not.toBeChecked()

    expect(screen.queryByRole('textbox')).not.toBeInTheDocument()
  })

  it('should render correctly with hasExpirationDate, expirationDate undefined and verifier defined', () => {
    const screen = render(
      <AgreementVerifiedAttributesDrawerForm
        formState={{
          hasExpirationDate: undefined,
          expirationDate: undefined,
        }}
        setFormState={vi.fn()}
        verifier={{
          id: 'test-id-producer',
          verificationDate: '2023-07-13T09:33:35.000Z',
          expirationDate: '2023-07-15T09:33:35.000Z',
        }}
      />
    )

    expect(
      screen.getByRole('radio', {
        name: 'form.radioGroup.options.NO',
      }) as HTMLInputElement
    ).not.toBeChecked()

    expect(
      screen.getByRole('radio', {
        name: 'form.radioGroup.options.YES',
      }) as HTMLInputElement
    ).toBeChecked()

    expect(screen.getByRole('textbox')).toBeInTheDocument()
    expect(screen.getByRole('textbox')).toHaveValue('15/07/2023')
  })

  it('should render correctly with hasExpirationDate defined and expirationDate and verifier undefined', () => {
    const screen = render(
      <AgreementVerifiedAttributesDrawerForm
        formState={{
          hasExpirationDate: 'NO',
          expirationDate: undefined,
        }}
        setFormState={vi.fn()}
        verifier={undefined}
      />
    )

    expect(
      screen.getByRole('radio', {
        name: 'form.radioGroup.options.NO',
      }) as HTMLInputElement
    ).toBeChecked()

    expect(
      screen.getByRole('radio', {
        name: 'form.radioGroup.options.YES',
      }) as HTMLInputElement
    ).not.toBeChecked()

    expect(screen.queryByRole('textbox')).not.toBeInTheDocument()
  })

  it('should render correctly with hasExpirationDate defined and expirationDate and verifier undefined', () => {
    const screen = render(
      <AgreementVerifiedAttributesDrawerForm
        formState={{
          hasExpirationDate: 'YES',
          expirationDate: undefined,
        }}
        setFormState={vi.fn()}
        verifier={undefined}
      />
    )

    expect(
      screen.getByRole('radio', {
        name: 'form.radioGroup.options.NO',
      }) as HTMLInputElement
    ).not.toBeChecked()

    expect(
      screen.getByRole('radio', {
        name: 'form.radioGroup.options.YES',
      }) as HTMLInputElement
    ).toBeChecked()

    expect(screen.getByRole('textbox')).toBeInTheDocument()

    const locale = 'it-IT'
    const dateNow = new Date()
    expect(screen.getByRole('textbox')).toHaveValue(
      dateNow.toLocaleDateString(locale, {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      })
    )
  })

  it('should render correctly with hasExpirationDate and expirationDate defined', () => {
    const screen = render(
      <AgreementVerifiedAttributesDrawerForm
        formState={{
          hasExpirationDate: 'YES',
          expirationDate: new Date(),
        }}
        setFormState={vi.fn()}
        verifier={{
          id: 'test-id-producer',
          verificationDate: '2023-07-13T09:33:35.000Z',
          expirationDate: '2023-07-15T09:33:35.000Z',
        }}
      />
    )

    expect(
      screen.getByRole('radio', {
        name: 'form.radioGroup.options.NO',
      }) as HTMLInputElement
    ).not.toBeChecked()

    expect(
      screen.getByRole('radio', {
        name: 'form.radioGroup.options.YES',
      }) as HTMLInputElement
    ).toBeChecked()

    expect(screen.getByRole('textbox')).toBeInTheDocument()

    const locale = 'it-IT'
    const dateNow = new Date()
    expect(screen.getByRole('textbox')).toHaveValue(
      dateNow.toLocaleDateString(locale, {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      })
    )
  })

  it('should call correctly the setFormState function', () => {
    const dateNow = new Date()
    const locale = 'it-IT'

    const screen = renderAgreementVerifiedAttributesDrawerFormWithFormWrapper()

    const radioOptionYes = screen.getByRole('radio', {
      name: 'form.radioGroup.options.YES',
    }) as HTMLInputElement

    expect(radioOptionYes).not.toBeChecked()

    fireEvent.click(radioOptionYes)

    expect(radioOptionYes).toBeChecked()

    expect(screen.getByRole('textbox')).toBeInTheDocument()

    const buttonChooseDate = screen.getByRole('button', {
      name: `Choose date, selected date is ${dateNow.toLocaleDateString(locale, {
        dateStyle: 'medium',
      })}`,
    })
    fireEvent.click(buttonChooseDate)

    if (isLastDayOfMonth(dateNow)) {
      const buttonNextMonth = screen.getByRole('button', { name: 'Next month' })
      fireEvent.click(buttonNextMonth)

      const secondCell = screen.getAllByRole('gridcell', { name: '1' })[0]
      fireEvent.click(secondCell)

      const expectedDate = new Date(addDays(dateNow, 1).setMilliseconds(0))
      expect(screen.getByRole('textbox')).toHaveValue(
        expectedDate.toLocaleDateString(locale, {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        })
      )
    }

    if (!isLastDayOfMonth(dateNow)) {
      const secondCell = screen.getByRole('gridcell', {
        name: `${dateNow.getDate() + 1}`,
      })
      fireEvent.click(secondCell)

      const expectedDate = new Date(addDays(dateNow, 1).setMilliseconds(0))
      expect(screen.getByRole('textbox')).toHaveValue(
        expectedDate.toLocaleDateString(locale, {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        })
      )
    }
  })
})
