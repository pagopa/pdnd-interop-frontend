import { renderWithApplicationContext } from '@/utils/testing.utils'
import React from 'react'
import userEvent from '@testing-library/user-event'
import { waitFor } from '@testing-library/react'
import { vi, describe, it, beforeEach, expect } from 'vitest'
import { AssignAttributeDrawer } from '../AssignAttributeDrawer'
import { createMockCompactAttribute } from '../../../../../../__mocks__/data/attribute.mocks'
import { createMockCompactTenant } from '../../../../../../__mocks__/data/tenant.mocks'
import { TenantServices } from '@/api/tenant'
import { AttributeServices } from '@/api/attribute'
import { mockUseGetActiveUserParty } from '@/utils/testing.utils'

const mockAddCertifiedAttribute = vi.fn()
const mockAddCertifiedDiscreteAttribute = vi.fn()

vi.spyOn(AttributeServices, 'addCertifiedAttribute').mockImplementation(mockAddCertifiedAttribute)
vi.spyOn(AttributeServices, 'addCertifiedDiscreteAttribute').mockImplementation(
  mockAddCertifiedDiscreteAttribute
)

vi.spyOn(TenantServices, 'getTenants').mockResolvedValue({
  pagination: { offset: 0, limit: 10, totalCount: 2 },
  results: [createMockCompactTenant({ id: 'test tenant id', name: 'test tenant name' })],
})

vi.spyOn(AttributeServices, 'getList').mockResolvedValue({
  pagination: { offset: 0, limit: 10, totalCount: 2 },
  results: [
    createMockCompactAttribute({
      id: 'testAttributeCertifiedId',
      kind: 'CERTIFIED',
      name: 'test certified',
    }),
    createMockCompactAttribute({
      id: 'testAttributeCertifiedDiscreteId',
      kind: 'CERTIFIED_DISCRETE',
      name: 'test certified discrete',
    }),
  ],
})

describe('AssignAttributeDrawer', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockUseGetActiveUserParty({
      data: {
        features: [
          {
            certifier: {
              certifierId: 'test-certifier-id',
            },
          },
        ],
      },
    })
  })
  describe('rendering', () => {
    it('should not render the drawer when isOpen is false', () => {
      const screen = renderWithApplicationContext(
        <AssignAttributeDrawer isOpen={false} onClose={vi.fn()} />,
        {
          withReactQueryContext: true,
        }
      )

      expect(screen.queryByText('title')).not.toBeInTheDocument()
      expect(screen.queryByText('subtitle')).not.toBeInTheDocument()
      expect(screen.queryByText('submitBtnLabel')).not.toBeInTheDocument()
      expect(screen.queryByText('form.attributeField.label')).not.toBeInTheDocument()
    })

    it('should render the drawer when isOpen is true', () => {
      const screen = renderWithApplicationContext(
        <AssignAttributeDrawer isOpen={true} onClose={vi.fn()} />,
        {
          withReactQueryContext: true,
        }
      )

      expect(screen.getByText('title')).toBeInTheDocument()
      expect(screen.getByText('subtitle')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'submitBtnLabel' })).toBeInTheDocument()
      expect(
        screen.getByRole('combobox', {
          name: 'form.attributeField.label',
        })
      ).toBeInTheDocument()
    })
  })

  describe('form submission', () => {
    it('should call addCertifiedAttribute if selectedAttribute kind is CERTIFIED', async () => {
      const user = userEvent.setup()
      const screen = renderWithApplicationContext(
        <AssignAttributeDrawer isOpen={true} onClose={vi.fn()} />,
        {
          withReactQueryContext: true,
        }
      )

      const attributeAutocomplete = screen.getByRole('combobox', {
        name: 'form.attributeField.label',
      })
      await user.click(attributeAutocomplete)
      const attributeToSelect = await screen.findByRole('option', { name: 'test certified' })
      await user.click(attributeToSelect)

      const tenantAutocomplete = screen.getByRole('combobox', {
        name: 'form.tenantField.label',
      })
      await user.click(tenantAutocomplete)
      const tenantToSelect = await screen.findByRole('option', { name: 'test tenant name' })
      await user.click(tenantToSelect)

      const thresholdField = screen.queryByRole('spinbutton', {
        name: 'form.thresholdField.label',
      })

      expect(thresholdField).not.toBeInTheDocument()

      const submitButton = screen.getByRole('button', { name: 'submitBtnLabel' })
      await user.click(submitButton)

      await waitFor(() => {
        expect(mockAddCertifiedDiscreteAttribute).not.toBeCalled()
        expect(mockAddCertifiedAttribute).toBeCalledWith({
          id: 'testAttributeCertifiedId',
          tenantId: 'test tenant id',
        })
      })
    })

    it('should call addCertifiedDiscreteAttribute if attribute kind selected is CERTIFIED_DISCRETE', async () => {
      const user = userEvent.setup()
      const screen = renderWithApplicationContext(
        <AssignAttributeDrawer isOpen={true} onClose={vi.fn()} />,
        {
          withReactQueryContext: true,
        }
      )

      const attributeAutocomplete = screen.getByRole('combobox', {
        name: 'form.attributeField.label',
      })
      await user.click(attributeAutocomplete)
      const attributeToSelect = await screen.findByRole('option', {
        name: 'test certified discrete',
      })
      await user.click(attributeToSelect)

      const tenantAutocomplete = screen.getByRole('combobox', {
        name: 'form.tenantField.label',
      })
      await user.click(tenantAutocomplete)
      const tenantToSelect = await screen.findByRole('option', { name: 'test tenant name' })
      await user.click(tenantToSelect)

      const thresholdField = screen.getByRole('spinbutton', {
        name: 'form.thresholdField.label',
      })

      await user.type(thresholdField, '11')

      const submitButton = screen.getByRole('button', { name: 'submitBtnLabel' })
      await user.click(submitButton)

      await waitFor(() => {
        expect(mockAddCertifiedAttribute).not.toBeCalled()
        expect(mockAddCertifiedDiscreteAttribute).toBeCalledWith({
          id: 'testAttributeCertifiedDiscreteId',
          tenantId: 'test tenant id',
          certifiedDiscreteThreshold: 11,
        })
      })
    })
  })
})
