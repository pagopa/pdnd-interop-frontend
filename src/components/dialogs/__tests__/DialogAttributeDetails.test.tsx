import React from 'react'
import { DialogAttributeDetails } from '../DialogAttributeDetails'
import { setupServer } from 'msw/node'
import { rest } from 'msw'
import { BACKEND_FOR_FRONTEND_URL } from '@/config/env'
import type { Attribute } from '@/api/api.generatedTypes'
import { renderWithApplicationContext } from '@/utils/testing.utils'
import { waitFor } from '@testing-library/react'
import { vi } from 'vitest'
import * as useJwtHook from '@/hooks/useJwt'
import { mockUseJwt } from '__mocks__/data/user.mocks'

vi.spyOn(useJwtHook, 'useJwt').mockImplementation(() => mockUseJwt())

const server = setupServer(
  rest.get(`${BACKEND_FOR_FRONTEND_URL}/attributes/:id`, (req, res, ctx) => {
    return res(
      ctx.json({
        id: 'id',
        name: 'name',
        kind: 'CERTIFIED',
        description: 'description',
        creationTime: '2021-01-01T00:00:00Z',
      } satisfies Attribute)
    )
  })
)

beforeAll(() => server.listen())
afterAll(() => server.close())

describe('DialogAttributeDetails testing', () => {
  it('should match the snapshot', async () => {
    const screen = renderWithApplicationContext(
      <DialogAttributeDetails
        type="showAttributeDetails"
        attribute={{
          id: 'id',
          name: 'name',
        }}
      />,
      { withReactQueryContext: true }
    )
    expect(screen.baseElement).toMatchSnapshot('loading state')
    await waitFor(() => expect(screen.getByText('description')).toBeDefined())
    expect(screen.baseElement).toMatchSnapshot('full state')
  })
})
