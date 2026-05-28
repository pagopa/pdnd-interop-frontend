import { fireEvent, screen } from '@testing-library/react'
import { AttributeContainer } from '../AttributeContainer'
import { vi, describe, it, expect } from 'vitest'
import { renderWithApplicationContext } from '@/utils/testing.utils'
import {
  createCertifiedDiscreteTenantAttribute,
  createMockAttribute,
  createMockDescriptorAttribute,
} from '../../../../../__mocks__/data/attribute.mocks'
import userEvent from '@testing-library/user-event'
import type { Attribute } from '@/api/api.generatedTypes'
import { AttributeQueries } from '@/api/attribute'

const baseAttribute = createMockAttribute({ id: 'attr-1', name: 'Test Attribute' })

vi.mock('@/api/attribute', () => ({
  AttributeQueries: {
    getSingle: vi.fn((id: string) => ({
      queryKey: ['attribute', id],
      queryFn: vi.fn().mockReturnValue(baseAttribute),
    })),
  },
}))

describe('AttributeContainer', () => {
  it('should render the attribute name', () => {
    renderWithApplicationContext(<AttributeContainer attribute={baseAttribute} />, {
      withReactQueryContext: true,
    })
    expect(screen.getByText('Test Attribute')).toBeInTheDocument()
  })

  it('should show the remove button when onRemove is provided', () => {
    renderWithApplicationContext(
      <AttributeContainer attribute={baseAttribute} onRemove={vi.fn()} />,
      { withReactQueryContext: true }
    )
    expect(screen.getByRole('button', { name: 'removeAttributeAriaLabel' })).toBeInTheDocument()
  })

  it('should not show the remove button when onRemove is not provided', () => {
    renderWithApplicationContext(<AttributeContainer attribute={baseAttribute} />, {
      withReactQueryContext: true,
    })
    expect(
      screen.queryByRole('button', { name: 'removeAttributeAriaLabel' })
    ).not.toBeInTheDocument()
  })

  it('should call onRemove with id and name when remove button is clicked', () => {
    const onRemove = vi.fn()
    renderWithApplicationContext(
      <AttributeContainer attribute={baseAttribute} onRemove={onRemove} />,
      { withReactQueryContext: true }
    )
    fireEvent.click(screen.getByRole('button', { name: 'removeAttributeAriaLabel' }))
    expect(onRemove).toHaveBeenCalled()
    expect(onRemove.mock.calls[0][0]).toBe('attr-1')
    expect(onRemove.mock.calls[0][1]).toBe('Test Attribute')
  })

  it('should show "customizeThreshold" when onCustomizeThreshold is provided and no dailyCallsPerConsumer', () => {
    renderWithApplicationContext(
      <AttributeContainer attribute={baseAttribute} onCustomizeThreshold={vi.fn()} />,
      { withReactQueryContext: true }
    )
    expect(screen.getByText('actions.customizeThreshold')).toBeInTheDocument()
  })

  it('should show "changeThreshold" inside the action menu when onCustomizeThreshold is provided and dailyCallsPerConsumer exists', async () => {
    const user = userEvent.setup()
    renderWithApplicationContext(
      <AttributeContainer
        attribute={{ ...baseAttribute, dailyCallsPerConsumer: 100 }}
        onCustomizeThreshold={vi.fn()}
      />,
      { withReactQueryContext: true }
    )

    const menuActionsIconButton = screen.getByLabelText('iconButtonAriaLabel')
    await user.click(menuActionsIconButton)

    expect(screen.getByRole('menuitem', { name: 'actions.changeThreshold' })).toBeInTheDocument()
  })

  it('should call onCustomizeThreshold on click with stopPropagation', () => {
    const onCustomizeThreshold = vi.fn()
    renderWithApplicationContext(
      <AttributeContainer attribute={baseAttribute} onCustomizeThreshold={onCustomizeThreshold} />,
      { withReactQueryContext: true }
    )
    const btn = screen.getByText('actions.customizeThreshold')
    const clickEvent = new MouseEvent('click', { bubbles: true })
    const stopPropagationSpy = vi.spyOn(clickEvent, 'stopPropagation')
    fireEvent(btn, clickEvent)
    expect(onCustomizeThreshold).toHaveBeenCalled()
    expect(stopPropagationSpy).toHaveBeenCalled()
  })

  it('should show the check icon when checked is true', () => {
    renderWithApplicationContext(<AttributeContainer attribute={baseAttribute} checked />, {
      withReactQueryContext: true,
    })
    expect(screen.getByTestId('CheckCircleIcon')).toBeInTheDocument()
  })

  it('should show the chip when chipLabel is provided', () => {
    renderWithApplicationContext(
      <AttributeContainer attribute={baseAttribute} chipLabel="My Chip" />,
      { withReactQueryContext: true }
    )
    expect(screen.getByText('My Chip')).toBeInTheDocument()
  })

  it('should show "modifyCertifiedDiscreteAttribute" inside the action menu when onOpenConfigDrawer is provided and attribute kind is CERTIFIED_DISCRETE', async () => {
    const user = userEvent.setup()
    renderWithApplicationContext(
      <AttributeContainer
        attribute={{ ...baseAttribute, kind: 'CERTIFIED_DISCRETE' }}
        onOpenConfigDrawer={vi.fn()}
      />,
      { withReactQueryContext: true }
    )

    const menuActionsIconButton = screen.getByLabelText('iconButtonAriaLabel')
    await user.click(menuActionsIconButton)

    expect(
      screen.getByRole('menuitem', { name: 'actions.modifyCertifiedDiscreteAttribute' })
    ).toBeInTheDocument()
  })

  it('should show "inspectAttributeDetails" inside the action menu', async () => {
    const user = userEvent.setup()
    renderWithApplicationContext(<AttributeContainer attribute={{ ...baseAttribute }} />, {
      withReactQueryContext: true,
    })

    const menuActionsIconButton = screen.getByLabelText('iconButtonAriaLabel')
    await user.click(menuActionsIconButton)

    expect(
      screen.getByRole('menuitem', { name: 'actions.inspectAttributeDetails' })
    ).toBeInTheDocument()
  })

  it('should show discreteConfig with the right string (GT) if setted in DescriptorAttribute', async () => {
    const descriptorAttributeMock = createMockDescriptorAttribute({
      kind: 'CERTIFIED_DISCRETE',
      discreteConfig: { comparator: 'GT', threshold: 100 },
    })
    renderWithApplicationContext(
      <AttributeContainer attribute={{ ...descriptorAttributeMock }} />,
      {
        withReactQueryContext: true,
      }
    )

    const discreteConfig = screen.getByText('GT 100')

    expect(discreteConfig).toBeInTheDocument()
  })

  it('should show discreteConfig with the right string (LT) if setted in DescriptorAttribute', async () => {
    const descriptorAttributeMock = createMockDescriptorAttribute({
      kind: 'CERTIFIED_DISCRETE',
      discreteConfig: { comparator: 'LT', threshold: 100 },
    })
    renderWithApplicationContext(
      <AttributeContainer attribute={{ ...descriptorAttributeMock }} />,
      {
        withReactQueryContext: true,
      }
    )

    const discreteConfig = screen.getByText('LT 100')

    expect(discreteConfig).toBeInTheDocument()
  })

  it('should show discreteConfig with the right string (GTE) if setted in DescriptorAttribute', async () => {
    const descriptorAttributeMock = createMockDescriptorAttribute({
      kind: 'CERTIFIED_DISCRETE',
      discreteConfig: { comparator: 'GTE', threshold: 100 },
    })
    renderWithApplicationContext(
      <AttributeContainer attribute={{ ...descriptorAttributeMock }} />,
      {
        withReactQueryContext: true,
      }
    )

    const discreteConfig = screen.getByText('GTE 100')

    expect(discreteConfig).toBeInTheDocument()
  })

  it('should show discreteConfig with the right string (LTE) if setted in DescriptorAttribute', async () => {
    const descriptorAttributeMock = createMockDescriptorAttribute({
      kind: 'CERTIFIED_DISCRETE',
      discreteConfig: { comparator: 'LTE', threshold: 100 },
    })
    renderWithApplicationContext(
      <AttributeContainer attribute={{ ...descriptorAttributeMock }} />,
      {
        withReactQueryContext: true,
      }
    )

    const discreteConfig = screen.getByText('LTE 100')

    expect(discreteConfig).toBeInTheDocument()
  })

  it('should show discreteConfig with the right string (EQ) if setted in DescriptorAttribute', async () => {
    const descriptorAttributeMock = createMockDescriptorAttribute({
      kind: 'CERTIFIED_DISCRETE',
      discreteConfig: { comparator: 'EQ', threshold: 100 },
    })
    renderWithApplicationContext(
      <AttributeContainer attribute={{ ...descriptorAttributeMock }} />,
      {
        withReactQueryContext: true,
      }
    )

    const discreteConfig = screen.getByText('EQ 100')

    expect(discreteConfig).toBeInTheDocument()
  })

  it('should show discreteConfig with the right string (NE) if setted in DescriptorAttribute', async () => {
    const descriptorAttributeMock = createMockDescriptorAttribute({
      kind: 'CERTIFIED_DISCRETE',
      discreteConfig: { comparator: 'NE', threshold: 100 },
    })
    renderWithApplicationContext(
      <AttributeContainer attribute={{ ...descriptorAttributeMock }} />,
      {
        withReactQueryContext: true,
      }
    )

    const discreteConfig = screen.getByText('NE 100')

    expect(discreteConfig).toBeInTheDocument()
  })

  it('should show discreteValue if setted in CertifiedDiscreteTenantAttribute', async () => {
    const descriptorAttributeMock = createCertifiedDiscreteTenantAttribute({
      discreteValue: 140,
    })
    renderWithApplicationContext(
      <AttributeContainer attribute={{ ...descriptorAttributeMock }} />,
      {
        withReactQueryContext: true,
      }
    )

    const discreteConfig = screen.getByText('140')

    expect(discreteConfig).toBeInTheDocument()
  })

  it('should open AttributeDetailsDrawer with the attributes details when "inspectAttributeDetails" is clicked', async () => {
    const user = userEvent.setup()
    renderWithApplicationContext(<AttributeContainer attribute={{ ...baseAttribute }} />, {
      withReactQueryContext: true,
    })

    const menuActionsIconButton = screen.getByLabelText('iconButtonAriaLabel')
    await user.click(menuActionsIconButton)

    const inspectAttributeDetailsMenuItem = screen.getByRole('menuitem', {
      name: 'actions.inspectAttributeDetails',
    })
    await user.click(inspectAttributeDetailsMenuItem)

    const attributeDetailsDrawerDescription = screen.getByText(baseAttribute.description)
    const attributeDetailsDrawerId = screen.getByText(baseAttribute.id)
    const attributeDetailsDrawerOrigin = screen.queryByText('tenantCertifierLabel')

    expect(attributeDetailsDrawerDescription).toBeInTheDocument()
    expect(attributeDetailsDrawerId).toBeInTheDocument()
    expect(attributeDetailsDrawerOrigin).not.toBeInTheDocument()
  })

  it('AttributeDetailsDrawer should contain origin if the attrubte has it', async () => {
    const mockedAttributeWithOrigin: Attribute = { ...baseAttribute, origin: 'test origin' }

    vi.mocked(AttributeQueries.getSingle).mockImplementationOnce(
      (id: string) =>
        ({
          queryKey: ['attribute', id],
          queryFn: vi.fn().mockReturnValue(mockedAttributeWithOrigin),
        }) as unknown as ReturnType<typeof AttributeQueries.getSingle>
    )

    const user = userEvent.setup()

    renderWithApplicationContext(<AttributeContainer attribute={{ ...baseAttribute }} />, {
      withReactQueryContext: true,
    })

    const menuActionsIconButton = screen.getByLabelText('iconButtonAriaLabel')
    await user.click(menuActionsIconButton)

    const inspectAttributeDetailsMenuItem = screen.getByRole('menuitem', {
      name: 'actions.inspectAttributeDetails',
    })
    await user.click(inspectAttributeDetailsMenuItem)

    const attributeDetailsDrawerOrigin = screen.getByText(mockedAttributeWithOrigin.origin!)

    expect(attributeDetailsDrawerOrigin).toBeInTheDocument()
  })
})
