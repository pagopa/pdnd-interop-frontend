import React from 'react'
import userEvent from '@testing-library/user-event'
import { renderWithApplicationContext } from '@/utils/testing.utils'
import { PageContainer } from '../PageContainer'

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
})
