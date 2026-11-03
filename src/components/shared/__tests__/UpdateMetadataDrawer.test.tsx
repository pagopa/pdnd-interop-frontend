import { screen, waitFor, waitForElementToBeRemoved } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { renderWithApplicationContext, mockUseJwt } from '@/utils/testing.utils'
import { UpdateMetadataDrawer, type UpdateMetadataFormValues } from '../UpdateMetadataDrawer'

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
  },
  descriptionField: {
    label: 'Template description',
    helperText: 'Description must be between 10 and 250 characters',
  },
  onSubmit,
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
    expect(screen.queryByRole('textbox', { name: 'Template audience' })).not.toBeInTheDocument()
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

  it('should render the optional audience field when enabled', () => {
    renderDrawer({
      ...defaultProps,
      audienceField: {
        label: 'Template audience',
        helperText: 'Audience must be between 10 and 250 characters',
      },
    })

    expect(screen.getByRole('textbox', { name: 'Template audience' })).toBeInTheDocument()
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

  it('should use the e-service description max length', () => {
    renderDrawer({
      ...defaultProps,
      isEService: true,
      descriptionField: {
        ...defaultProps.descriptionField,
        helperText: 'Add a detailed description. Min 10 characters, max 400 characters',
      },
    })

    expect(screen.getByRole('textbox', { name: 'Template description' })).toHaveAttribute(
      'maxlength',
      '400'
    )
  })

  it('should submit name and description without an audience when the field is disabled', async () => {
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

  it('should submit audience when the field is enabled', async () => {
    const user = userEvent.setup()
    renderDrawer({
      ...defaultProps,
      audienceField: {
        label: 'Template audience',
        helperText: 'Audience must be between 10 and 250 characters',
      },
    })

    await user.type(screen.getByRole('textbox', { name: 'Template name' }), 'Updated template')
    await user.type(
      screen.getByRole('textbox', { name: 'Template description' }),
      'Updated template description'
    )
    await user.type(
      screen.getByRole('textbox', { name: 'Template audience' }),
      'Public sector organizations'
    )
    await user.click(screen.getByRole('button', { name: 'common.actions.saveEdits' }))

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        name: 'Updated template',
        description: 'Updated template description',
        audience: 'Public sector organizations',
      })
    })
  })

  it('should not submit when required values are missing', async () => {
    const user = userEvent.setup()
    renderDrawer(defaultProps)

    await user.click(screen.getByRole('button', { name: 'common.actions.saveEdits' }))

    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('should initialize the fields from provided values', () => {
    renderDrawer({
      ...defaultProps,
      audienceField: {
        label: 'Template audience',
        helperText: 'Audience must be between 10 and 250 characters',
      },
      initialValues: {
        name: 'Existing template',
        description: 'Existing template description',
        audience: 'Public sector organizations',
      },
    })

    expect(screen.getByRole('textbox', { name: 'Template name' })).toHaveValue('Existing template')
    expect(screen.getByRole('textbox', { name: 'Template description' })).toHaveValue(
      'Existing template description'
    )
    expect(screen.getByRole('textbox', { name: 'Template audience' })).toHaveValue(
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
