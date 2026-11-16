import { screen, waitFor, waitForElementToBeRemoved } from '@testing-library/react'
import userEvent, { PointerEventsCheckLevel } from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { renderWithApplicationContext, mockUseJwt } from '@/utils/testing.utils'
import { UpdateMetadataDrawer, type UpdateMetadataFormValues } from '../UpdateMetadataDrawer'
import { SupportActionGuardProvider } from '@/hooks/useIsActionDisabledBySupport'

mockUseJwt()

vi.mock('react-i18next', () => ({
  useTranslation: (namespace?: string, options?: { keyPrefix?: string }) => ({
    t: (key: string) => [namespace, options?.keyPrefix, key].filter(Boolean).join('.'),
  }),
}))

const onClose = vi.fn()
const onSubmit = vi.fn<(values: UpdateMetadataFormValues) => void>()

const defaultProps = {
  isOpen: true,
  onClose,
  title: 'Update template',
  description: 'Update the template details.',
  nameField: {
    label: 'Template name',
    helperText: 'Name must be between 5 and 60 characters',
    validation: { required: true, minLength: 5, maxLength: 60 },
  },
  descriptionField: {
    label: 'Template description',
    helperText: 'Description must be between 10 and 250 characters',
    validation: { required: true, minLength: 10, maxLength: 250 },
  },
  onSubmit,
}

const defaultTargetField = {
  label: 'Template target',
  helperText: 'Target must be between 10 and 250 characters',
  validation: { required: true, minLength: 10, maxLength: 250 },
}

const renderDrawer = (props: React.ComponentProps<typeof UpdateMetadataDrawer>) =>
  renderWithApplicationContext(<UpdateMetadataDrawer {...props} />, {
    withReactQueryContext: true,
  })

