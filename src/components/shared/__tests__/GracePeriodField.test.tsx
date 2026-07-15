import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { FormProvider, useForm } from 'react-hook-form'
import { GracePeriodField } from '../GracePeriodField'
import { DEFAULT_GRACE_PERIOD_DAYS, GRACE_PERIOD_DAYS_OPTIONS } from '@/config/constants'
import { calculateArchivableOn } from '@/utils/eservice.utils'
import { formatDateStringNumeric } from '@/utils/format.utils'

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, options?: Record<string, unknown>) => {
      if (options && 'date' in options) return `Archiving will occur on ${options.date}`
      if (options && 'days' in options) return `${options.days} days`
      return key
    },
    i18n: { language: 'it', changeLanguage: vi.fn() },
  }),
  Trans: ({ children }: { children?: React.ReactNode }) => <>{children}</>,
}))

const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const formMethods = useForm<{ gracePeriodDays: string }>({
    defaultValues: { gracePeriodDays: String(DEFAULT_GRACE_PERIOD_DAYS) },
  })
  return <FormProvider {...formMethods}>{children}</FormProvider>
}

const renderField = () =>
  render(
    <Wrapper>
      <GracePeriodField />
    </Wrapper>
  )

const expectedArchiveDateTextFor = (days: number) =>
  `Archiving will occur on ${formatDateStringNumeric(calculateArchivableOn(new Date(), days))}`

describe('GracePeriodField', () => {
  it('renders one radio per grace period option with the default one preselected', () => {
    renderField()

    const radios = screen.getAllByRole('radio') as Array<HTMLInputElement>
    expect(radios.map((radio) => radio.value)).toEqual(GRACE_PERIOD_DAYS_OPTIONS.map(String))
    expect(radios.find((radio) => radio.value === String(DEFAULT_GRACE_PERIOD_DAYS))).toBeChecked()
  })

  it('updates the archiving-date preview when the user selects a different grace period', async () => {
    renderField()

    expect(
      screen.getByText(expectedArchiveDateTextFor(DEFAULT_GRACE_PERIOD_DAYS))
    ).toBeInTheDocument()

    const radio120 = (screen.getAllByRole('radio') as Array<HTMLInputElement>).find(
      (radio) => radio.value === '120'
    )
    expect(radio120).toBeDefined()

    await userEvent.click(radio120!)

    expect(radio120!).toBeChecked()
    expect(screen.getByText(expectedArchiveDateTextFor(120))).toBeInTheDocument()
    expect(
      screen.queryByText(expectedArchiveDateTextFor(DEFAULT_GRACE_PERIOD_DAYS))
    ).not.toBeInTheDocument()
  })
})
