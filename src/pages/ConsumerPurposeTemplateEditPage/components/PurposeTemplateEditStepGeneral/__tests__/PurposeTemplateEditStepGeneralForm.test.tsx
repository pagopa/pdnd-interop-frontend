import React from 'react'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createMockPurposeTemplate } from '../../../../../../__mocks__/data/purposeTemplate.mocks'
import { renderWithApplicationContext } from '@/utils/testing.utils'
import PurposeTemplateEditStepGeneralForm, {
  type PurposeTemplateEditStepGeneralFormValues,
} from '../PurposeTemplateEditStepGeneralForm'

const updateDraftMock = vi.fn()

vi.mock('@/api/purposeTemplate/purposeTemplate.mutations', () => ({
  PurposeTemplateMutations: {
    useUpdateDraft: () => ({ mutate: updateDraftMock }),
  },
}))

const purposeTemplate = createMockPurposeTemplate({
  id: 'purpose-template-id',
  purposeIsFreeOfCharge: true,
  purposeFreeOfChargeReason: 'A valid free of charge reason',
})

const defaultValues = {
  purposeTitle: 'Test purpose template',
  purposeDescription: 'A valid purpose template description',
  targetTenantKind: 'PA',
  targetDescription: 'A valid target description',
  purposeIsFreeOfCharge: true,
  purposeFreeOfChargeReason: 'A valid free of charge reason',
  purposeDailyCalls: 10,
  handlesPersonalData: true,
} satisfies PurposeTemplateEditStepGeneralFormValues

function renderComponent(isFreeOfCharge = true) {
  return renderWithApplicationContext(
    <PurposeTemplateEditStepGeneralForm
      purposeTemplate={purposeTemplate}
      defaultValues={{ ...defaultValues, purposeIsFreeOfCharge: isFreeOfCharge }}
      activeStep={0}
      forward={vi.fn()}
      back={vi.fn()}
    />,
    { withReactQueryContext: true, withRouterContext: true }
  )
}

describe('PurposeTemplateEditStepGeneralForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('shows the free of charge reason when the switch is enabled', () => {
    renderComponent()

    expect(
      screen.getByRole('checkbox', {
        name: 'edit.step1.purposeTemplateIsFreeOfCharge.switchLabel',
      })
    ).toBeChecked()
    expect(
      screen.getByRole('textbox', {
        name: 'edit.step1.purposeTemplateIsFreeOfCharge.reasonField.label',
      })
    ).toBeInTheDocument()
  })

  it('shows the free of charge reason after enabling the switch', async () => {
    const user = userEvent.setup()
    renderComponent(false)

    const freeOfChargeSwitch = screen.getByRole('checkbox', {
      name: 'edit.step1.purposeTemplateIsFreeOfCharge.switchLabel',
    })

    expect(freeOfChargeSwitch).not.toBeChecked()
    expect(
      screen.queryByRole('textbox', {
        name: 'edit.step1.purposeTemplateIsFreeOfCharge.reasonField.label',
      })
    ).not.toBeInTheDocument()

    await user.click(freeOfChargeSwitch)

    expect(
      screen.getByRole('textbox', {
        name: 'edit.step1.purposeTemplateIsFreeOfCharge.reasonField.label',
      })
    ).toBeInTheDocument()
  })

  it('omits the free of charge reason from the payload when the switch is disabled', async () => {
    const user = userEvent.setup()
    renderComponent(false)

    await user.click(screen.getByRole('button', { name: 'edit.forwardWithSaveBtn' }))

    await waitFor(() => {
      expect(updateDraftMock).toHaveBeenCalledTimes(1)
    })

    const payload = updateDraftMock.mock.calls[0]?.[0]
    expect(payload).toMatchObject({
      purposeTemplateId: 'purpose-template-id',
      purposeIsFreeOfCharge: false,
    })
    expect(payload).not.toHaveProperty('purposeFreeOfChargeReason')
  })
})