describe('UpdateMetadataDrawer', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render the title, description and required fields', () => {
    renderDrawer(defaultProps)

    expect(screen.getByText('Update template')).toBeInTheDocument()
    expect(screen.getByText('Update the template details.')).toBeInTheDocument()
    expect(screen.getByRole('textbox', { name: 'Template name' })).toBeInTheDocument()
    expect(screen.getByRole('textbox', { name: 'Template description' })).toBeInTheDocument()
    expect(screen.queryByRole('textbox', { name: 'Template target' })).not.toBeInTheDocument()
  })

  it('should render a link inside the description', () => {
    renderDrawer({
      ...defaultProps,
      description: (
        <>
          Read the <a href="/guide">guide</a> before saving.
        </>
      ),
    })

    expect(screen.getByRole('link', { name: 'guide' })).toHaveAttribute('href', '/guide')
  })

  it('should render the optional target field when enabled', () => {
    renderDrawer({
      ...defaultProps,
      targetField: defaultTargetField,
    })

    expect(screen.getByRole('textbox', { name: 'Template target' })).toBeInTheDocument()
  })

  it('should apply the name and description length limits', () => {
    renderDrawer(defaultProps)

    expect(screen.getByRole('textbox', { name: 'Template name' })).toHaveAttribute(
      'maxlength',
      '60'
    )
    expect(screen.getByRole('textbox', { name: 'Template description' })).toHaveAttribute(
      'maxlength',
      '250'
    )
  })

  it('should use the configured description max length', () => {
    renderDrawer({
      ...defaultProps,
      descriptionField: {
        ...defaultProps.descriptionField,
        helperText: 'Add a detailed description. Min 10 characters, max 400 characters',
        validation: { required: true, minLength: 10, maxLength: 400 },
      },
    })

    expect(screen.getByRole('textbox', { name: 'Template description' })).toHaveAttribute(
      'maxlength',
      '400'
    )
  })

  it('should submit name and description without a target when the field is disabled', async () => {
    const user = userEvent.setup()
    renderDrawer(defaultProps)

    await user.type(screen.getByRole('textbox', { name: 'Template name' }), 'Updated template')
    await user.type(
      screen.getByRole('textbox', { name: 'Template description' }),
      'Updated template description'
    )
    await user.click(screen.getByRole('button', { name: 'common.actions.saveEdits' }))

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        name: 'Updated template',
        description: 'Updated template description',
      })
    })
  })

  it('should close without calling onSubmit when all values are unchanged with target enabled', async () => {
    const user = userEvent.setup()
    renderDrawer({
      ...defaultProps,
      targetField: defaultTargetField,
      initialValues: {
        name: 'Existing template',
        description: 'Existing template description',
        target: 'Public sector organizations',
      },
    })

    const saveButton = screen.getByRole('button', { name: 'common.actions.saveEdits' })
    expect(saveButton).toBeEnabled()
    await user.click(saveButton)

    expect(onSubmit).not.toHaveBeenCalled()
    expect(onClose).toHaveBeenCalledOnce()
  })

  it('should disable Save for support users with valid values and explain the restriction', async () => {
    const user = userEvent.setup({ pointerEventsCheck: PointerEventsCheckLevel.Never })
    renderWithApplicationContext(
      <SupportActionGuardProvider isSupport>
        <UpdateMetadataDrawer
          {...defaultProps}
          initialValues={{
            name: 'Existing template',
            description: 'Existing template description',
          }}
        />
      </SupportActionGuardProvider>,
      { withReactQueryContext: true }
    )

    expect(screen.getByRole('textbox', { name: 'Template name' })).toHaveValue('Existing template')
    expect(screen.getByRole('textbox', { name: 'Template description' })).toHaveValue(
      'Existing template description'
    )
    const saveButton = screen.getByRole('button', { name: 'common.actions.saveEdits' })
    expect(saveButton).toBeDisabled()

    await user.click(saveButton)
    expect(onSubmit).not.toHaveBeenCalled()

    await user.click(screen.getByRole('textbox', { name: 'Template name' }))
    await user.tab()
    await user.tab()
    expect(screen.getByLabelText('shared-components.drawer.supportDisableInfo')).toHaveFocus()
    expect(await screen.findByRole('tooltip')).toHaveTextContent(
      'shared-components.drawer.supportDisableInfo'
    )
    await user.keyboard('{Enter}')
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('should submit target when the field is enabled', async () => {
    const user = userEvent.setup()
    renderDrawer({
      ...defaultProps,
      targetField: defaultTargetField,
    })

    await user.type(screen.getByRole('textbox', { name: 'Template name' }), 'Updated template')
    await user.type(
      screen.getByRole('textbox', { name: 'Template description' }),
      'Updated template description'
    )
    await user.type(
      screen.getByRole('textbox', { name: 'Template target' }),
      'Public sector organizations'
    )
    await user.click(screen.getByRole('button', { name: 'common.actions.saveEdits' }))

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        name: 'Updated template',
        description: 'Updated template description',
        target: 'Public sector organizations',
      })
    })
  })

  it('should submit when only target changes', async () => {
    const user = userEvent.setup()
    renderDrawer({
      ...defaultProps,
      targetField: defaultTargetField,
      initialValues: {
        name: 'Existing template',
        description: 'Existing template description',
        target: 'Public sector organizations',
      },
    })

    const targetInput = screen.getByRole('textbox', { name: 'Template target' })
    await user.clear(targetInput)
    await user.type(targetInput, 'Private sector organizations')
    await user.click(screen.getByRole('button', { name: 'common.actions.saveEdits' }))

    expect(onSubmit).toHaveBeenCalledWith({
      name: 'Existing template',
      description: 'Existing template description',
      target: 'Private sector organizations',
    })
    expect(onClose).not.toHaveBeenCalled()
  })

  it('should not submit when required values are missing', async () => {
    const user = userEvent.setup()
    renderDrawer(defaultProps)

    await user.click(screen.getByRole('button', { name: 'common.actions.saveEdits' }))

    expect(onSubmit).not.toHaveBeenCalled()
  })

  it.each([
    { field: 'name', invalidValue: 'Four', correctedValue: 'Valid template' },
    { field: 'description', invalidValue: 'Too short', correctedValue: 'Valid description' },
    { field: 'target', invalidValue: '', correctedValue: 'Public sector target' },
    { field: 'target', invalidValue: 'Too short', correctedValue: 'Public sector target' },
  ] as const)(
    'should block submission for invalid $field and allow correction',
    async ({ field, invalidValue, correctedValue }) => {
      const user = userEvent.setup()
      renderDrawer({ ...defaultProps, targetField: defaultTargetField })

      const inputs = {
        name: screen.getByRole('textbox', { name: 'Template name' }),
        description: screen.getByRole('textbox', { name: 'Template description' }),
        target: screen.getByRole('textbox', { name: 'Template target' }),
      }

      await user.type(inputs.name, field === 'name' ? invalidValue : 'Valid template')
      await user.type(
        inputs.description,
        field === 'description' ? invalidValue : 'Valid description'
      )
      if (field !== 'target' || invalidValue) {
        await user.type(inputs.target, field === 'target' ? invalidValue : 'Public sector target')
      }

      await user.click(screen.getByRole('button', { name: 'common.actions.saveEdits' }))

      expect(onSubmit).not.toHaveBeenCalled()
      expect(inputs[field]).toHaveAttribute('aria-invalid', 'true')

      await user.clear(inputs[field])
      await user.type(inputs[field], correctedValue)
      await user.click(screen.getByRole('button', { name: 'common.actions.saveEdits' }))

      await waitFor(() => {
        expect(onSubmit).toHaveBeenCalledWith({
          name: field === 'name' ? correctedValue : 'Valid template',
          description: field === 'description' ? correctedValue : 'Valid description',
          target: field === 'target' ? correctedValue : 'Public sector target',
        })
      })
    }
  )

  it.each(['name', 'description', 'target'] as const)(
    'should allow an empty optional %s field',
    async (optionalField) => {
      const user = userEvent.setup()
      renderDrawer({
        ...defaultProps,
        nameField: {
          ...defaultProps.nameField,
          validation: { ...defaultProps.nameField.validation, required: optionalField !== 'name' },
        },
        descriptionField: {
          ...defaultProps.descriptionField,
          validation: {
            ...defaultProps.descriptionField.validation,
            required: optionalField !== 'description',
          },
        },
        targetField: {
          ...defaultTargetField,
          validation: {
            ...defaultTargetField.validation,
            required: optionalField !== 'target',
          },
        },
      })

      const values = {
        name: optionalField === 'name' ? '' : 'Valid template',
        description: optionalField === 'description' ? '' : 'Valid description',
        target: optionalField === 'target' ? '' : 'Public sector target',
      }
      const inputs = {
        name: screen.getByRole('textbox', { name: 'Template name' }),
        description: screen.getByRole('textbox', { name: 'Template description' }),
        target: screen.getByRole('textbox', { name: 'Template target' }),
      }

      for (const field of ['name', 'description', 'target'] as const) {
        if (field !== optionalField) {
          await user.type(inputs[field], values[field])
        }
      }
      await user.click(screen.getByRole('button', { name: 'common.actions.saveEdits' }))

      await waitFor(() => {
        expect(onSubmit).toHaveBeenCalledWith(values)
      })
    }
  )

  it('should initialize the fields from provided values', () => {
    renderDrawer({
      ...defaultProps,
      targetField: defaultTargetField,
      initialValues: {
        name: 'Existing template',
        description: 'Existing template description',
        target: 'Public sector organizations',
      },
    })

    expect(screen.getByRole('textbox', { name: 'Template name' })).toHaveValue('Existing template')
    expect(screen.getByRole('textbox', { name: 'Template description' })).toHaveValue(
      'Existing template description'
    )
    expect(screen.getByRole('textbox', { name: 'Template target' })).toHaveValue(
      'Public sector organizations'
    )
  })

  it('should restore initial values and clear validation errors after closing and reopening', async () => {
    const user = userEvent.setup()
    const initialValues = {
      name: 'Existing template',
      description: 'Existing template description',
    }
    const props = { ...defaultProps, initialValues }
    const { rerender } = renderDrawer(props)
    const nameField = screen.getByRole('textbox', { name: 'Template name' })
    const descriptionField = screen.getByRole('textbox', { name: 'Template description' })

    await user.clear(nameField)
    await user.type(nameField, 'Discarded template')
    await user.clear(descriptionField)
    await user.click(screen.getByRole('button', { name: 'common.actions.saveEdits' }))

    expect(descriptionField).toHaveAttribute('aria-invalid', 'true')

    rerender(<UpdateMetadataDrawer {...props} isOpen={false} />)
    await waitForElementToBeRemoved(descriptionField)

    rerender(<UpdateMetadataDrawer {...props} isOpen />)

    expect(screen.getByRole('textbox', { name: 'Template name' })).toHaveValue('Existing template')
    expect(screen.getByRole('textbox', { name: 'Template description' })).toHaveValue(
      'Existing template description'
    )
    expect(screen.getByRole('textbox', { name: 'Template description' })).toHaveAttribute(
      'aria-invalid',
      'false'
    )
  })

  it('should reset fields when initial values change', async () => {
    const initialValues = {
      name: 'Existing template',
      description: 'Existing template description',
    }
    const { rerender } = renderDrawer({ ...defaultProps, initialValues })

    rerender(
      <UpdateMetadataDrawer
        {...defaultProps}
        initialValues={{ name: 'Updated template', description: 'Updated template description' }}
      />
    )

    await waitFor(() => {
      expect(screen.getByRole('textbox', { name: 'Template name' })).toHaveValue('Updated template')
      expect(screen.getByRole('textbox', { name: 'Template description' })).toHaveValue(
        'Updated template description'
      )
    })
  })
})
