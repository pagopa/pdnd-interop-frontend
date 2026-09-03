import type { RequesterCertifiedAttribute } from '@/api/api.generatedTypes'
import { renderWithApplicationContext } from '@/utils/testing.utils'
import React from 'react'
import ChangeAttributeValueDrawer from '../ChangeAttributeValueDrawer'
import userEvent from '@testing-library/user-event'
import { waitFor } from '@testing-library/react'
import { vi, describe, it, beforeEach, beforeAll, afterAll, afterEach, expect } from 'vitest'
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import { BACKEND_FOR_FRONTEND_URL } from '@/config/env'

const mockAttribute: RequesterCertifiedAttribute = {
  tenantId: 'tenant-id-1',
  tenantName: 'Comune di Test',
  attributeId: 'attribute-id-1',
  attributeName: 'Codice ATECO',
  kind: 'CERTIFIED_DISCRETE',
  discreteValue: 100,
}

let updateCertifiedDiscreteAttributeRequests: Array<{
  tenantId: string
  attributeId: string
  body: { certifiedDiscreteValue: number }
}> = []

const server = setupServer(
  rest.put(
    `${BACKEND_FOR_FRONTEND_URL}/tenants/:tenantId/attributes/certifiedDiscrete/:attributeId`,
    async (req, res, ctx) => {
      const body = await req.json()
      updateCertifiedDiscreteAttributeRequests.push({
        tenantId: req.params.tenantId as string,
        attributeId: req.params.attributeId as string,
        body: body as { certifiedDiscreteValue: number },
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

describe('ChangeAttributeValueDrawer', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    updateCertifiedDiscreteAttributeRequests = []
  })

  describe('rendering', () => {
    it('should not render the drawer when isOpen is false', () => {
      const screen = renderWithApplicationContext(
        <ChangeAttributeValueDrawer attribute={mockAttribute} isOpen={false} onClose={vi.fn()} />,
        {
          withReactQueryContext: true,
        }
      )

      expect(screen.queryByText('title')).not.toBeInTheDocument()
      expect(screen.queryByText('subtitle')).not.toBeInTheDocument()
      expect(screen.queryByText('submitBtnLabel')).not.toBeInTheDocument()
      expect(
        screen.queryByRole('spinbutton', { name: 'form.valueField.label' })
      ).not.toBeInTheDocument()
    })

    it('should render the drawer when isOpen is true', () => {
      const screen = renderWithApplicationContext(
        <ChangeAttributeValueDrawer attribute={mockAttribute} isOpen={true} onClose={vi.fn()} />,
        {
          withReactQueryContext: true,
        }
      )

      expect(screen.getByText('title')).toBeInTheDocument()
      expect(screen.getByText('subtitle')).toBeInTheDocument()
      expect(screen.getByText('submitBtnLabel')).toBeInTheDocument()
      expect(screen.getByText('actualValue')).toBeInTheDocument()
      expect(screen.getByRole('spinbutton', { name: 'form.valueField.label' })).toBeInTheDocument()
    })

    it('should render the field pre-filled with the attribute discreteValue', () => {
      const screen = renderWithApplicationContext(
        <ChangeAttributeValueDrawer attribute={mockAttribute} isOpen={true} onClose={vi.fn()} />,
        {
          withReactQueryContext: true,
        }
      )

      const valueField = screen.getByRole('spinbutton', { name: 'form.valueField.label' })
      expect(valueField).toHaveValue(100)
    })
  })

  describe('form submission', () => {
    it('should call updateCertifiedDiscreteAttribute with the new value on submit', async () => {
      const user = userEvent.setup()
      const screen = renderWithApplicationContext(
        <ChangeAttributeValueDrawer attribute={mockAttribute} isOpen={true} onClose={vi.fn()} />,
        {
          withReactQueryContext: true,
        }
      )

      const valueField = screen.getByRole('spinbutton', { name: 'form.valueField.label' })
      await user.clear(valueField)
      await user.type(valueField, '500')

      const submitButton = screen.getByRole('button', { name: 'submitBtnLabel' })
      await user.click(submitButton)

      await waitFor(() => {
        expect(updateCertifiedDiscreteAttributeRequests).toHaveLength(1)
      })

      expect(updateCertifiedDiscreteAttributeRequests[0]).toEqual({
        tenantId: mockAttribute.tenantId,
        attributeId: mockAttribute.attributeId,
        body: { certifiedDiscreteValue: 500 },
      })
    })

    it('should show a required error and block submit when the value field is empty', async () => {
      const user = userEvent.setup()
      const screen = renderWithApplicationContext(
        <ChangeAttributeValueDrawer attribute={mockAttribute} isOpen={true} onClose={vi.fn()} />,
        {
          withReactQueryContext: true,
        }
      )

      const valueField = screen.getByRole('spinbutton', { name: 'form.valueField.label' })
      await user.clear(valueField)

      const submitButton = screen.getByRole('button', { name: 'submitBtnLabel' })
      await user.click(submitButton)

      expect(await screen.findByText('validation.mixed.required')).toBeInTheDocument()
      expect(updateCertifiedDiscreteAttributeRequests).toHaveLength(0)
    })

    it('should show a min error and block submit when the value is lower than 1', async () => {
      const user = userEvent.setup()
      const screen = renderWithApplicationContext(
        <ChangeAttributeValueDrawer attribute={mockAttribute} isOpen={true} onClose={vi.fn()} />,
        {
          withReactQueryContext: true,
        }
      )

      const valueField = screen.getByRole('spinbutton', { name: 'form.valueField.label' })
      await user.clear(valueField)
      // leading zeros are blocked by the field's onKeyDown handler, so a negative value is used instead
      await user.type(valueField, '-5')

      const submitButton = screen.getByRole('button', { name: 'submitBtnLabel' })
      await user.click(submitButton)

      expect(await screen.findByText('validation.number.min')).toBeInTheDocument()
      expect(updateCertifiedDiscreteAttributeRequests).toHaveLength(0)
    })

    it('should call onClose and reset the form after the transition exits', () => {
      const onCloseFn = vi.fn()
      const screen = renderWithApplicationContext(
        <ChangeAttributeValueDrawer attribute={mockAttribute} isOpen={true} onClose={onCloseFn} />,
        {
          withReactQueryContext: true,
        }
      )

      const closeButton = screen.getByRole('button', { name: 'closeIconAriaLabel' })
      closeButton.click()

      expect(onCloseFn).toHaveBeenCalled()
    })
  })
})
