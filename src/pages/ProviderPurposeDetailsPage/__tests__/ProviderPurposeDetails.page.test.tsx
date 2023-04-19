import React from 'react'
import type { Purpose } from '@/api/api.generatedTypes'
import { BACKEND_FOR_FRONTEND_URL } from '@/config/env'
import { mockUseJwt, renderWithApplicationContext } from '@/utils/testing.utils'
import { createMockEServiceDescriptorCatalog } from '__mocks__/data/eservice.mocks'
import { createMockPurpose } from '__mocks__/data/purpose.mocks'
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import ProviderPurposeDetailsPage from '../ProviderPurposeDetailsPage'
import { waitFor } from '@testing-library/react'
import * as router from '@/router'
import { vi } from 'vitest'

mockUseJwt()
vi.spyOn(router, 'useRouteParams').mockReturnValue({ purposeId: 'purposeId' })

const server = setupServer(
  rest.get(`${BACKEND_FOR_FRONTEND_URL}/purposes/:purposeId`, (req, res, ctx) => {
    return res(ctx.json<Purpose>(createMockPurpose({ title: 'purpose-title' })))
  }),
  rest.get(
    `${BACKEND_FOR_FRONTEND_URL}/catalog/eservices/:eserviceId/descriptor/:descriptorId`,
    (req, res, ctx) => {
      return res(ctx.json(createMockEServiceDescriptorCatalog()))
    }
  )
)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

describe('ProviderPurposeDetailsPage', () => {
  it('should match the snapshot', async () => {
    const screen = renderWithApplicationContext(<ProviderPurposeDetailsPage />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    expect(screen.baseElement).toMatchSnapshot('loading state')
    await waitFor(() => screen.findByRole('heading', { name: 'purpose-title' }))
    expect(screen.baseElement).toMatchSnapshot('full state')
  })
})
