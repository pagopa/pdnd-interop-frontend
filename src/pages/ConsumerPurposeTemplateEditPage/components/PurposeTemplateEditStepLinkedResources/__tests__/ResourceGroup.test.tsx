import React from 'react'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { CatalogEService } from '@/api/api.generatedTypes'
import { renderWithApplicationContext } from '@/utils/testing.utils'
import { ResourceGroup } from '../ResourceGroup'
import type { LinkableCandidate } from '@/utils/purposeTemplate.utils'
import { createMockEServiceCatalog } from '../../../../../../__mocks__/data/eservice.mocks'
import { createMockCatalogEServiceTemplate } from '../../../../../../__mocks__/data/eserviceTemplate.mocks'
import { createMockPurposeTemplate } from '../../../../../../__mocks__/data/purposeTemplate.mocks'

const TEST_PURPOSE_TEMPLATE_ID = 'template-123'

const mockShowToast = vi.fn()
const mockLinkMutate = vi.fn()

vi.mock('@/api/purposeTemplate/purposeTemplate.mutations', () => ({
  PurposeTemplateMutations: {
    useLinkResourceToPurposeTemplate: () => ({ mutate: mockLinkMutate }),
    useUnlinkResourceFromPurposeTemplate: () => ({ mutate: vi.fn() }),
  },
}))

vi.mock('@/stores/toast-notification.store', () => ({
  useToastNotification: () => ({ showToast: mockShowToast }),
  useToastNotificationStore: Object.assign(
    vi.fn((selector) => {
      const state = {
        isShown: false,
        message: '',
        severity: 'info' as const,
        correlationId: undefined,
        showToast: vi.fn(),
        hideToast: vi.fn(),
      }
      return selector ? selector(state) : state
    }),
    {
      getState: () => ({
        showToast: vi.fn(),
        hideToast: vi.fn(),
      }),
    }
  ),
}))

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, opts?: Record<string, string>) => {
      if (key === 'options.eservice')
        return `${opts?.name} - e-service erogato da ${opts?.publisher}`
      if (key === 'options.eserviceTemplate')
        return `${opts?.name} - template erogato da ${opts?.publisher}`
      return key
    },
    i18n: { language: 'it' },
  }),
}))

// Stub the autocomplete so we control selection deterministically
vi.mock('@/components/shared/ResourceAutoComplete', () => ({
  ResourceAutoComplete: ({ onAddResource }: { onAddResource: (r: LinkableCandidate) => void }) => (
    <div data-testid="resource-autocomplete-stub">
      <button
        data-testid="autocomplete-add-template"
        onClick={() =>
          onAddResource({
            resourceKind: 'ESERVICE_TEMPLATE',
            value: {
              id: 'tpl-1',
              name: 'Template B',
              description: 'd',
              creator: { id: 'c-1', name: 'Org2' },
              publishedVersion: { id: 'tplv-1', version: 1, state: 'PUBLISHED' },
            },
          })
        }
      >
        add template
      </button>
      <button
        data-testid="autocomplete-add-eservice"
        onClick={() =>
          onAddResource({
            resourceKind: 'ESERVICE',
            value: {
              id: 'es-1',
              name: 'Eservice A',
              description: 'd',
              producer: { id: 'p-1', name: 'Org1' },
              isMine: false,
            } as CatalogEService,
          })
        }
      >
        add eservice
      </button>
    </div>
  ),
}))

const mockPurposeTemplate = createMockPurposeTemplate({
  id: TEST_PURPOSE_TEMPLATE_ID,
  state: 'DRAFT',
})

function makeEserviceCandidate(
  id: string,
  name: string,
  descriptorState:
    | 'PUBLISHED'
    | 'SUSPENDED'
    | 'ARCHIVED'
    | 'DEPRECATED'
    | 'DRAFT'
    | 'WAITING_FOR_APPROVAL' = 'PUBLISHED'
): LinkableCandidate {
  const eservice = createMockEServiceCatalog({
    id,
    name,
    activeDescriptor: { id: `desc-${id}`, state: descriptorState, version: '1', audience: [] },
  })
  return { resourceKind: 'ESERVICE', value: eservice }
}

function makeTemplateCandidate(
  id: string,
  name: string,
  versionState: 'PUBLISHED' | 'DEPRECATED' | 'SUSPENDED' | 'DRAFT' = 'PUBLISHED'
): LinkableCandidate {
  const template = createMockCatalogEServiceTemplate({
    id,
    name,
    publishedVersion: { id: `tplv-${id}`, version: 1, state: versionState },
  })
  return { resourceKind: 'ESERVICE_TEMPLATE', value: template }
}

