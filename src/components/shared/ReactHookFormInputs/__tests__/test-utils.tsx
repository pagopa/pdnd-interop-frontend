import React from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import userEvent from '@testing-library/user-event'
import { RenderResult } from '@testing-library/react'

export const TestInputWrapper = ({ children }: { children: React.ReactNode }) => {
  const formMethods = useForm<{
    testText: string
    test: false
    testFile: File | null
    checkedItems: Array<string>
  }>({
    defaultValues: {
      testText: '',
      test: false,
      testFile: null,
      checkedItems: [],
    },
  })

  return <FormProvider {...formMethods}>{children}</FormProvider>
}

export async function selectAndGetDateCell(datePicker: RenderResult, day: number) {
  const secondCell = datePicker.getByRole('gridcell', {
    name: day.toString(),
  })
  await userEvent.click(secondCell)
  return datePicker.getByRole('gridcell', {
    selected: true,
  })
}
