import React from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { RiskAnalysisFormComponents } from '../RiskAnalysisFormComponents'
import { render } from '@testing-library/react'
import type { Questions } from '@/pages/ConsumerPurposeEditPage/types/risk-analysis-form.types'

const commonQuestionValues = {
  label: { it: 'test', en: 'test' },
  infoLabel: { it: 'test', en: 'test' },
  required: true,
  defaultValue: [],
  dependencies: [],
}

const questions: Questions = {
  '1': {
    dataType: 'SINGLE',
    visualType: 'text',
    id: '1',
    ...commonQuestionValues,
  },
  '2': {
    dataType: 'SINGLE',
    visualType: 'select-one',
    id: '2',
    ...commonQuestionValues,
  },
  '3': {
    dataType: 'SINGLE',
    visualType: 'radio',
    id: '3',
    ...commonQuestionValues,
  },
  '4': {
    dataType: 'SINGLE',
    visualType: 'switch',
    id: '4',
    ...commonQuestionValues,
  },
  '5': {
    dataType: 'MULTI',
    visualType: 'checkbox',
    id: '5',
    ...commonQuestionValues,
  },
}

describe('RiskAnalysisFormComponents', () => {
  it('should match the snapshot', () => {
    const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
      const formMethods = useForm()

      return <FormProvider {...formMethods}>{children}</FormProvider>
    }

    const { baseElement } = render(<RiskAnalysisFormComponents questions={questions} />, {
      wrapper: Wrapper,
    })
    expect(baseElement).toMatchSnapshot()
  })
})
