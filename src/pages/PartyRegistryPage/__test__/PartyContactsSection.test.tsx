import {
  mockUseGetActiveUserParty,
  mockUseJwt,
  renderWithApplicationContext,
} from '@/utils/testing.utils'
import { PartyContactsSection } from '../components'
import { screen } from '@testing-library/react'

mockUseGetActiveUserParty({
  data: {
    contactMail: {
      address: 'test@mail.com',
      description: 'email-test',
    },
  },
})

describe('PartyContactsSection', () => {
  mockUseJwt({ currentRoles: ['admin'], isAdmin: true })

  it('should render PartyContactsSection correctly', () => {
    renderWithApplicationContext(<PartyContactsSection />, {
      withRouterContext: true,
      withReactQueryContext: true,
    })
    expect(screen).toBeDefined()
  })
  it('should render email address', () => {
    renderWithApplicationContext(<PartyContactsSection />, {
      withRouterContext: true,
      withReactQueryContext: true,
    })

    expect(screen.getByText('test@mail.com')).toBeInTheDocument()
  })

  describe('ADMIN user', () => {
    it('should render edit button', () => {
      mockUseJwt({ currentRoles: ['admin'], isAdmin: true })

      renderWithApplicationContext(<PartyContactsSection />, {
        withRouterContext: true,
        withReactQueryContext: true,
      })
      expect(screen.getByRole('button', { name: /edit/i })).toBeInTheDocument()
    })
  })

  describe('NOT-ADMIN user', () => {
    it('should not render edit button', () => {
      mockUseJwt({ currentRoles: ['api'], isAdmin: false })

      renderWithApplicationContext(<PartyContactsSection />, {
        withRouterContext: true,
        withReactQueryContext: true,
      })
      expect(screen.queryByRole('button', { name: /edit/i })).not.toBeInTheDocument()
    })
  })
})
