import { renderWithApplicationContext } from '@/utils/testing.utils'
import React from 'react'
import { CreateAttributeDrawer } from '../CreateAttributeDrawer'
import userEvent from '@testing-library/user-event'
import { waitFor } from '@testing-library/react'
import { vi, describe, it, beforeEach, beforeAll, afterAll, afterEach, expect } from 'vitest'
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import { BACKEND_FOR_FRONTEND_URL } from '@/config/env'

let createCertifiedRequests: Array<{ name: string; description: string }> = []
let createCertifiedDiscreteRequests: Array<{ name: string; description: string }> = []

const server = setupServer(
  rest.post(`${BACKEND_FOR_FRONTEND_URL}/certifiedAttributes`, async (req, res, ctx) => {
    const body = await req.json()
    createCertifiedRequests.push(body as { name: string; description: string })
    return res(ctx.status(200))
  }),
  rest.post(`${BACKEND_FOR_FRONTEND_URL}/certifiedDiscreteAttributes`, async (req, res, ctx) => {
    const body = await req.json()
    createCertifiedDiscreteRequests.push(body as { name: string; description: string })
    return res(ctx.status(200))
  })
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

describe('CreateAttributeDrawer', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    createCertifiedRequests = []
    createCertifiedDiscreteRequests = []
  })
  describe('rendering', () => {
    it('should not render the drawer when isOpen is false', () => {
      const screen = renderWithApplicationContext(
        <CreateAttributeDrawer isOpen={false} onClose={vi.fn()} />,
        {
          withReactQueryContext: true,
        }
      )

      expect(screen.queryByText('title')).not.toBeInTheDocument()
      expect(screen.queryByText('subtitle')).not.toBeInTheDocument()
      expect(screen.queryByText('submitBtnLabel')).not.toBeInTheDocument()
      expect(screen.queryByLabelText('form.infoFields.nameField.label')).not.toBeInTheDocument()
    })

    it('should render the drawer when isOpen is true', () => {
      const screen = renderWithApplicationContext(
        <CreateAttributeDrawer isOpen={true} onClose={vi.fn()} />,
        {
          withReactQueryContext: true,
        }
      )

      expect(screen.getByText('title')).toBeInTheDocument()
      expect(screen.getByText('subtitle')).toBeInTheDocument()
      expect(screen.getByText('submitBtnLabel')).toBeInTheDocument()
      expect(screen.getByText('form.infoFields.nameField.label')).toBeInTheDocument()
    })
  })

  describe('form submission', () => {
    it('should call createCertifiedAttribute if attribute kind selected is CERTIFIED', async () => {
      const user = userEvent.setup()
      const screen = renderWithApplicationContext(
        <CreateAttributeDrawer isOpen={true} onClose={vi.fn()} />,
        {
          withReactQueryContext: true,
        }
      )

      const radioOptionCertified = screen.getByRole('radio', {
        name: 'form.kindField.kindRadio.optionCertifiedLabel',
      })

      await user.click(radioOptionCertified)

      const nameField = screen.getByRole('textbox', { name: 'form.infoFields.nameField.label' })
      const descriptionField = screen.getByRole('textbox', {
        name: 'form.infoFields.descriptionField.label',
      })

      await user.type(nameField, 'test name certified')
      await user.type(descriptionField, 'test description certified')

      const submitButton = screen.getByRole('button', { name: 'submitBtnLabel' })
      await user.click(submitButton)

      await waitFor(() => {
        expect(createCertifiedDiscreteRequests).toHaveLength(0)
        expect(createCertifiedRequests).toHaveLength(1)
      })

      expect(createCertifiedRequests[0]).toEqual({
        name: 'test name certified',
        description: 'test description certified',
      })
    })

    it('should call createCertifiedAttributeDiscrete if attribute kind selected is CERTIFIED_DISCRETE', async () => {
      const user = userEvent.setup()
      const screen = renderWithApplicationContext(
        <CreateAttributeDrawer isOpen={true} onClose={vi.fn()} />,
        {
          withReactQueryContext: true,
        }
      )

      const radioOptionCertified = screen.getByRole('radio', {
        name: 'form.kindField.kindRadio.optionCertifiedDiscreteLabel',
      })

      await user.click(radioOptionCertified)

      const nameField = screen.getByRole('textbox', { name: 'form.infoFields.nameField.label' })
      const descriptionField = screen.getByRole('textbox', {
        name: 'form.infoFields.descriptionField.label',
      })

      await user.type(nameField, 'test name certified discrete')
      await user.type(descriptionField, 'test description certified discrete')

      const submitButton = screen.getByRole('button', { name: 'submitBtnLabel' })
      await user.click(submitButton)

      await waitFor(() => {
        expect(createCertifiedRequests).toHaveLength(0)
        expect(createCertifiedDiscreteRequests).toHaveLength(1)
      })

      expect(createCertifiedDiscreteRequests[0]).toEqual({
        name: 'test name certified discrete',
        description: 'test description certified discrete',
      })
    })

    it('should show required errors and block submit when required fields are empty', async () => {
      const user = userEvent.setup()
      const screen = renderWithApplicationContext(
        <CreateAttributeDrawer isOpen={true} onClose={vi.fn()} />,
        {
          withReactQueryContext: true,
        }
      )

      const submitButton = screen.getByRole('button', { name: 'submitBtnLabel' })
      await user.click(submitButton)

      const requiredErrors = await screen.findAllByText('validation.mixed.required')
      expect(requiredErrors).toHaveLength(2)
      expect(createCertifiedRequests).toHaveLength(0)
      expect(createCertifiedDiscreteRequests).toHaveLength(0)
    })

    it('should show minLength errors and block submit when fields are too short', async () => {
      const user = userEvent.setup()
      const screen = renderWithApplicationContext(
        <CreateAttributeDrawer isOpen={true} onClose={vi.fn()} />,
        {
          withReactQueryContext: true,
        }
      )

      const nameField = screen.getByRole('textbox', { name: 'form.infoFields.nameField.label' })
      const descriptionField = screen.getByRole('textbox', {
        name: 'form.infoFields.descriptionField.label',
      })

      await user.type(nameField, 'abc')
      await user.type(descriptionField, 'short')

      const submitButton = screen.getByRole('button', { name: 'submitBtnLabel' })
      await user.click(submitButton)

      const minLengthErrors = await screen.findAllByText('validation.string.minLength')
      expect(minLengthErrors).toHaveLength(2)
      expect(createCertifiedRequests).toHaveLength(0)
      expect(createCertifiedDiscreteRequests).toHaveLength(0)
    })
  })
})
