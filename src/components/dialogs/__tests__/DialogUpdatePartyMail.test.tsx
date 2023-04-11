import React from 'react'
import { DialogUpdatePartyMail } from '../DialogUpdatePartyMail'
import { vi } from 'vitest'
import { PartyMutations } from '@/api/party/party.hooks'
import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import * as useJwtHook from '@/hooks/useJwt'
import { mockUseJwt } from '__mocks__/data/user.mocks'

vi.spyOn(useJwtHook, 'useJwt').mockImplementation(() => mockUseJwt())

const mockUpdatePartyMailFn = vi.fn()

vi.spyOn(PartyMutations, 'useUpdateMail').mockImplementation(
  () =>
    ({
      mutateAsync: mockUpdatePartyMailFn,
    } as unknown as ReturnType<(typeof PartyMutations)['useUpdateMail']>)
)

afterEach(() => {
  mockUpdatePartyMailFn.mockClear()
})

const emailMock = 'test@test.com'
const descriptionMock = 'description'

describe('DialogUpdatePartyMail testing', () => {
  it('should match the snapshot', () => {
    const screen = render(<DialogUpdatePartyMail type="updatePartyMail" />)
    expect(screen.baseElement).toMatchSnapshot()
  })

  it('should call the update party mail mutation', async () => {
    const screen = render(<DialogUpdatePartyMail type="updatePartyMail" />)
    const contactEmailInput = screen.getByLabelText('content.mailAddressField.label')
    const descriptionInput = screen.getByLabelText('content.descriptionField.label')
    const submitButton = screen.getByRole('button', { name: 'actions.edit' })
    const user = userEvent.setup()
    await user.type(contactEmailInput, emailMock)
    await user.type(descriptionInput, descriptionMock)
    await userEvent.click(submitButton)

    expect(mockUpdatePartyMailFn).toBeCalledWith({
      contactEmail: emailMock,
      description: descriptionMock,
      partyId: 'organizationId',
    })
  })

  it('should not call the update party mail mutation when the input is equal to the passed default values', async () => {
    const screen = render(
      <DialogUpdatePartyMail
        type="updatePartyMail"
        defaultValues={{ contactEmail: emailMock, description: descriptionMock }}
      />
    )
    const contactEmailInput = screen.getByLabelText('content.mailAddressField.label')
    const descriptionInput = screen.getByLabelText('content.descriptionField.label')
    const submitButton = screen.getByRole('button', { name: 'actions.edit' })
    const user = userEvent.setup()
    await user.type(contactEmailInput, emailMock)
    await user.type(descriptionInput, descriptionMock)
    await userEvent.click(submitButton)

    expect(mockUpdatePartyMailFn).not.toBeCalled()
  })

  it('should show validation message if description does not have a minimum length of 10', async () => {
    const screen = render(<DialogUpdatePartyMail type="updatePartyMail" />)
    const contactEmailInput = screen.getByLabelText('content.mailAddressField.label')
    const descriptionInput = screen.getByLabelText('content.descriptionField.label')
    const submitButton = screen.getByRole('button', { name: 'actions.edit' })
    const user = userEvent.setup()
    await user.type(contactEmailInput, emailMock)
    await user.type(descriptionInput, 'descr')
    await userEvent.click(submitButton)

    expect(screen.getByText('validation.string.minLength')).toBeInTheDocument()
    expect(mockUpdatePartyMailFn).not.toBeCalled()
  })
})
