import React from 'react'
import userEvent from '@testing-library/user-event'
import { within } from '@testing-library/react'
import { FormProvider, useFieldArray, useForm } from 'react-hook-form'
import { renderWithApplicationContext } from '@/utils/testing.utils'
import {
  PageContainer,
  usePageContainerFormDirtyState as legacyUsePageContainerFormDirtyState,
} from '../PageContainer'
import { usePageContainerFormDirtyState as barrelUsePageContainerFormDirtyState } from '..'
import { usePageContainerFormDirtyState } from '@/hooks/usePageContainerFormDirtyState'

describe('PageContainer', () => {
  it('preserves the hook exports from PageContainer and the containers barrel', () => {
    expect(legacyUsePageContainerFormDirtyState).toBe(usePageContainerFormDirtyState)
    expect(barrelUsePageContainerFormDirtyState).toBe(usePageContainerFormDirtyState)
  })

  it('renders title and status chip on the left and actions on the right of the same header row', () => {
    const action = vi.fn()
    const screen = renderWithApplicationContext(
      <PageContainer
        title="Page title"
        description="Page description"
        statusChip={{ for: 'delegation', state: 'ACTIVE' }}
        topSideActions={[
          { action, label: 'First action' },
          { action, label: 'Second action' },
        ]}
      >
        Content
      </PageContainer>,
      { withRouterContext: true }
    )

    const header = screen.getByTestId('page-container-header')
    const titleGroup = within(header).getByTestId('page-container-header-title')
    const actions = within(header).getByTestId('page-container-header-actions')

    expect(header.children).toHaveLength(2)
    expect(header.firstElementChild).toBe(titleGroup)
    expect(header.lastElementChild).toBe(actions)
    expect(within(titleGroup).getByRole('heading', { level: 1, name: 'Page title' })).toBeVisible()
    expect(within(titleGroup).getByText('status.delegation.ACTIVE')).toBeVisible()
    expect(
      within(actions)
        .getAllByRole('button')
        .map((button) => button.textContent)
    ).toEqual(['First action', 'Second action'])

    const description = screen.getByText('Page description')
    expect(header).not.toContainElement(description)
    expect(
      header.compareDocumentPosition(description) & Node.DOCUMENT_POSITION_FOLLOWING
    ).toBeTruthy()
  })

  it('renders a custom description node below the header row', () => {
    const screen = renderWithApplicationContext(
      <PageContainer
        title="Page title"
        description={<div data-testid="custom-description">Custom description</div>}
        topSideActions={[{ action: vi.fn(), label: 'Action' }]}
      >
        Content
      </PageContainer>,
      { withRouterContext: true }
    )

    const header = screen.getByTestId('page-container-header')
    const description = screen.getByTestId('custom-description')
    expect(header).not.toContainElement(description)
    expect(
      header.compareDocumentPosition(description) & Node.DOCUMENT_POSITION_FOLLOWING
    ).toBeTruthy()
  })

  it('hides the header and its actions while loading', () => {
    const screen = renderWithApplicationContext(
      <PageContainer
        isLoading
        title="Page title"
        statusChip={{ for: 'delegation', state: 'ACTIVE' }}
        topSideActions={[{ action: vi.fn(), label: 'Hidden action' }]}
      >
        Content
      </PageContainer>,
      { withRouterContext: true }
    )

    expect(screen.queryByTestId('page-container-header')).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Hidden action' })).not.toBeInTheDocument()
    expect(screen.queryByText('Page title')).not.toBeInTheDocument()
    expect(screen.getByText('Content')).toBeInTheDocument()
  })

  it('honors externally controlled unsaved changes for programmatic form updates', async () => {
    const ControlledWizard = () => {
      const [hasUnsavedChanges, setHasUnsavedChanges] = React.useState(false)

      return (
        <PageContainer
          navigation={{
            mode: 'wizard',
            exitAction: { to: 'DEFAULT' },
            hasUnsavedChanges,
          }}
        >
          <button type="button" onClick={() => setHasUnsavedChanges(true)}>
            Programmatic change
          </button>
        </PageContainer>
      )
    }

    const screen = renderWithApplicationContext(<ControlledWizard />, {
      withRouterContext: true,
      withDialogContext: true,
    })

    await userEvent.click(screen.getByRole('button', { name: 'Programmatic change' }))
    await userEvent.click(screen.getByRole('link', { name: 'exitButton' }))

    expect(
      screen.getByRole('dialog', {
        name: 'exitDialog.title',
      })
    ).toBeInTheDocument()
  })

  it('marks a wizard as having unsaved changes when a form field changes', async () => {
    const screen = renderWithApplicationContext(
      <PageContainer
        navigation={{
          mode: 'wizard',
          exitAction: { to: 'DEFAULT' },
        }}
      >
        <label htmlFor="wizard-field">Wizard field</label>
        <input id="wizard-field" />
      </PageContainer>,
      {
        withRouterContext: true,
        withDialogContext: true,
      }
    )

    await userEvent.type(screen.getByLabelText('Wizard field'), 'Changed value')
    await userEvent.click(screen.getByRole('link', { name: 'exitButton' }))

    expect(
      screen.getByRole('dialog', {
        name: 'exitDialog.title',
      })
    ).toBeInTheDocument()
  })

  it('does not carry unsaved changes from the previous wizard step', async () => {
    const WizardStepForm = ({ stepName }: { stepName: string }) => {
      const methods = useForm({ defaultValues: { value: '' } })
      usePageContainerFormDirtyState(methods.control)

      return (
        <FormProvider {...methods}>
          <label htmlFor={`${stepName}-field`}>{stepName} field</label>
          <input id={`${stepName}-field`} {...methods.register('value')} />
        </FormProvider>
      )
    }

    const StepWizard = () => {
      const [stepKey, setStepKey] = React.useState('first')

      return (
        <div onClickCapture={(event) => event.preventDefault()}>
          <PageContainer navigation={{ mode: 'wizard', exitAction: { to: 'DEFAULT' }, stepKey }}>
            <WizardStepForm key={stepKey} stepName={stepKey} />
          </PageContainer>
          <button type="button" onClick={() => setStepKey('second')}>
            Next step
          </button>
        </div>
      )
    }

    const screen = renderWithApplicationContext(<StepWizard />, {
      withRouterContext: true,
      withDialogContext: true,
    })

    await userEvent.type(screen.getByLabelText('first field'), 'Unsaved first-step value')
    await userEvent.click(screen.getByRole('button', { name: 'Next step' }))
    await userEvent.click(screen.getByRole('link', { name: 'exitButton' }))

    expect(screen.queryByRole('dialog', { name: 'exitDialog.title' })).not.toBeInTheDocument()

    await userEvent.type(screen.getByLabelText('second field'), 'Unsaved second-step value')
    await userEvent.click(screen.getByRole('link', { name: 'exitButton' }))

    expect(screen.getByRole('dialog', { name: 'exitDialog.title' })).toBeInTheDocument()
  })

  it('confirms exit after a programmatic RHF setValue update', async () => {
    const ProgrammaticForm = () => {
      const methods = useForm({ defaultValues: { name: 'Initial' } })
      usePageContainerFormDirtyState(methods.control)

      return (
        <FormProvider {...methods}>
          <button type="button" onClick={() => methods.setValue('name', 'Updated')}>
            Update value
          </button>
        </FormProvider>
      )
    }

    const screen = renderWithApplicationContext(
      <PageContainer navigation={{ mode: 'wizard', exitAction: { to: 'DEFAULT' } }}>
        <ProgrammaticForm />
      </PageContainer>,
      { withRouterContext: true, withDialogContext: true }
    )

    await userEvent.click(screen.getByRole('button', { name: 'Update value' }))
    await userEvent.click(screen.getByRole('link', { name: 'exitButton' }))

    expect(screen.getByRole('dialog', { name: 'exitDialog.title' })).toBeInTheDocument()
  })

  it('confirms exit after a field-array item is removed', async () => {
    const FieldArrayForm = () => {
      const methods = useForm({
        defaultValues: { items: [{ value: 'first' }, { value: 'second' }] },
      })
      const { fields, remove } = useFieldArray({ control: methods.control, name: 'items' })
      usePageContainerFormDirtyState(methods.control)

      return (
        <FormProvider {...methods}>
          {fields.map((field, index) => (
            <button key={field.id} type="button" onClick={() => remove(index)}>
              Remove {index + 1}
            </button>
          ))}
        </FormProvider>
      )
    }

    const screen = renderWithApplicationContext(
      <PageContainer navigation={{ mode: 'wizard', exitAction: { to: 'DEFAULT' } }}>
        <FieldArrayForm />
      </PageContainer>,
      { withRouterContext: true, withDialogContext: true }
    )

    await userEvent.click(screen.getByRole('button', { name: 'Remove 2' }))
    await userEvent.click(screen.getByRole('link', { name: 'exitButton' }))

    expect(screen.getByRole('dialog', { name: 'exitDialog.title' })).toBeInTheDocument()
  })

  it('keeps unsaved changes when one of multiple form owners resets', async () => {
    const DescriptionForm = () => {
      const methods = useForm({ defaultValues: { description: '' } })
      usePageContainerFormDirtyState(methods.control)

      return (
        <button
          type="button"
          onClick={() => methods.setValue('description', 'Updated description')}
        >
          Update description
        </button>
      )
    }

    const UploadForm = () => {
      const methods = useForm({ defaultValues: { document: '' } })
      usePageContainerFormDirtyState(methods.control)

      return (
        <>
          <button type="button" onClick={() => methods.setValue('document', 'selected.pdf')}>
            Select document
          </button>
          <button type="button" onClick={() => methods.reset()}>
            Reset upload form
          </button>
        </>
      )
    }

    const screen = renderWithApplicationContext(
      <PageContainer navigation={{ mode: 'wizard', exitAction: { to: 'DEFAULT' } }}>
        <DescriptionForm />
        <UploadForm />
      </PageContainer>,
      { withRouterContext: true, withDialogContext: true }
    )

    await userEvent.click(screen.getByRole('button', { name: 'Update description' }))
    await userEvent.click(screen.getByRole('button', { name: 'Select document' }))
    await userEvent.click(screen.getByRole('button', { name: 'Reset upload form' }))
    await userEvent.click(screen.getByRole('link', { name: 'exitButton' }))

    expect(screen.getByRole('dialog', { name: 'exitDialog.title' })).toBeInTheDocument()
  })
})
