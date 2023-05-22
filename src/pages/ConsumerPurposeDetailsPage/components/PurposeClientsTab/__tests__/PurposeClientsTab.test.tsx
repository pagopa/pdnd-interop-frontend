import React from 'react'
import { mockUseJwt, renderWithApplicationContext } from '@/utils/testing.utils'
import { PurposeClientsTab } from '../PurposeClientsTab'
import { fireEvent } from '@testing-library/react'

describe('PurposeClientsTab', () => {
  it('should render an alert if the purpose is archived', () => {
    const screen = renderWithApplicationContext(
      <PurposeClientsTab purposeId="purposeId" isPurposeArchived />,
      {
        withReactQueryContext: true,
      }
    )

    expect(screen.getByRole('alert')).toBeInTheDocument()
  })

  it('should render an add button if the user is an admin', () => {
    mockUseJwt({ isAdmin: true })
    const screen = renderWithApplicationContext(
      <PurposeClientsTab purposeId="purposeId" isPurposeArchived={false} />,
      {
        withReactQueryContext: true,
      }
    )

    expect(screen.getByRole('button', { name: 'addBtn' })).toBeInTheDocument()
  })

  it('should open a dialog on add button click', () => {
    mockUseJwt({ isAdmin: true })
    const screen = renderWithApplicationContext(
      <PurposeClientsTab purposeId="purposeId" isPurposeArchived={false} />,
      {
        withReactQueryContext: true,
      }
    )

    const addBtn = screen.getByRole('button', { name: 'addBtn' })
    fireEvent.click(addBtn)
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  it('should match snapshot', () => {
    mockUseJwt({ isAdmin: true })
    const screen = renderWithApplicationContext(
      <PurposeClientsTab purposeId="purposeId" isPurposeArchived={false} />,
      {
        withReactQueryContext: true,
      }
    )

    expect(screen.baseElement).toMatchSnapshot()
  })
})
