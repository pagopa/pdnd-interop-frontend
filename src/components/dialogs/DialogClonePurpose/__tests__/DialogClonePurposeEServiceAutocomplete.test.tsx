import React from 'react'
import { screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { FormProvider, useForm } from 'react-hook-form'
import type { CompactPurposeEService } from '@/api/api.generatedTypes'
import { renderWithApplicationContext } from '@/utils/testing.utils'
import { DialogClonePurposeEServiceAutocomplete } from '../DialogClonePurposeEServiceAutocomplete'

vi.mock('@tanstack/react-query', async (importOriginal) => {
  const actual = (await importOriginal()) as Record<string, unknown>
  return {
    ...actual,
    useQuery: vi.fn((options: { queryKey?: unknown[]; select?: (data: unknown) => unknown }) => {
      const key = Array.isArray(options?.queryKey) ? options.queryKey[0] : undefined
      const eservices = {
        results: [{ id: 'e-1', name: 'E-service 1', producer: { id: 'p-1', name: 'Org 1' } }],
        pagination: { offset: 0, limit: 50, totalCount: 1 },
      }
      const empty = { results: [], pagination: { offset: 0, limit: 50, totalCount: 0 } }
      const raw = key === 'EServiceGetCompactCatalogList' ? eservices : empty
      const data = typeof options?.select === 'function' ? options.select(raw) : raw
      return { data, isLoading: false, isFetching: false, isSuccess: true, isError: false }
    }),
  }
})

vi.mock('@pagopa/interop-fe-commons', async (importOriginal) => {
  const actual = (await importOriginal()) as Record<string, unknown>
  return {
    ...actual,
    useAutocompleteTextInput: (initial?: string) => [initial ?? '', vi.fn()],
  }
})

vi.mock('@/components/shared/react-hook-form-inputs', () => ({
  RHFAutocompleteSingle: ({ options }: { options: Array<{ label: string; value: string }> }) => (
    <ul data-testid="rhf-autocomplete">
      {options.map((opt, idx) => (
        <li key={idx} data-testid={`option-${idx}`}>
          {opt.label}
        </li>
      ))}
    </ul>
  ),
}))

const preselectedEservice: CompactPurposeEService = {
  id: 'pe-1',
  name: 'Preselected',
  producer: { id: 'p-0', name: 'Org 0' },
  descriptor: { id: 'd-0', state: 'PUBLISHED', version: '1', audience: [] },
  mode: 'DELIVER',
  personalData: false,
}

const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const methods = useForm({ defaultValues: { eserviceId: '' } })
  return <FormProvider {...methods}>{children}</FormProvider>
}

describe('DialogClonePurposeEServiceAutocomplete', () => {
  it('maps e-services from the compact catalog endpoint into autocomplete options', () => {
    renderWithApplicationContext(
      <Wrapper>
        <DialogClonePurposeEServiceAutocomplete
          preselectedEservice={preselectedEservice}
          onEServiceChange={vi.fn()}
        />
      </Wrapper>,
      { withReactQueryContext: true }
    )

    expect(screen.getByTestId('rhf-autocomplete')).toBeInTheDocument()
    expect(screen.getByTestId('option-0')).toBeInTheDocument()
  })
})
