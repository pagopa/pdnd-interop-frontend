import React from 'react'
import { useForm, FormProvider } from 'react-hook-form'

export const TestInputWrapper = ({ children }: { children: React.ReactNode }) => {
  const formMethods = useForm<{ testText: string; test: false }>({
    defaultValues: {
      testText: '',
      test: false,
    },
  })

  return <FormProvider {...formMethods}>{children}</FormProvider>
}
