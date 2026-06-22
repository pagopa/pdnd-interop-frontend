import React from 'react'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ReactHookFormWrapper, renderWithApplicationContext } from '@/utils/testing.utils'
import type { LinkableCandidate } from '@/utils/purposeTemplate.utils'
import { AddResourceToForm } from '../AddResourceToForm'
import { createMockEServiceCatalog } from '../../../../../../__mocks__/data/eservice.mocks'
import { createMockCatalogEServiceTemplate } from '../../../../../../__mocks__/data/eserviceTemplate.mocks'
import { createMockPurposeTemplate } from '../../../../../../__mocks__/data/purposeTemplate.mocks'

const TEST_PURPOSE_TEMPLATE_ID = 'template-123'

const mockUnlinkMutate = vi.fn()

vi.mock('@/api/purposeTemplate/purposeTemplate.mutations', () => ({
  PurposeTemplateMutations: {
    useUnlinkResourceFromPurposeTemplate: () => ({ mutate: mockUnlinkMutate }),
  },
}))

// Stub ResourceGroup to expose its props for assertions.
vi.mock('../ResourceGroup', () => ({
  ResourceGroup: ({
    group,
    showWarning,
    onRemove,
  }: {
    group: LinkableCandidate[]
    showWarning: boolean
    onRemove: (r: { resourceKind: 'ESERVICE' | 'ESERVICE_TEMPLATE'; id: string }) => void
  }) => (
    <div data-testid="resource-group-stub">
      {showWarning && <div data-testid="warning" />}
      <ul>
        {group.map((c) => (
          <li
            key={`${c.resourceKind}:${c.value.id}`}
            data-testid={`row-${c.resourceKind}-${c.value.id}`}
          >
            {c.value.name}
            <button
              type="button"
              onClick={() => onRemove({ resourceKind: c.resourceKind, id: c.value.id })}
            >
              remove
            </button>
          </li>
        ))}
      </ul>
    </div>
  ),
}))

const mockPurposeTemplate = createMockPurposeTemplate({
  id: TEST_PURPOSE_TEMPLATE_ID,
  state: 'DRAFT',
})

describe('AddResourceToForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('merges form resources with linkedResources prop and forwards to ResourceGroup', () => {
    const eservice = createMockEServiceCatalog({ id: 'es-1', name: 'Eservice A' })
    const template = createMockCatalogEServiceTemplate({ id: 'tpl-1', name: 'Template B' })
    const linkedResources: LinkableCandidate[] = [
      { resourceKind: 'ESERVICE', value: eservice },
      { resourceKind: 'ESERVICE_TEMPLATE', value: template },
    ]

    renderWithApplicationContext(
      <ReactHookFormWrapper defaultValues={{ resources: [] }}>
        <AddResourceToForm
          readOnly={false}
          purposeTemplate={mockPurposeTemplate}
          linkedResources={linkedResources}
          showWarning={false}
        />
      </ReactHookFormWrapper>,
      { withReactQueryContext: true }
    )

    expect(screen.getByTestId('row-ESERVICE-es-1')).toBeInTheDocument()
    expect(screen.getByTestId('row-ESERVICE_TEMPLATE-tpl-1')).toBeInTheDocument()
  })

  it('passes showWarning flag through to ResourceGroup', () => {
    renderWithApplicationContext(
      <ReactHookFormWrapper defaultValues={{ resources: [] }}>
        <AddResourceToForm
          readOnly={false}
          purposeTemplate={mockPurposeTemplate}
          linkedResources={[]}
          showWarning={true}
        />
      </ReactHookFormWrapper>,
      { withReactQueryContext: true }
    )

    expect(screen.getByTestId('warning')).toBeInTheDocument()
  })

  it('on ResourceGroup.onRemove, calls unlinkResource mutate with discriminated payload (ESERVICE)', async () => {
    const eservice = createMockEServiceCatalog({ id: 'es-1', name: 'Eservice A' })
    renderWithApplicationContext(
      <ReactHookFormWrapper defaultValues={{ resources: [] }}>
        <AddResourceToForm
          readOnly={false}
          purposeTemplate={mockPurposeTemplate}
          linkedResources={[{ resourceKind: 'ESERVICE', value: eservice }]}
          showWarning={false}
        />
      </ReactHookFormWrapper>,
      { withReactQueryContext: true }
    )

    await userEvent.click(screen.getByRole('button', { name: /remove/i }))

    expect(mockUnlinkMutate).toHaveBeenCalledWith({
      purposeTemplateId: TEST_PURPOSE_TEMPLATE_ID,
      resourceKind: 'ESERVICE',
      eserviceId: 'es-1',
    })
  })

  it('on ResourceGroup.onRemove, calls unlinkResource mutate with discriminated payload (ESERVICE_TEMPLATE)', async () => {
    const template = createMockCatalogEServiceTemplate({ id: 'tpl-1', name: 'Template B' })
    renderWithApplicationContext(
      <ReactHookFormWrapper defaultValues={{ resources: [] }}>
        <AddResourceToForm
          readOnly={false}
          purposeTemplate={mockPurposeTemplate}
          linkedResources={[{ resourceKind: 'ESERVICE_TEMPLATE', value: template }]}
          showWarning={false}
        />
      </ReactHookFormWrapper>,
      { withReactQueryContext: true }
    )

    await userEvent.click(screen.getByRole('button', { name: /remove/i }))

    expect(mockUnlinkMutate).toHaveBeenCalledWith({
      purposeTemplateId: TEST_PURPOSE_TEMPLATE_ID,
      resourceKind: 'ESERVICE_TEMPLATE',
      eserviceTemplateId: 'tpl-1',
    })
  })
})
