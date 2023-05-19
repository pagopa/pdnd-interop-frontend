import React from 'react'
import { render } from '@testing-library/react'
import { PurposeCreateEServiceAutocomplete } from '../PurposeCreateEServiceAutocomplete'
import { FormProvider, useForm } from 'react-hook-form'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientMock } from '@/utils/testing.utils'
import { vi } from 'vitest'
import { EServiceQueries } from '@/api/eservice'
import { createMockEServiceCatalog } from '__mocks__/data/eservice.mocks'

const renderPurposeCreateEServiceAutocomplete = () => {
  return render(<PurposeCreateEServiceAutocomplete />, {
    wrapper: function Wrapper({ children }) {
      return (
        <QueryClientProvider client={queryClientMock}>
          <FormProvider {...useForm()}>{children}</FormProvider>
        </QueryClientProvider>
      )
    },
  })
}

describe('PurposeCreateEServiceAutocomplete', () => {
  it('should match snapshot', () => {
    const { baseElement } = renderPurposeCreateEServiceAutocomplete()
    expect(baseElement).toMatchSnapshot()
  })

  it('should set the first fetched e-service as default value', () => {
    vi.spyOn(EServiceQueries, 'useGetCatalogList').mockReturnValue({
      data: {
        results: [
          createMockEServiceCatalog({
            name: 'e-service name',
            producer: { name: 'producer name' },
          }),
        ],
      },
    } as unknown as ReturnType<typeof EServiceQueries.useGetCatalogList>)
    const screen = renderPurposeCreateEServiceAutocomplete()
    const input = screen.getByRole('combobox')

    expect(input).toHaveValue('e-service name edit.eserviceProvider producer name')
  })
})
