import { renderWithApplicationContext } from '@/utils/testing.utils'
import React from 'react'
import userEvent from '@testing-library/user-event'
import { waitFor } from '@testing-library/react'
import { vi, describe, it, beforeEach, beforeAll, afterAll, afterEach, expect } from 'vitest'
import { AssignAttributeDrawer } from '../AssignAttributeDrawer'
import { createMockCompactAttribute } from '../../../../../../__mocks__/data/attribute.mocks'
import { createMockCompactTenant } from '../../../../../../__mocks__/data/tenant.mocks'
import { TenantServices } from '@/api/tenant'
import { AttributeServices } from '@/api/attribute'
import { mockUseGetActiveUserParty } from '@/utils/testing.utils'
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import { BACKEND_FOR_FRONTEND_URL } from '@/config/env'

let addCertifiedAttributeRequests: Array<{ tenantId: string; body: { id: string } }> = []
let addCertifiedDiscreteAttributeRequests: Array<{
  tenantId: string
  body: { id: string; certifiedDiscreteValue: number }
}> = []

const server = setupServer(
  rest.post(
    `${BACKEND_FOR_FRONTEND_URL}/tenants/:tenantId/attributes/certified`,
    async (req, res, ctx) => {
      const body = await req.json()

      addCertifiedAttributeRequests.push({
        tenantId: req.params.tenantId as string,
        body: body as { id: string },
      })

      return res(ctx.status(200))
    }
  ),
  rest.post(
    `${BACKEND_FOR_FRONTEND_URL}/tenants/:tenantId/attributes/certifiedDiscrete`,
    async (req, res, ctx) => {
      const body = await req.json()

      addCertifiedDiscreteAttributeRequests.push({
        tenantId: req.params.tenantId as string,
        body: body as { id: string; certifiedDiscreteValue: number },
      })

      return res(ctx.status(200))
    }
  )
)

beforeAll(() => {
  server.listen()
})

afterEach(() => {
  server.resetHandlers()
})

afterAll(() => {
  server.close()
})

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
    addCertifiedAttributeRequests = []
    addCertifiedDiscreteAttributeRequests = []
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

      const valueField = screen.queryByRole('spinbutton', {
        name: 'form.valueField.label',
      })

      expect(valueField).not.toBeInTheDocument()

      const submitButton = screen.getByRole('button', { name: 'submitBtnLabel' })
      await user.click(submitButton)

      await waitFor(() => {
        expect(addCertifiedDiscreteAttributeRequests).toHaveLength(0)
        expect(addCertifiedAttributeRequests).toHaveLength(1)
      })

      expect(addCertifiedAttributeRequests[0]).toEqual({
        tenantId: 'test tenant id',
        body: {
          id: 'testAttributeCertifiedId',
        },
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

      const valueField = screen.getByRole('spinbutton', {
        name: 'form.valueField.label',
      })

      await user.type(valueField, '11')

      const submitButton = screen.getByRole('button', { name: 'submitBtnLabel' })
      await user.click(submitButton)

      await waitFor(() => {
        expect(addCertifiedAttributeRequests).toHaveLength(0)
        expect(addCertifiedDiscreteAttributeRequests).toHaveLength(1)
      })

      expect(addCertifiedDiscreteAttributeRequests[0]).toEqual({
        tenantId: 'test tenant id',
        body: {
          id: 'testAttributeCertifiedDiscreteId',
          certifiedDiscreteValue: 11,
        },
      })
    })

    it('should show required error and block submit for CERTIFIED_DISCRETE when value is missing', async () => {
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

      const submitButton = screen.getByRole('button', { name: 'submitBtnLabel' })
      await user.click(submitButton)

      expect(await screen.findByText('validation.mixed.required')).toBeInTheDocument()
      expect(addCertifiedAttributeRequests).toHaveLength(0)
      expect(addCertifiedDiscreteAttributeRequests).toHaveLength(0)
    })

    it('should show min error and block submit for CERTIFIED_DISCRETE when value is below 1', async () => {
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

      const valueField = screen.getByRole('spinbutton', {
        name: 'form.valueField.label',
      })

      await user.type(valueField, '-1')

      const submitButton = screen.getByRole('button', { name: 'submitBtnLabel' })
      await user.click(submitButton)

      expect(await screen.findByText('validation.number.min')).toBeInTheDocument()
      expect(addCertifiedAttributeRequests).toHaveLength(0)
      expect(addCertifiedDiscreteAttributeRequests).toHaveLength(0)
    })

    it('should show integer error and block submit for CERTIFIED_DISCRETE when value is decimal', async () => {
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

      const valueField = screen.getByRole('spinbutton', {
        name: 'form.valueField.label',
      })

      await user.type(valueField, '1.5')

      const submitButton = screen.getByRole('button', { name: 'submitBtnLabel' })
      await user.click(submitButton)

      expect(await screen.findByText('form.valueField.validation.integer')).toBeInTheDocument()
      expect(addCertifiedAttributeRequests).toHaveLength(0)
      expect(addCertifiedDiscreteAttributeRequests).toHaveLength(0)
    })

    it('should reset value to default when selected attribute changes', async () => {
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
      const certifiedDiscreteAttributeToSelect = await screen.findByRole('option', {
        name: 'test certified discrete',
      })
      await user.click(certifiedDiscreteAttributeToSelect)

      const valueField = screen.getByRole('spinbutton', {
        name: 'form.valueField.label',
      })
      await user.type(valueField, '11')
      expect((valueField as HTMLInputElement).value).toBe('11')

      await user.click(attributeAutocomplete)
      const certifiedAttributeToSelect = await screen.findByRole('option', {
        name: 'test certified',
      })
      await user.click(certifiedAttributeToSelect)

      expect(
        screen.queryByRole('spinbutton', {
          name: 'form.valueField.label',
        })
      ).not.toBeInTheDocument()

      await user.click(attributeAutocomplete)
      const certifiedDiscreteAttributeToSelectAgain = await screen.findByRole('option', {
        name: 'test certified discrete',
      })
      await user.click(certifiedDiscreteAttributeToSelectAgain)

      const valueFieldAfterAttributeChange = screen.getByRole('spinbutton', {
        name: 'form.valueField.label',
      })
      expect((valueFieldAfterAttributeChange as HTMLInputElement).value).toBe('')
    })
  })
})
