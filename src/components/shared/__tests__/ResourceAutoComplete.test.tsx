import React from 'react'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import type * as ReactHookForm from 'react-hook-form'
import { useQuery } from '@tanstack/react-query'
import type { CatalogEService, CatalogEServiceTemplate } from '@/api/api.generatedTypes'
import { renderWithApplicationContext } from '@/utils/testing.utils'
import { ResourceAutoComplete } from '../ResourceAutoComplete'
import { createMockEServiceCatalog } from '../../../../__mocks__/data/eservice.mocks'
import { createMockCatalogEServiceTemplate } from '../../../../__mocks__/data/eserviceTemplate.mocks'
import { createMockPurposeTemplate } from '../../../../__mocks__/data/purposeTemplate.mocks'

vi.mock('@tanstack/react-query', async () => {
  const actual = await vi.importActual('@tanstack/react-query')
  return {
    ...(actual as Record<string, unknown>),
    useQuery: vi.fn(),
  }
})

const { mockedGetCatalogList, mockedGetTemplatesCatalog } = vi.hoisted(() => ({
  mockedGetCatalogList: vi.fn((_params?: unknown) => ({
    queryKey: ['eservice-catalog'],
    queryFn: vi.fn(),
  })),
  mockedGetTemplatesCatalog: vi.fn((_params?: unknown) => ({
    queryKey: ['eservice-template-catalog'],
    queryFn: vi.fn(),
  })),
}))

vi.mock('@/api/eservice', () => ({
  EServiceQueries: {
    getCatalogList: mockedGetCatalogList,
  },
}))

vi.mock('@/api/eserviceTemplate', () => ({
  EServiceTemplateQueries: {
    getProviderEServiceTemplatesCatalogList: mockedGetTemplatesCatalog,
  },
}))

// Stub RHFAutocompleteSingle so we can inspect rendered options and trigger selection by click.
vi.mock('@/components/shared/react-hook-form-inputs', async () => {
  const { useFormContext } = await vi.importActual<typeof ReactHookForm>('react-hook-form')
  return {
    RHFAutocompleteSingle: ({
      options,
      name,
      onInputChange,
    }: {
      options: Array<{ label: string; value: unknown }>
      name: string
      onInputChange?: (e: unknown, v: string) => void
    }) => {
      const { setValue } = useFormContext()
      return (
        <div data-testid="rhf-autocomplete">
          <input
            data-testid="autocomplete-input"
            onChange={(e) => onInputChange?.(e, e.target.value)}
          />
          <ul>
            {options.map((opt, idx) => (
              <li key={idx}>
                <button
                  type="button"
                  data-testid={`option-${idx}`}
                  onClick={() => setValue(name, opt.value)}
                >
                  {opt.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )
    },
  }
})

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, opts?: Record<string, string>) => {
      if (key === 'options.eservice')
        return `${opts?.name} – e-service erogato da ${opts?.publisher}`
      if (key === 'options.eserviceTemplate')
        return `${opts?.name} – template erogato da ${opts?.publisher}`
      if (key === 'autocompleteInput.label') return 'E-service o template e-service suggeriti'
      if (key === 'saveBtn') return 'Salva'
      return key
    },
  }),
}))

function setQueryData(eservices: CatalogEService[], templates: CatalogEServiceTemplate[]) {
  vi.mocked(useQuery)
    .mockReturnValueOnce({
      data: {
        results: eservices,
        pagination: { offset: 0, limit: 50, totalCount: eservices.length },
      },
    } as ReturnType<typeof useQuery>)
    .mockReturnValueOnce({
      data: {
        results: templates,
        pagination: { offset: 0, limit: 50, totalCount: templates.length },
      },
    } as ReturnType<typeof useQuery>)
}

