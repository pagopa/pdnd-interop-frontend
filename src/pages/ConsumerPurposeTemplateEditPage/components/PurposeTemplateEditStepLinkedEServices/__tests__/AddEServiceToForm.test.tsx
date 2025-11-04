import React from 'react'
import { screen, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { Mock } from 'vitest'
import { FormProvider, useForm } from 'react-hook-form'
import { AddEServiceToForm } from '../AddEServiceToForm'
import type { PurposeTemplateWithCompactCreator, CatalogEService } from '@/api/api.generatedTypes'
import { renderWithApplicationContext } from '@/utils/testing.utils'

vi.mock('@/api/purposeTemplate/purposeTemplate.mutations', () => ({
  PurposeTemplateMutations: {
    useUnlinkEserviceFromPurposeTemplate: vi.fn(() => ({
      mutate: vi.fn(),
    })),
  },
}))

vi.mock('../EServiceGroup', () => ({
  EServiceGroup: ({
    group,
    onRemoveEServiceFromGroup,
    showWarning,
  }: {
    group: CatalogEService[]
    onRemoveEServiceFromGroup: (id: string) => void
    showWarning: boolean
  }) => (
    <div data-testid="eservice-group">
      {group.map((eservice) => (
        <div key={eservice.id} data-testid={`eservice-${eservice.id}`}>
          {eservice.name}
          <button onClick={() => onRemoveEServiceFromGroup(eservice.id)}>Remove</button>
        </div>
      ))}
      {showWarning && <div data-testid="warning">Warning</div>}
    </div>
  ),
}))

function TestWrapper({ children }: { children: React.ReactNode }) {
  const formMethods = useForm({
    defaultValues: {
      eservices: [],
    },
  })

  return <FormProvider {...formMethods}>{children}</FormProvider>
}

describe('AddEServiceToForm', () => {
  const mockPurposeTemplate: PurposeTemplateWithCompactCreator = {
    id: 'template-123',
    purposeTitle: 'Test Purpose',
    purposeDescription: 'desc',
    purposeFreeOfChargeReason: '',
    purposeIsFreeOfCharge: false,
    purposeDailyCalls: 100,
    targetDescription: 'desc',
    handlesPersonalData: true,
    targetTenantKind: 'PA',
    creator: {
      id: 'org-1',
      name: 'Test Org',
      kind: 'PA',
    },
    state: 'DRAFT',
    createdAt: '',
  }

  const mockLinkedEServices = [
    {
      eservice: {
        id: 'eservice-1',
        name: 'E-Service 1',
        description: 'Description 1',
        producer: { id: 'producer-1', name: 'Producer 1', kind: 'PA' as const },
      },
      descriptor: {
        id: 'desc-1',
        state: 'PUBLISHED' as const,
        version: '1',
        audience: [],
      },
    },
  ]

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders correctly with empty linked eservices', () => {
    renderWithApplicationContext(
      <TestWrapper>
        <AddEServiceToForm
          readOnly={false}
          purposeTemplate={mockPurposeTemplate}
          linkedEServices={[]}
          showWarning={false}
        />
      </TestWrapper>,
      {
        withReactQueryContext: true,
      }
    )

    expect(screen.getByTestId('eservice-group')).toBeInTheDocument()
  })

  it('renders linked eservices', () => {
    renderWithApplicationContext(
      <TestWrapper>
        <AddEServiceToForm
          readOnly={false}
          purposeTemplate={mockPurposeTemplate}
          linkedEServices={mockLinkedEServices}
          showWarning={false}
        />
      </TestWrapper>,
      {
        withReactQueryContext: true,
      }
    )

    expect(screen.getByTestId('eservice-eservice-1')).toBeInTheDocument()
    expect(screen.getByText('E-Service 1')).toBeInTheDocument()
  })

  it('shows warning when showWarning is true', () => {
    renderWithApplicationContext(
      <TestWrapper>
        <AddEServiceToForm
          readOnly={false}
          purposeTemplate={mockPurposeTemplate}
          linkedEServices={mockLinkedEServices}
          showWarning={true}
        />
      </TestWrapper>,
      {
        withReactQueryContext: true,
      }
    )

    expect(screen.getByTestId('warning')).toBeInTheDocument()
  })

  it('handles remove eservice from group', async () => {
    const { PurposeTemplateMutations } = await import(
      '@/api/purposeTemplate/purposeTemplate.mutations'
    )
    const mockMutate = vi.fn()
    ;(PurposeTemplateMutations.useUnlinkEserviceFromPurposeTemplate as Mock).mockReturnValue({
      mutate: mockMutate,
    })

    renderWithApplicationContext(
      <TestWrapper>
        <AddEServiceToForm
          readOnly={false}
          purposeTemplate={mockPurposeTemplate}
          linkedEServices={mockLinkedEServices}
          showWarning={false}
        />
      </TestWrapper>,
      {
        withReactQueryContext: true,
      }
    )

    const removeButton = screen.getByRole('button', { name: 'Remove' })
    removeButton.click()

    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalledWith({
        purposeTemplateId: 'template-123',
        eserviceId: 'eservice-1',
      })
    })
  })

  it('merges form eservices with linked eservices', () => {
    const mockFormEService: CatalogEService = {
      id: 'eservice-2',
      name: 'E-Service 2',
      description: 'Description 2',
      producer: { id: 'producer-2', name: 'Producer 2', kind: 'PA' as const },
      activeDescriptor: {
        id: 'desc-2',
        state: 'PUBLISHED' as const,
        version: '1',
        audience: [],
      },
      isMine: false,
    }

    function TestWrapperWithEService({ children }: { children: React.ReactNode }) {
      const formMethods = useForm({
        defaultValues: {
          eservices: [mockFormEService],
        },
      })

      return <FormProvider {...formMethods}>{children}</FormProvider>
    }

    renderWithApplicationContext(
      <TestWrapperWithEService>
        <AddEServiceToForm
          readOnly={false}
          purposeTemplate={mockPurposeTemplate}
          linkedEServices={mockLinkedEServices}
          showWarning={false}
        />
      </TestWrapperWithEService>,
      {
        withReactQueryContext: true,
      }
    )

    expect(screen.getByTestId('eservice-eservice-1')).toBeInTheDocument()
    expect(screen.getByTestId('eservice-eservice-2')).toBeInTheDocument()
  })
})
