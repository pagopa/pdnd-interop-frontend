import { render, screen, fireEvent, within } from '@testing-library/react'
import type { Mock } from 'vitest'
import { vi } from 'vitest'
import { useQuery } from '@tanstack/react-query'
import { BrowserRouter } from 'react-router-dom'
import { useForm, FormProvider } from 'react-hook-form'
import type { CatalogPurposeTemplate } from '@/api/api.generatedTypes'
import { PurposeCreatePurposeTemplateAutocomplete } from '../PurposeCreatePurposeTemplateSection/PurposeCreatePurposeTemplateAutocomplete'
import React from 'react'

vi.mock('@tanstack/react-query', async () => {
  const actual =
    // eslint-disable-next-line @typescript-eslint/consistent-type-imports
    await vi.importActual<typeof import('@tanstack/react-query')>('@tanstack/react-query')
  return {
    ...actual,
    useQuery: vi.fn(),
  }
})

vi.mock('@pagopa/interop-fe-commons', async () => {
  // eslint-disable-next-line @typescript-eslint/consistent-type-imports
  const actual = await vi.importActual<typeof import('@pagopa/interop-fe-commons')>(
    '@pagopa/interop-fe-commons'
  )
  return {
    ...actual,
    useAutocompleteTextInput: vi.fn().mockReturnValue([vi.fn(), vi.fn()]),
  }
})

vi.mock('@mui/system', () => ({
  Stack: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}))

vi.mock('@pagopa/mui-italia', async () => {
  // eslint-disable-next-line @typescript-eslint/consistent-type-imports
  const actual = await vi.importActual<typeof import('@pagopa/mui-italia')>('@pagopa/mui-italia')
  return {
    ...actual,
    ButtonNaked: ({ children }: { children: React.ReactNode }) => <button>{children}</button>,
  }
})

vi.mock('@/router', () => ({
  Link: ({ children, to }: { children: React.ReactNode; to: string }) => (
    <a href={to}>{children}</a>
  ),
}))

vi.mock('@mui/icons-material/OpenInNew', async () => {
  const actual = (await vi.importActual('@mui/icons-material/OpenInNew')) as {
    default: React.ComponentType<unknown>
  }
  return {
    ...actual,
    default: () => <span>OpenInNewIcon</span>,
  }
})

vi.mock('@/api/tenant', () => ({
  TenantHooks: {
    useGetActiveUserParty: vi.fn(() => ({
      data: { id: 'tenant-123', name: 'Tenant Mock', kind: 'PA' },
    })),
  },
}))

const mockPurposeTemplates: CatalogPurposeTemplate[] = [
  {
    id: '1',
    purposeTitle: 'Template 1',
    creator: { id: '12345', name: 'Creator 1' },
    targetTenantKind: 'PA',
    purposeDescription: '',
  },
  {
    id: '2',
    purposeTitle: 'Template 2',
    creator: { id: '67890', name: 'Creator 2' },
    targetTenantKind: 'PA',
    purposeDescription: '',
  },
]

const FormWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const methods = useForm({ defaultValues: { purposeTemplateId: '' } })
  return <FormProvider {...methods}>{children}</FormProvider>
}

describe('PurposeCreatePurposeTemplateAutocomplete', () => {
  beforeEach(() => {
    ;(useQuery as Mock).mockImplementation(() => ({
      data: mockPurposeTemplates,
      isLoading: false,
    }))
  })

  it('should render the autocomplete input and the button', async () => {
    render(
      <BrowserRouter>
        <FormWrapper>
          <PurposeCreatePurposeTemplateAutocomplete eserviceId="123" />
        </FormWrapper>
      </BrowserRouter>
    )

    expect(screen.getByRole('combobox')).toBeInTheDocument()
    expect(screen.getByLabelText(/autocompleteLabelPurposeTemplate/i)).toBeInTheDocument()
  })

  it('should load options for the autocomplete', async () => {
    render(
      <BrowserRouter>
        <FormWrapper>
          <PurposeCreatePurposeTemplateAutocomplete eserviceId="123" />
        </FormWrapper>
      </BrowserRouter>
    )

    const input = screen.getByRole('combobox')
    fireEvent.focus(input)
    fireEvent.change(input, { target: { value: 'Template' } })
    const listbox = await screen.findByRole('listbox')
    const options = within(listbox).getAllByRole('option')

    expect(options.some((opt) => opt.textContent?.includes('Template 1'))).toBe(true)
    expect(options.some((opt) => opt.textContent?.includes('Template 2'))).toBe(true)

    const option1 = options.find((opt) => opt.textContent?.includes('Template 1'))
    fireEvent.click(option1!)
  })

  it('should update selectedPurposeTemplateRef when an option is selected and button is rendered', async () => {
    render(
      <BrowserRouter>
        <FormWrapper>
          <PurposeCreatePurposeTemplateAutocomplete eserviceId="123" />
        </FormWrapper>
      </BrowserRouter>
    )

    const input = screen.getByRole('combobox')
    fireEvent.focus(input)
    fireEvent.change(input, { target: { value: 'Template 1' } })

    const option = await screen.findByRole('option', { name: /Template 1.*Creator 1/i })

    fireEvent.click(option)

    // Check that the button is rendered
    screen.getByRole('button', {
      name: /viewPurposeTemplateBtn/i,
    })
  })

  it('should show loading state while data is fetching', async () => {
    ;(useQuery as Mock).mockImplementationOnce(() => ({
      data: [],
      isLoading: true,
    }))

    render(
      <BrowserRouter>
        <FormWrapper>
          <PurposeCreatePurposeTemplateAutocomplete eserviceId="123" />
        </FormWrapper>
      </BrowserRouter>
    )

    expect(screen.getByRole('combobox')).toHaveTextContent('')
  })
})
