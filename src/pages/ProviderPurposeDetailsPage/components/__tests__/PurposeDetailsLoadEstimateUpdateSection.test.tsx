import React from 'react'
import { renderWithApplicationContext } from '@/utils/testing.utils'
import { PurposeDetailsLoadEstimateUpdateSection } from '../PurposeDetailsLoadEstimateUpdateSection'
import { createMockPurpose } from '__mocks__/data/purpose.mocks'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import { PurposeMutations } from '@/api/purpose'

const purposeMock = createMockPurpose({ waitingForApprovalVersion: { id: 'id' } })

describe('PurposeDetailsLoadEstimateUpdateSection', () => {
  it('should match the snapshot', () => {
    const { baseElement } = renderWithApplicationContext(
      <PurposeDetailsLoadEstimateUpdateSection purpose={purposeMock} />,
      { withReactQueryContext: true }
    )

    expect(baseElement).toMatchSnapshot()
  })

  it('should match the snapshot with waitingForApprovalVersion with expected approval date', () => {
    const { baseElement } = renderWithApplicationContext(
      <PurposeDetailsLoadEstimateUpdateSection
        purpose={createMockPurpose({
          waitingForApprovalVersion: { id: 'id', expectedApprovalDate: '01/01/1990' },
        })}
      />,
      { withReactQueryContext: true }
    )

    expect(baseElement).toMatchSnapshot()
  })

  it('should not render if purpose is undefined', () => {
    const { container } = renderWithApplicationContext(
      <PurposeDetailsLoadEstimateUpdateSection purpose={undefined} />,
      { withReactQueryContext: true }
    )

    expect(container).toBeEmptyDOMElement()
  })

  it('should not render if purpose does not have a waiting for approval version', () => {
    const { container } = renderWithApplicationContext(
      <PurposeDetailsLoadEstimateUpdateSection
        purpose={createMockPurpose({ waitingForApprovalVersion: undefined })}
      />,
      { withReactQueryContext: true }
    )

    expect(container).toBeEmptyDOMElement()
  })

  it('should call activateVersion when confirm update button is clicked', async () => {
    const activateVersionFn = vi.fn()
    vi.spyOn(PurposeMutations, 'useActivateVersion').mockReturnValue({
      mutate: activateVersionFn,
    } as unknown as ReturnType<typeof PurposeMutations.useActivateVersion>)

    const screen = renderWithApplicationContext(
      <PurposeDetailsLoadEstimateUpdateSection purpose={purposeMock} />,
      { withReactQueryContext: true }
    )

    const user = userEvent.setup()
    await user.click(screen.getByRole('button', { name: 'confirmUpdate' }))
    expect(activateVersionFn).toHaveBeenCalled()
  })

  it('should open model when set activation date button is clicked', async () => {
    const screen = renderWithApplicationContext(
      <PurposeDetailsLoadEstimateUpdateSection purpose={purposeMock} />,
      { withReactQueryContext: true }
    )

    const user = userEvent.setup()
    await user.click(screen.getByRole('button', { name: 'updateCompletionDate' }))
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })
})