describe('ResourceAutoComplete', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useQuery).mockReturnValue({ data: undefined } as ReturnType<typeof useQuery>)
  })

  it('renders option labels with discriminated suffix for both kinds', () => {
    const eservice = createMockEServiceCatalog({
      id: 'es-1',
      name: 'Eservice A',
      producer: { id: 'p-1', name: 'Org1' },
    })
    const template = createMockCatalogEServiceTemplate({
      id: 'tpl-1',
      name: 'Template B',
      creator: { id: 'c-1', name: 'Org2' },
      publishedVersion: { id: 'tplv-1', version: 1, state: 'PUBLISHED' },
    })
    setQueryData([eservice], [template])

    renderWithApplicationContext(
      <ResourceAutoComplete
        onAddResource={vi.fn()}
        alreadySelectedResourceIds={[]}
        purposeTemplate={createMockPurposeTemplate({ state: 'DRAFT' })}
      />,
      { withReactQueryContext: true }
    )

    expect(screen.getByText('Eservice A – e-service erogato da Org1')).toBeInTheDocument()
    expect(screen.getByText('Template B – template erogato da Org2')).toBeInTheDocument()
  })

  it('filters out resources already linked via composite kind+id key', () => {
    const eservice = createMockEServiceCatalog({
      id: 'shared-id',
      name: 'Eservice A',
      producer: { id: 'p-1', name: 'Org1' },
    })
    const template = createMockCatalogEServiceTemplate({
      id: 'shared-id',
      name: 'Template B',
      creator: { id: 'c-1', name: 'Org2' },
      publishedVersion: { id: 'tplv-1', version: 1, state: 'PUBLISHED' },
    })
    setQueryData([eservice], [template])

    renderWithApplicationContext(
      <ResourceAutoComplete
        onAddResource={vi.fn()}
        alreadySelectedResourceIds={[{ resourceKind: 'ESERVICE_TEMPLATE', id: 'shared-id' }]}
        purposeTemplate={createMockPurposeTemplate({ state: 'DRAFT' })}
      />,
      { withReactQueryContext: true }
    )

    expect(screen.getByText('Eservice A – e-service erogato da Org1')).toBeInTheDocument()
    expect(screen.queryByText('Template B – template erogato da Org2')).not.toBeInTheDocument()
  })

  it('passes personalData=TRUE to both catalog queries when handlesPersonalData is true', () => {
    setQueryData([], [])

    renderWithApplicationContext(
      <ResourceAutoComplete
        onAddResource={vi.fn()}
        alreadySelectedResourceIds={[]}
        purposeTemplate={createMockPurposeTemplate({ state: 'DRAFT', handlesPersonalData: true })}
      />,
      { withReactQueryContext: true }
    )

    expect(mockedGetCatalogList).toHaveBeenCalledWith(
      expect.objectContaining({ personalData: 'TRUE' })
    )
    expect(mockedGetTemplatesCatalog).toHaveBeenCalledWith(
      expect.objectContaining({ personalData: 'TRUE' })
    )
  })

  it('passes personalData=FALSE to both catalog queries when handlesPersonalData is false', () => {
    setQueryData([], [])

    renderWithApplicationContext(
      <ResourceAutoComplete
        onAddResource={vi.fn()}
        alreadySelectedResourceIds={[]}
        purposeTemplate={createMockPurposeTemplate({ state: 'DRAFT', handlesPersonalData: false })}
      />,
      { withReactQueryContext: true }
    )

    expect(mockedGetCatalogList).toHaveBeenCalledWith(
      expect.objectContaining({ personalData: 'FALSE' })
    )
    expect(mockedGetTemplatesCatalog).toHaveBeenCalledWith(
      expect.objectContaining({ personalData: 'FALSE' })
    )
  })

  it('dedupe: excludes e-service that is instance of an active template (mergeLinkableCandidates wiring)', () => {
    const eserviceInstance = createMockEServiceCatalog({
      id: 'es-instance',
      name: 'Eservice Instance',
      producer: { id: 'p-1', name: 'Org1' },
      activeDescriptor: {
        id: 'desc-1',
        state: 'PUBLISHED',
        version: '1',
        audience: [],
        templateVersionId: 'tplv-shared',
      },
    })
    const template = createMockCatalogEServiceTemplate({
      id: 'tpl-1',
      name: 'Template B',
      creator: { id: 'c-1', name: 'Org2' },
      publishedVersion: { id: 'tplv-shared', version: 1, state: 'PUBLISHED' },
    })
    setQueryData([eserviceInstance], [template])

    renderWithApplicationContext(
      <ResourceAutoComplete
        onAddResource={vi.fn()}
        alreadySelectedResourceIds={[]}
        purposeTemplate={createMockPurposeTemplate({ state: 'DRAFT' })}
      />,
      { withReactQueryContext: true }
    )

    expect(screen.queryByText(/Eservice Instance/)).not.toBeInTheDocument()
    expect(screen.getByText('Template B – template erogato da Org2')).toBeInTheDocument()
  })

  it('calls onAddResource with the discriminated payload when user selects an option and clicks Salva', async () => {
    const onAddResource = vi.fn()
    const template = createMockCatalogEServiceTemplate({
      id: 'tpl-1',
      name: 'Template B',
      creator: { id: 'c-1', name: 'Org2' },
      publishedVersion: { id: 'tplv-1', version: 1, state: 'PUBLISHED' },
    })
    setQueryData([], [template])

    renderWithApplicationContext(
      <ResourceAutoComplete
        onAddResource={onAddResource}
        alreadySelectedResourceIds={[]}
        purposeTemplate={createMockPurposeTemplate({ state: 'DRAFT' })}
      />,
      { withReactQueryContext: true }
    )

    await userEvent.click(screen.getByTestId('option-0'))
    await userEvent.click(screen.getByRole('button', { name: /salva/i }))

    expect(onAddResource).toHaveBeenCalledWith({
      resourceKind: 'ESERVICE_TEMPLATE',
      value: expect.objectContaining({ id: 'tpl-1', name: 'Template B' }),
    })
  })

  it('disables Salva button when no option is selected', () => {
    setQueryData([], [])

    renderWithApplicationContext(
      <ResourceAutoComplete
        onAddResource={vi.fn()}
        alreadySelectedResourceIds={[]}
        purposeTemplate={createMockPurposeTemplate({ state: 'DRAFT' })}
      />,
      { withReactQueryContext: true }
    )

    expect(screen.getByRole('button', { name: /salva/i })).toBeDisabled()
  })
})
