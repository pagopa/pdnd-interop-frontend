import React from 'react'
import { render } from '@testing-library/react'
import { PurposeCreateRiskAnalysisPreview } from '../PurposeCreateRiskAnalysisPreview'
import { FormProvider, useForm } from 'react-hook-form'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientMock } from '@/utils/testing.utils'
import { vi } from 'vitest'
import { PurposeQueries } from '@/api/purpose'
import type { Purpose } from '@/api/api.generatedTypes'
import { createMockPurpose } from '__mocks__/data/purpose.mocks'

const renderPurposeCreateRiskAnalysisPreview = ({
  useTemplate = true,
  templateId = 'templateId',
}: {
  useTemplate?: boolean
  templateId?: undefined | string
}) => {
  return render(<PurposeCreateRiskAnalysisPreview />, {
    wrapper: function Wrapper({ children }) {
      return (
        <QueryClientProvider client={queryClientMock}>
          <FormProvider
            {...useForm({
              defaultValues: {
                useTemplate,
                templateId,
              },
            })}
          >
            {children}
          </FormProvider>
        </QueryClientProvider>
      )
    },
  })
}

const mockUseGetSinglePurpose = (data: Purpose | undefined) => {
  vi.spyOn(PurposeQueries, 'useGetSingle').mockReturnValue({
    data,
  } as unknown as ReturnType<typeof PurposeQueries.useGetSingle>)
}

describe('PurposeCreateRiskAnalysisPreview', () => {
  it('should not render if no purpose is returned', () => {
    mockUseGetSinglePurpose(undefined)
    const { container } = renderPurposeCreateRiskAnalysisPreview({ useTemplate: true })
    expect(container).toBeEmptyDOMElement()
  })

  it('should not render if useTemplate is false', () => {
    mockUseGetSinglePurpose(createMockPurpose())
    const { container } = renderPurposeCreateRiskAnalysisPreview({ useTemplate: false })
    expect(container).toBeEmptyDOMElement()
  })

  it('should match snapshot', () => {
    mockUseGetSinglePurpose(createMockPurpose())
    const { container } = renderPurposeCreateRiskAnalysisPreview({ useTemplate: true })
    expect(container).toMatchSnapshot()
  })
})
