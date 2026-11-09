import React from 'react'
import { useForm, FormProvider } from 'react-hook-form'

export const TestInputWrapper = ({ children }: { children: React.ReactNode }) => {
  const formMethods = useForm<{
    testText: string
    test: false
    testFile: File | null
    checkedItems: Array<string>
    testSelect: string
  }>({
    defaultValues: {
      testText: '',
      test: false,
      testFile: null,
      checkedItems: [],
      testSelect: '',
    },
  })

  return <FormProvider {...formMethods}>{children}</FormProvider>
}