describe('ResourceGroup', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders a mixed list of e-service and template containers', () => {
    const group = [
      makeEserviceCandidate('es-1', 'Eservice A'),
      makeTemplateCandidate('tpl-1', 'Template B'),
    ]

    renderWithApplicationContext(
      <ResourceGroup
        group={group}
        readOnly={false}
        onRemove={vi.fn()}
        purposeTemplate={mockPurposeTemplate}
        showWarning={false}
      />,
      { withReactQueryContext: true, withRouterContext: true }
    )

    expect(screen.getByText(/Eservice A/)).toBeInTheDocument()
    expect(screen.getByText(/Template B/)).toBeInTheDocument()
  })

  it('calls linkResource mutate with ESERVICE_TEMPLATE payload when template is added from autocomplete', async () => {
    renderWithApplicationContext(
      <ResourceGroup
        group={[]}
        readOnly={false}
        onRemove={vi.fn()}
        purposeTemplate={mockPurposeTemplate}
        showWarning={false}
      />,
      { withReactQueryContext: true, withRouterContext: true }
    )

    await userEvent.click(screen.getByTestId('autocomplete-add-template'))

    expect(mockLinkMutate).toHaveBeenCalledWith(
      expect.objectContaining({
        purposeTemplateId: TEST_PURPOSE_TEMPLATE_ID,
        resourceKind: 'ESERVICE_TEMPLATE',
        eserviceTemplateId: 'tpl-1',
      }),
      expect.any(Object)
    )
  })

  it('calls linkResource mutate with ESERVICE payload when an e-service is added from autocomplete', async () => {
    renderWithApplicationContext(
      <ResourceGroup
        group={[]}
        readOnly={false}
        onRemove={vi.fn()}
        purposeTemplate={mockPurposeTemplate}
        showWarning={false}
      />,
      { withReactQueryContext: true, withRouterContext: true }
    )

    await userEvent.click(screen.getByTestId('autocomplete-add-eservice'))

    expect(mockLinkMutate).toHaveBeenCalledWith(
      expect.objectContaining({
        purposeTemplateId: TEST_PURPOSE_TEMPLATE_ID,
        resourceKind: 'ESERVICE',
        eserviceId: 'es-1',
      }),
      expect.any(Object)
    )
  })

  it('hides autocomplete after a successful link', async () => {
    mockLinkMutate.mockImplementation((_payload, opts) => opts?.onSuccess?.())

    renderWithApplicationContext(
      <ResourceGroup
        group={[]}
        readOnly={false}
        onRemove={vi.fn()}
        purposeTemplate={mockPurposeTemplate}
        showWarning={false}
      />,
      { withReactQueryContext: true, withRouterContext: true }
    )

    expect(screen.getByTestId('resource-autocomplete-stub')).toBeInTheDocument()
    await userEvent.click(screen.getByTestId('autocomplete-add-template'))
    expect(screen.queryByTestId('resource-autocomplete-stub')).not.toBeInTheDocument()
  })

  it('calls onRemove with ESERVICE discriminated payload when removing an e-service item', async () => {
    const onRemove = vi.fn()
    const group = [makeEserviceCandidate('es-1', 'Eservice A')]

    renderWithApplicationContext(
      <ResourceGroup
        group={group}
        readOnly={false}
        onRemove={onRemove}
        purposeTemplate={mockPurposeTemplate}
        showWarning={false}
      />,
      { withReactQueryContext: true, withRouterContext: true }
    )

    const removeButton = screen.getAllByRole('button', { name: /elimina|remove|rimuovi/i })[0]
    await userEvent.click(removeButton)

    expect(onRemove).toHaveBeenCalledWith({ resourceKind: 'ESERVICE', id: 'es-1' })
  })

  it('calls onRemove with ESERVICE_TEMPLATE discriminated payload when removing a template item', async () => {
    const onRemove = vi.fn()
    const group = [makeTemplateCandidate('tpl-1', 'Template B')]

    renderWithApplicationContext(
      <ResourceGroup
        group={group}
        readOnly={false}
        onRemove={onRemove}
        purposeTemplate={mockPurposeTemplate}
        showWarning={false}
      />,
      { withReactQueryContext: true, withRouterContext: true }
    )

    const removeButton = screen.getAllByRole('button', { name: /elimina|remove|rimuovi/i })[0]
    await userEvent.click(removeButton)

    expect(onRemove).toHaveBeenCalledWith({ resourceKind: 'ESERVICE_TEMPLATE', id: 'tpl-1' })
  })

  it('renders item warning for e-service with invalid descriptor state', () => {
    const group = [makeEserviceCandidate('es-1', 'Eservice Suspended', 'SUSPENDED')]

    renderWithApplicationContext(
      <ResourceGroup
        group={group}
        readOnly={false}
        onRemove={vi.fn()}
        purposeTemplate={mockPurposeTemplate}
        showWarning={true}
      />,
      { withReactQueryContext: true, withRouterContext: true }
    )

    expect(screen.getByText(/Eservice Suspended/)).toBeInTheDocument()
    // Warning surface is presence-based; the precise label is i18n and can be tightened during green.
    expect(screen.queryByRole('alert')).toBeTruthy()
  })

  it('renders item warning for template with invalid published-version state', () => {
    const group = [makeTemplateCandidate('tpl-1', 'Template Deprecated', 'DEPRECATED')]

    renderWithApplicationContext(
      <ResourceGroup
        group={group}
        readOnly={false}
        onRemove={vi.fn()}
        purposeTemplate={mockPurposeTemplate}
        showWarning={true}
      />,
      { withReactQueryContext: true, withRouterContext: true }
    )

    expect(screen.getByText(/Template Deprecated/)).toBeInTheDocument()
    expect(screen.queryByRole('alert')).toBeTruthy()
  })

  it('does not render the autocomplete when readOnly', () => {
    renderWithApplicationContext(
      <ResourceGroup
        group={[]}
        readOnly={true}
        onRemove={vi.fn()}
        purposeTemplate={mockPurposeTemplate}
        showWarning={false}
      />,
      { withReactQueryContext: true, withRouterContext: true }
    )

    expect(screen.queryByTestId('resource-autocomplete-stub')).not.toBeInTheDocument()
  })
})
