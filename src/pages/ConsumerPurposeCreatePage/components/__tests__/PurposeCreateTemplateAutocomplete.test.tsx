import React from 'react'
import { render } from '@testing-library/react'
import { PurposeCreateTemplateAutocomplete } from '../PurposeCreateTemplateAutocomplete'
import { FormProvider, useForm } from 'react-hook-form'
import { QueryClientProvider } from '@tanstack/react-query'
import { mockUseJwt, queryClientMock } from '@/utils/testing.utils'
import { vi } from 'vitest'
import { PurposeQueries } from '@/api/purpose'
import type { Purpose } from '@/api/api.generatedTypes'
import { createMockPurpose } from '__mocks__/data/purpose.mocks'

mockUseJwt()

const renderPurposeCreateTemplateAutocomplete = ({
  useTemplate = true,
  templateId = 'templateId',
}: {
  useTemplate?: boolean
  templateId?: undefined | string
}) => {
  return render(<PurposeCreateTemplateAutocomplete />, {
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

const mockUseGetConsumersList = (purposes: Purpose[] | undefined, isInitialLoading = false) => {
  vi.spyOn(PurposeQueries, 'useGetConsumersList').mockReturnValue({
    data: { results: purposes },
    isInitialLoading,
  } as unknown as ReturnType<typeof PurposeQueries.useGetConsumersList>)
}

describe('PurposeCreateTemplateAutocomplete', () => {
  it('should not render if useTemplate is false', () => {
    mockUseGetConsumersList(undefined)
    const { container } = renderPurposeCreateTemplateAutocomplete({ useTemplate: false })
    expect(container).toBeEmptyDOMElement()
  })

  it('should render an alert if there are no purposes', () => {
    mockUseGetConsumersList([])
    const { getByText } = renderPurposeCreateTemplateAutocomplete({ useTemplate: true })
    expect(getByText('create.purposeField.noDataLabel')).toBeInTheDocument()
  })

  it('should render spinner on initial loading', () => {
    mockUseGetConsumersList(undefined, true)
    const { getByRole } = renderPurposeCreateTemplateAutocomplete({ useTemplate: true })
    expect(getByRole('progressbar')).toBeInTheDocument()
  })

  it('should match snapshot', () => {
    mockUseGetConsumersList([createMockPurpose()])
    const { baseElement } = renderPurposeCreateTemplateAutocomplete({ useTemplate: true })
    expect(baseElement).toMatchSnapshot()
  })

  // it('should match snapshot', () => {
  //   mockUseGetConsumersList(createMockPurpose())
  //   const { container } = renderPurposeCreateTemplateAutocomplete({ useTemplate: true })
  //   expect(container).toMatchSnapshot()
  // })
})
