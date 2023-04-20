import React from 'react'
import { mockUseJwt, renderWithApplicationContext } from '@/utils/testing.utils'
import { PartyContacts, PartyContactsSkeleton } from '../PartyContacts'
import { render } from '@testing-library/react'
import { createMockRemappedTenant } from '__mocks__/data/user.mocks'
import userEvent from '@testing-library/user-event'
import { mockGetActiveUserPartySpy } from './test.commons'

describe('PartyContacts', () => {
  it('should match snapshot and render edit button if user is admin', () => {
    mockUseJwt({ isAdmin: true })
    mockGetActiveUserPartySpy(createMockRemappedTenant())
    const { baseElement, getByRole } = renderWithApplicationContext(<PartyContacts />, {
      withDialogContext: true,
    })
    expect(baseElement).toMatchSnapshot()

    expect(getByRole('button', { name: 'actions.edit' })).toBeInTheDocument()
  })

  it('should match snapshot and not render edit button if user is not an admin', () => {
    mockUseJwt({ isAdmin: false })
    mockGetActiveUserPartySpy(createMockRemappedTenant())
    const { baseElement, queryByRole } = renderWithApplicationContext(<PartyContacts />, {
      withDialogContext: true,
    })
    expect(baseElement).toMatchSnapshot()

    expect(queryByRole('button', { name: 'actions.edit' })).not.toBeInTheDocument()
  })

  it('should open dialog when edit button is clicked', async () => {
    mockUseJwt({ isAdmin: true })
    mockGetActiveUserPartySpy(createMockRemappedTenant())
    const { getByRole } = renderWithApplicationContext(<PartyContacts />, {
      withDialogContext: true,
    })

    const uset = userEvent.setup()

    await uset.click(getByRole('button', { name: 'actions.edit' }))

    expect(getByRole('dialog')).toBeInTheDocument()
  })
})

describe('PartyContactsSkeleton', () => {
  it('should match snapshot', () => {
    const { baseElement } = render(<PartyContactsSkeleton />)
    expect(baseElement).toMatchSnapshot()
  })
})
