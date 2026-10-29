import React from 'react'
import userEvent from '@testing-library/user-event'
import { FormProvider, useFieldArray, useForm } from 'react-hook-form'
import { renderWithApplicationContext } from '@/utils/testing.utils'
import { PageContainer, usePageContainerFormDirtyState } from '../PageContainer'

describe('PageContainer', () => {
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
