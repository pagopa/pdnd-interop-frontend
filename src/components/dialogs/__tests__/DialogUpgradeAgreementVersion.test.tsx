import React from 'react'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { DialogUpgradeAgreementVersion } from '../DialogUpgradeAgreementVersion'
import { renderWithApplicationContext } from '@/utils/testing.utils'
import { createMockAgreement } from '@/../__mocks__/data/agreement.mocks'
import { SupportActionGuardProvider } from '@/hooks/useIsActionDisabledBySupport'
import { AgreementMutations } from '@/api/agreement'

const mockUpgradeAgreement = vi.fn()

vi.mock('@/api/agreement', () => ({
  AgreementMutations: {
    useUpgrade: vi.fn(),
  },
}))

const agreement = createMockAgreement()
const checkboxLabels = [
  'content.checkboxesForm.attributesCheckLabel',
  'content.checkboxesForm.apiIntegrationCheckLabel',
  'content.checkboxesForm.testEnvCheckLabel',
]

function renderDialog({ isSupport = false }: { isSupport?: boolean } = {}) {
  return renderWithApplicationContext(
    <SupportActionGuardProvider isSupport={isSupport}>
      <DialogUpgradeAgreementVersion agreement={agreement} hasMissingAttributes={false} />
    </SupportActionGuardProvider>,
    {
      withReactQueryContext: true,
      withRouterContext: true,
    }
  )
}

describe('DialogUpgradeAgreementVersion', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(AgreementMutations.useUpgrade).mockReturnValue({
      mutate: mockUpgradeAgreement,
    } as ReturnType<typeof AgreementMutations.useUpgrade>)
  })

  it('enables the upgrade action only after all confirmation checkboxes are selected', async () => {
    const user = userEvent.setup()

    renderDialog()

    const upgradeButton = screen.getByRole('button', { name: 'actions.upgrade.label' })
    expect(upgradeButton).toBeDisabled()

    await user.hover(upgradeButton.parentElement!)

    expect(await screen.findByText('actions.upgrade.notAllCheckboxCheckedTooltip')).toBeVisible()

    for (const label of checkboxLabels) {
      await user.click(screen.getByRole('checkbox', { name: label }))
    }

    expect(upgradeButton).toBeEnabled()

    await user.click(upgradeButton)

    expect(mockUpgradeAgreement).toHaveBeenCalledTimes(1)
  })

  it('keeps the upgrade action disabled for support users even when all checkboxes are selected', async () => {
    const user = userEvent.setup()

    renderDialog({ isSupport: true })

    for (const label of checkboxLabels) {
      await user.click(screen.getByRole('checkbox', { name: label }))
    }

    const upgradeButton = screen.getByRole('button', { name: 'actions.upgrade.label' })
    expect(upgradeButton).toBeDisabled()

    await user.hover(upgradeButton.parentElement!)

    expect(await screen.findByText('actions.upgrade.supportDisableInfo')).toBeVisible()
    expect(mockUpgradeAgreement).not.toHaveBeenCalled()
  })
})
