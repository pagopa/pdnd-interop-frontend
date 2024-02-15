import React from 'react'
import {
  mockUseCurrentRoute,
  mockUseGetActiveUserParty,
  renderWithApplicationContext,
} from '@/utils/testing.utils'
import type { AuthGuardProps } from '../AuthGuard'
import { AuthGuard } from '../AuthGuard'
import { createMockJwtUser } from '@/../__mocks__/data/user.mocks'
import { ErrorBoundary } from 'react-error-boundary'
import * as router from '@/router'

const useAuthGuardSpy = vi.spyOn(router, 'useAuthGuard')

mockUseCurrentRoute({
  routeKey: 'DEFAULT',
})

type AuthGuardTestProps = Omit<AuthGuardProps, 'children'>
const defaultProps: AuthGuardTestProps = {
  jwt: createMockJwtUser(),
  isIPAOrganization: true,
  isSupport: false,
  currentRoles: ['admin'],
}

const ErrorComponent = () => {
  return <div>error</div>
}

const renderAuthGuard = (props = defaultProps) => {
  return renderWithApplicationContext(
    <ErrorBoundary key="AuthGuardTest" FallbackComponent={ErrorComponent}>
      <AuthGuard {...props}>
        <div>children</div>
      </AuthGuard>
    </ErrorBoundary>,

    {
      withReactQueryContext: true,
      withRouterContext: true,
    }
  )
}

describe('AuthGuard', () => {
  it('Should be defined', () => {
    const { container } = renderAuthGuard()
    expect(container).toBeDefined()
  })

  it('Should render error component if user is not authorized', () => {
    mockUseGetActiveUserParty()

    useAuthGuardSpy.mockReturnValue({
      isPublic: false,
      authLevels: [],
      isUserAuthorized: () => false,
    })
    const { getByText } = renderAuthGuard()
    expect(getByText('error')).toBeInTheDocument()
  })

  it('Should be able to render children component if user is an "IPAOrganization" and he is authorized to access', () => {
    const props: AuthGuardTestProps = {
      ...defaultProps,
      isIPAOrganization: true,
    }
    mockUseGetActiveUserParty()

    useAuthGuardSpy.mockReturnValue({
      isPublic: false,
      authLevels: [],
      isUserAuthorized: () => true,
    })

    const { getByText } = renderAuthGuard(props)
    expect(getByText('children')).toBeInTheDocument()
  })

  it('Should render Error component when user try to access on certifiers route but he is not a certifier', () => {
    mockUseCurrentRoute({
      routeKey: 'TENANT_CERTIFIER',
    })
    const { getByText } = renderAuthGuard()
    expect(getByText('error')).toBeInTheDocument()
  })

  it("Should render Error component when user try to access on provider's route but he don't have right to do it", () => {
    const props: AuthGuardTestProps = {
      ...defaultProps,
      isIPAOrganization: false,
      isSupport: false,
    }

    useAuthGuardSpy.mockReturnValue({
      isPublic: false,
      authLevels: [],
      isUserAuthorized: () => true,
    })
    mockUseCurrentRoute({
      mode: 'provider',
    })
    mockUseGetActiveUserParty()

    const { getByText } = renderAuthGuard(props)
    expect(getByText('error')).toBeInTheDocument()
  })

  it('Should be able to access if the route is a certifiers route and user is a certifier', () => {
    useAuthGuardSpy.mockReturnValue({
      isPublic: false,
      authLevels: [],
      isUserAuthorized: () => true,
    })

    mockUseCurrentRoute({
      routeKey: 'TENANT_CERTIFIER',
    })

    mockUseGetActiveUserParty({
      data: {
        features: [{ certifier: { certifierId: 'certifierId' } }],
      },
    })

    const { getByText } = renderAuthGuard()
    expect(getByText('children')).toBeInTheDocument()
  })
})
