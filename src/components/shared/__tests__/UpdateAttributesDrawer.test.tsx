import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import { UpdateAttributesDrawer } from '../UpdateAttributesDrawer'
import type { DescriptorAttributes } from '@/api/api.generatedTypes'

vi.mock('@/components/layout/containers', () => {
  type Attribute = { id: string; name: string }

  const AttributeContainer: React.FC<{
    attribute: Attribute
    onRemove?: Function
    children?: React.ReactNode
  }> = ({ attribute }) => <div data-testid="attribute-container">{attribute.name}</div>

  const AttributeGroupContainer: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
    <div data-testid="attribute-group-container">{children}</div>
  )

  return { AttributeContainer, AttributeGroupContainer }
})

vi.mock('@/components/shared/AttributeAutocomplete', () => ({
  AttributeAutocomplete: () => <div data-testid="attribute-autocomplete" />,
}))

const useUpdateAttributes = vi.fn()
const useUpdateDescriptorAttributes = vi.fn()

vi.mock('@/api/eservice', () => ({
  EServiceMutations: {
    useUpdateDescriptorAttributes: () => ({
      mutate: useUpdateDescriptorAttributes,
      mutateAsync: useUpdateDescriptorAttributes,
      isLoading: false,
      isError: false,
      isSuccess: false,
      data: undefined,
      error: undefined,
    }),
  },
}))

vi.mock('@/api/eserviceTemplate', () => ({
  EServiceTemplateMutations: {
    useUpdateAttributes: () => ({
      mutate: useUpdateAttributes,
      mutateAsync: useUpdateAttributes,
      isLoading: false,
      isError: false,
      isSuccess: false,
      data: undefined,
      error: undefined,
    }),
  },
}))

vi.mock('@/router', () => ({
  useParams: () => ({
    eserviceId: 'e1',
    descriptorId: 'd1',
    eServiceTemplateId: 't1',
    eServiceTemplateVersionId: 'v1',
  }),
}))

vi.mock('@/utils/attribute.utils', () => ({
  remapDescriptorAttributesToDescriptorAttributesSeed: (attrs: DescriptorAttributes) => attrs,
}))

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}))

describe('UpdateAttributesDrawer', () => {
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    attributeKey: 'certified' as const,
    attributes: {
      certified: [
        [
          {
            id: 'attr-1',
            name: 'Attribute 1',
            description: 'desc 1',
            explicitAttributeVerification: false,
          },
        ],
        [
          {
            id: 'attr-2',
            name: 'Attribute 2',
            description: 'desc 2',
            explicitAttributeVerification: false,
          },
        ],
      ],
      declared: [],
      verified: [],
    },
    kind: 'ESERVICE' as const,
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders the drawer when isOpen is true', () => {
    render(<UpdateAttributesDrawer {...defaultProps} />)
    expect(screen.getByText('title')).toBeInTheDocument()
    expect(screen.getByText('subtitle')).toBeInTheDocument()
  })

  it('renders all attribute containers', () => {
    render(<UpdateAttributesDrawer {...defaultProps} />)

    const containers = screen.getAllByTestId('attribute-container')
    expect(containers).toHaveLength(2)

    expect(containers[0]).toHaveTextContent('Attribute 1')
    expect(containers[1]).toHaveTextContent('Attribute 2')
  })

  it('shows the add attribute button and opens autocomplete', () => {
    render(<UpdateAttributesDrawer {...defaultProps} />)
    const addButton = screen.getAllByText('group.addBtn')
    expect(addButton[0]).toBeInTheDocument()

    fireEvent.click(addButton[0])
    expect(screen.getByTestId('attribute-autocomplete')).toBeInTheDocument()
  })

  it('shows "or" divider when group has more than one attribute', () => {
    const props = {
      isOpen: true,
      onClose: vi.fn(),
      attributeKey: 'certified' as const,
      attributes: {
        certified: [
          [
            {
              id: 'attr-1',
              name: 'Attribute 1',
              description: 'desc 1',
              explicitAttributeVerification: false,
            },
            {
              id: 'attr-2',
              name: 'Attribute 2',
              description: 'desc 2',
              explicitAttributeVerification: false,
            },
          ],
        ],
        declared: [],
        verified: [],
      },
      kind: 'ESERVICE' as const,
    }
    render(<UpdateAttributesDrawer {...props} />)
    expect(screen.getByText('group.or')).toBeInTheDocument()
  })

  it('calls updateEserviceTemplateAttributes when kind is ESERVICE_TEMPLATE', () => {
    render(<UpdateAttributesDrawer {...defaultProps} kind="ESERVICE_TEMPLATE" />)
    fireEvent.click(screen.getByText('actions.saveEdits'))
    expect(useUpdateAttributes).toHaveBeenCalled()
  })

  it('calls updateEserviceAttributes when kind is ESERVICE', () => {
    render(<UpdateAttributesDrawer {...defaultProps} kind="ESERVICE" />)
    fireEvent.click(screen.getByText('actions.saveEdits'))
    expect(useUpdateDescriptorAttributes).toHaveBeenCalled()
  })
})
