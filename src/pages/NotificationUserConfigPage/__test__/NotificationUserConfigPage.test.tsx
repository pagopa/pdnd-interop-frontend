import { mockUseJwt, renderWithApplicationContext } from '@/utils/testing.utils'
import { screen, waitFor } from '@testing-library/react'
import NotificationUserConfigPage from '../NotificationUserConfig.page'
import { BACKEND_FOR_FRONTEND_URL } from '@/config/env'
import type { UserNotificationConfig } from '@/api/api.generatedTypes'
import { createUserNotificationConfigs } from '../../../../__mocks__/data/notification.mocks'
import { rest } from 'msw'
import { setupServer } from 'msw/node'

mockUseJwt()

const server = setupServer(
  rest.get(`${BACKEND_FOR_FRONTEND_URL}/userNotificationConfigs`, (_, res, ctx) => {
    return res(ctx.json<UserNotificationConfig>(createUserNotificationConfigs()))
  })
)
beforeAll(() => server.listen())

describe('NotificationUserConfigPage', () => {
  beforeEach(() => {
    renderWithApplicationContext(<NotificationUserConfigPage />, {
      withRouterContext: true,
      withReactQueryContext: true,
    })
  })

  it('Should be visible a Skeleton when the page is loading', () => {
    expect(screen.getByTestId('notification-page-skeleton')).toBeInTheDocument()
  })

  it('Should be visible the page title and page description even if the page is loading', () => {
    expect(screen.getByText('title')).toBeInTheDocument()
    expect(screen.getByText('description')).toBeInTheDocument()
  })

  it('Should be visible the two tabs even if the page has been loaded', () => {
    waitFor(() => {
      expect(screen.getByRole('tab', { name: 'inAppTabTitle' })).toBeInTheDocument()
      expect(screen.getByRole('tab', { name: 'emailTabTitle' })).toBeInTheDocument()
    })
  })
})
